import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, isMongoConnected, IUser } from './db';
import { INITIAL_USER_PROFILE } from '../src/data/mockNewsData';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'chr_access_secret_super_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'chr_refresh_secret_super_key';

// In-Memory store fallback
export const memoryUserStore = new Map<string, any>(); // email -> user info

// Optional pre-seed admin user in memory fallback if explicitly defined in environment
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();
  const defaultAdminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Chronicle Administrator';
  const adminUserObj = {
    id: 'usr_admin_001',
    name: adminName,
    email: adminEmail,
    passwordHash: bcrypt.hashSync(defaultAdminPassword, 10),
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'admin' as const,
    plan: 'Enterprise SaaS' as const,
    interests: ['AI & Technology', 'Science & Space'],
    readingStats: { ...INITIAL_USER_PROFILE.readingStats },
    preferences: { ...INITIAL_USER_PROFILE.preferences },
    isVerified: true,
    createdAt: new Date()
  };
  memoryUserStore.set(adminEmail, adminUserObj);
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function generateAccessToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(user, JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(user, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

// Authentication middleware
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Access token required.' });
    return;
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Access token expired or invalid.' });
      return;
    }
    req.user = decoded;
    next();
  });
}

// Role-Based Authorization Middleware
export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    const userRole = req.user.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]` });
      return;
    }
    next();
  };
}

// Strict Database-Verified Admin Role Middleware
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Access token required. Please sign in as an administrator.' });
    return;
  }

  try {
    let actualRole: string | undefined;

    if (isMongoConnected()) {
      let dbUser: any = null;
      if (mongoose.Types.ObjectId.isValid(req.user.id)) {
        dbUser = await User.findById(req.user.id).select('role email').lean();
      }
      if (!dbUser && req.user.email) {
        dbUser = await User.findOne({ email: req.user.email.toLowerCase() }).select('role email').lean();
      }
      if (!dbUser) {
        res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
        return;
      }
      actualRole = dbUser.role;
    } else {
      const memUser = memoryUserStore.get(req.user.email?.toLowerCase());
      actualRole = memUser?.role;
    }

    if (actualRole !== 'admin') {
      res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
      return;
    }

    // Role verified from trusted database record
    req.user.role = 'admin';
    next();
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to verify admin authorization: ' + err.message });
  }
}

// Ensure Initial Administrator Account in MongoDB Atlas or Memory Store
export async function ensureInitialAdminUser() {
  const envAdminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase().trim() : null;
  const envAdminPassword = process.env.ADMIN_PASSWORD;
  const envAdminName = process.env.ADMIN_NAME || 'Chronicle Administrator';

  if (!envAdminEmail || !envAdminPassword) {
    if (isMongoConnected()) {
      try {
        const existingAdmins = await User.countDocuments({ role: 'admin' });
        if (existingAdmins > 0) {
          console.log(`[Admin Security] Verified ${existingAdmins} administrator account(s) active in MongoDB Atlas.`);
        } else {
          console.log('[Admin Security] No administrator account found in MongoDB Atlas. Initial administrator setup available at /admin/register.');
        }
      } catch (e: any) {
        console.error('[Admin Security] Error checking admin status:', e.message);
      }
    } else {
      let count = 0;
      for (const u of memoryUserStore.values()) {
        if (u.role === 'admin') count++;
      }
      if (count > 0) {
        console.log(`[Admin Security] Verified ${count} administrator account(s) active in memory store.`);
      } else {
        console.log('[Admin Security] Initial administrator setup available at /admin/register.');
      }
    }
    return;
  }

  const passwordHash = await bcrypt.hash(envAdminPassword, 10);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(envAdminName)}&background=6366f1&color=fff&size=200`;

  // Keep in-memory store updated
  const adminMemUser = {
    id: 'usr_admin_001',
    name: envAdminName,
    email: envAdminEmail,
    passwordHash,
    avatarUrl,
    role: 'admin' as const,
    plan: 'Enterprise SaaS' as const,
    interests: ['AI & Technology', 'Science & Space'],
    readingStats: { ...INITIAL_USER_PROFILE.readingStats },
    preferences: { ...INITIAL_USER_PROFILE.preferences },
    isVerified: true,
    createdAt: new Date()
  };
  memoryUserStore.set(envAdminEmail, adminMemUser);

  if (isMongoConnected()) {
    try {
      let existingUser = await User.findOne({ email: envAdminEmail });
      if (!existingUser) {
        existingUser = new User({
          name: envAdminName,
          email: envAdminEmail,
          passwordHash,
          avatarUrl,
          role: 'admin',
          plan: 'Enterprise SaaS',
          isVerified: true
        });
        await existingUser.save();
        console.log(`[Admin Security] Secure Initial Administrator account created in MongoDB Atlas: ${envAdminEmail}`);
      } else if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        existingUser.passwordHash = passwordHash;
        await existingUser.save();
        console.log(`[Admin Security] Existing account promoted to Administrator in MongoDB Atlas: ${envAdminEmail}`);
      } else {
        console.log(`[Admin Security] Administrator account verified in MongoDB Atlas: ${envAdminEmail}`);
      }
    } catch (e: any) {
      console.error('[Admin Security] Error checking initial admin in MongoDB:', e.message);
    }
  }
}

// Dedicated Admin Login Handler
export async function handleAdminLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Admin email and password are required.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        res.status(401).json({ error: 'Invalid administrator email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid administrator email or password.' });
        return;
      }

      // Check user's actual admin role from trusted database record
      if (user.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. You do not have administrator privileges.' });
        return;
      }

      const tokenUser = { id: user._id.toString(), email: user.email, role: 'admin' };
      const accessToken = generateAccessToken(tokenUser);
      const refreshToken = generateRefreshToken(tokenUser);
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        success: true,
        token: accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: 'admin',
          plan: user.plan
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Database error during admin login.' });
    }
  } else {
    // Memory store fallback
    const user = memoryUserStore.get(normalizedEmail);
    if (!user) {
      res.status(401).json({ error: 'Invalid administrator email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid administrator email or password.' });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied. You do not have administrator privileges.' });
      return;
    }

    const tokenUser = { id: user.id, email: normalizedEmail, role: 'admin' };
    const accessToken = generateAccessToken(tokenUser);
    const refreshToken = generateRefreshToken(tokenUser);

    res.json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: 'admin',
        plan: user.plan
      }
    });
  }
}

// Dedicated Admin Profile / Session Check Handler
export async function handleAdminMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  try {
    if (isMongoConnected()) {
      let dbUser: any = null;
      if (mongoose.Types.ObjectId.isValid(req.user.id)) {
        dbUser = await User.findById(req.user.id);
      }
      if (!dbUser && req.user.email) {
        dbUser = await User.findOne({ email: req.user.email.toLowerCase() });
      }
      if (!dbUser || dbUser.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
        return;
      }
      res.json({
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        avatarUrl: dbUser.avatarUrl,
        role: 'admin',
        plan: dbUser.plan
      });
    } else {
      const memUser = memoryUserStore.get(req.user.email?.toLowerCase());
      if (!memUser || memUser.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
        return;
      }
      res.json({
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        avatarUrl: memUser.avatarUrl,
        role: 'admin',
        plan: memUser.plan
      });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}


// Check if Initial Admin Setup is available or restricted
export async function handleAdminSetupStatus(req: Request, res: Response) {
  try {
    let adminExists = false;
    if (isMongoConnected()) {
      const existing = await User.findOne({ role: 'admin' });
      adminExists = !!existing;
    } else {
      for (const u of memoryUserStore.values()) {
        if (u.role === 'admin') {
          adminExists = true;
          break;
        }
      }
    }

    if (adminExists) {
      res.json({
        setupAvailable: false,
        message: 'Administrator registration is restricted. Please contact the system administrator.',
        requiresToken: false
      });
    } else {
      res.json({
        setupAvailable: true,
        message: 'Initial administrator setup is available.',
        requiresToken: !!process.env.ADMIN_SETUP_TOKEN
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Secure First Administrator Setup (Only available when 0 administrators exist)
export async function handleFirstAdminSetup(req: Request, res: Response) {
  try {
    const { name, email, password, confirmPassword, setupToken } = req.body;

    let adminExists = false;
    if (isMongoConnected()) {
      const existing = await User.findOne({ role: 'admin' });
      adminExists = !!existing;
    } else {
      for (const u of memoryUserStore.values()) {
        if (u.role === 'admin') {
          adminExists = true;
          break;
        }
      }
    }

    if (adminExists) {
      res.status(403).json({
        error: 'Administrator registration is restricted. Please contact the system administrator.'
      });
      return;
    }

    // Verify setup token if configured in environment
    if (process.env.ADMIN_SETUP_TOKEN) {
      if (!setupToken || setupToken !== process.env.ADMIN_SETUP_TOKEN) {
        res.status(403).json({ error: 'Invalid or missing administrator setup authorization token.' });
        return;
      }
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Admin name is required (at least 2 characters).' });
      return;
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ error: 'Administrator password must be at least 8 characters long.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=200`;

    if (isMongoConnected()) {
      let user = await User.findOne({ email: normalizedEmail });
      if (user) {
        user.name = name.trim();
        user.passwordHash = passwordHash;
        user.role = 'admin';
        user.isVerified = true;
        user.plan = 'Enterprise SaaS';
        await user.save();
      } else {
        user = new User({
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
          avatarUrl,
          role: 'admin',
          plan: 'Enterprise SaaS',
          isVerified: true
        });
        await user.save();
      }

      const tokenUser = { id: user._id.toString(), email: user.email, role: 'admin' };
      const accessToken = generateAccessToken(tokenUser);
      const refreshToken = generateRefreshToken(tokenUser);
      user.refreshToken = refreshToken;
      await user.save();

      res.status(201).json({
        success: true,
        message: 'Initial administrator account created successfully.',
        token: accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: 'admin',
          plan: user.plan
        }
      });
    } else {
      const id = 'usr_admin_' + Date.now();
      const adminUser = {
        id,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        avatarUrl,
        role: 'admin' as const,
        plan: 'Enterprise SaaS' as const,
        interests: ['AI & Technology', 'Science & Space'],
        readingStats: { ...INITIAL_USER_PROFILE.readingStats },
        preferences: { ...INITIAL_USER_PROFILE.preferences },
        isVerified: true,
        createdAt: new Date()
      };
      memoryUserStore.set(normalizedEmail, adminUser);

      const tokenUser = { id, email: normalizedEmail, role: 'admin' };
      const accessToken = generateAccessToken(tokenUser);
      const refreshToken = generateRefreshToken(tokenUser);

      res.status(201).json({
        success: true,
        message: 'Initial administrator account created successfully.',
        token: accessToken,
        refreshToken,
        user: {
          id,
          name: adminUser.name,
          email: adminUser.email,
          avatarUrl: adminUser.avatarUrl,
          role: 'admin',
          plan: adminUser.plan
        }
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create initial administrator: ' + err.message });
  }
}

// Authenticated Administrator-Only: Provision Another Administrator Account
export async function handleCreateAdminByAdmin(req: AuthRequest, res: Response) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Admin name is required.' });
      return;
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=200`;

    if (isMongoConnected()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        if (existing.role === 'admin') {
          res.status(409).json({ error: 'An administrator with this email already exists.' });
          return;
        }
        existing.role = 'admin';
        existing.name = name.trim();
        existing.passwordHash = passwordHash;
        existing.isVerified = true;
        await existing.save();

        res.status(200).json({
          success: true,
          message: `User ${normalizedEmail} successfully promoted to Administrator.`,
          user: {
            id: existing._id.toString(),
            name: existing.name,
            email: existing.email,
            avatarUrl: existing.avatarUrl,
            role: 'admin',
            plan: existing.plan
          }
        });
        return;
      }

      const newAdmin = new User({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        avatarUrl,
        role: 'admin',
        plan: 'Enterprise SaaS',
        isVerified: true
      });
      await newAdmin.save();

      res.status(201).json({
        success: true,
        message: 'New Administrator account created successfully.',
        user: {
          id: newAdmin._id.toString(),
          name: newAdmin.name,
          email: newAdmin.email,
          avatarUrl: newAdmin.avatarUrl,
          role: 'admin',
          plan: newAdmin.plan
        }
      });
    } else {
      const existing = memoryUserStore.get(normalizedEmail);
      if (existing && existing.role === 'admin') {
        res.status(409).json({ error: 'An administrator with this email already exists.' });
        return;
      }

      const id = 'usr_admin_' + Date.now();
      const adminUser = {
        id,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        avatarUrl,
        role: 'admin' as const,
        plan: 'Enterprise SaaS' as const,
        interests: ['AI & Technology'],
        readingStats: { ...INITIAL_USER_PROFILE.readingStats },
        preferences: { ...INITIAL_USER_PROFILE.preferences },
        isVerified: true,
        createdAt: new Date()
      };
      memoryUserStore.set(normalizedEmail, adminUser);

      res.status(201).json({
        success: true,
        message: 'New Administrator account created successfully.',
        user: {
          id,
          name: adminUser.name,
          email: adminUser.email,
          avatarUrl: adminUser.avatarUrl,
          role: 'admin',
          plan: adminUser.plan
        }
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create administrator: ' + err.message });
  }
}

// --- Route Handlers ---

export async function handleRegister(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 10);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=6366f1&color=fff&size=200`;

  if (isMongoConnected()) {
    try {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        res.status(409).json({ error: 'An account with this email already exists.' });
        return;
      }
      const user = new User({
        name: name || email.split('@')[0],
        email: normalizedEmail,
        passwordHash,
        avatarUrl,
        role: 'user',
        plan: 'Free Tier',
        isVerified: false,
        verificationToken: Math.random().toString(36).substring(2, 10).toUpperCase()
      });
      await user.save();
      const tokenUser = { id: user._id.toString(), email: user.email, role: 'user' };
      const accessToken = generateAccessToken(tokenUser);
      const refreshToken = generateRefreshToken(tokenUser);
      user.refreshToken = refreshToken;
      await user.save();

      res.status(201).json({
        success: true,
        token: accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: 'user',
          plan: user.plan
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Database error during registration.' });
    }
  } else {
    // Memory store fallback
    if (memoryUserStore.has(normalizedEmail)) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }
    const id = 'usr_' + Math.random().toString(36).substring(2, 10);
    const newUser = {
      id,
      name: name || email.split('@')[0],
      email: normalizedEmail,
      passwordHash,
      avatarUrl,
      role: 'user' as const,
      plan: 'Free Tier' as const,
      interests: ['AI & Technology'],
      readingStats: { ...INITIAL_USER_PROFILE.readingStats },
      preferences: { ...INITIAL_USER_PROFILE.preferences },
      isVerified: false,
      verificationToken: 'MOCK_VERIFY_TOKEN'
    };
    memoryUserStore.set(normalizedEmail, newUser);
    const tokenUser = { id, email: normalizedEmail, role: 'user' };
    const accessToken = generateAccessToken(tokenUser);
    const refreshToken = generateRefreshToken(tokenUser);

    res.status(201).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id,
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        role: newUser.role,
        plan: newUser.plan
      }
    });
  }
}

export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }
      const tokenUser = { id: user._id.toString(), email: user.email, role: user.role };
      const accessToken = generateAccessToken(tokenUser);
      const refreshToken = generateRefreshToken(tokenUser);
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        success: true,
        token: accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
          plan: user.plan
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Database error during login.' });
    }
  } else {
    // Memory store fallback: check or auto-create for seamless development testing
    let user = memoryUserStore.get(normalizedEmail);
    if (!user) {
      const id = 'usr_' + Math.random().toString(36).substring(2, 10);
      user = {
        id,
        name: email.split('@')[0],
        email: normalizedEmail,
        passwordHash: bcrypt.hashSync(password, 10),
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6366f1&color=fff&size=200`,
        role: 'subscriber' as const,
        plan: 'Free Tier' as const,
        interests: ['AI & Technology', 'Science & Space'],
        readingStats: { ...INITIAL_USER_PROFILE.readingStats },
        preferences: { ...INITIAL_USER_PROFILE.preferences },
        isVerified: true
      };
      memoryUserStore.set(normalizedEmail, user);
    } else if (!(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      return;
    }
    const tokenUser = { id: user.id, email: normalizedEmail, role: user.role };
    const accessToken = generateAccessToken(tokenUser);
    const refreshToken = generateRefreshToken(tokenUser);

    res.json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        plan: user.plan
      }
    });
  }
}

export async function handleRefreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token is required.' });
    return;
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired refresh token.' });
      return;
    }

    const { id, email, role } = decoded;
    const newAccessToken = generateAccessToken({ id, email, role });
    res.json({ success: true, token: newAccessToken });
  });
}

export async function handleVerifyEmail(req: Request, res: Response) {
  const { token, email } = req.body;
  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: email?.toLowerCase() });
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
      res.json({ success: true, message: 'Email verified successfully.' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const user = memoryUserStore.get(email?.toLowerCase());
    if (user) {
      user.isVerified = true;
      res.json({ success: true, message: 'Email verified successfully.' });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  }
}

export async function handleForgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const resetToken = Math.random().toString(36).substring(2, 10).toUpperCase();

  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: email?.toLowerCase() });
      if (user) {
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
      }
    } catch {}
  } else {
    const user = memoryUserStore.get(email?.toLowerCase());
    if (user) {
      user.resetPasswordToken = resetToken;
    }
  }

  // Simulated email delivery log
  console.log(`[SMTP Mailer Simulation] Password Reset Code [${resetToken}] sent to ${email}`);
  res.json({ success: true, message: `Password reset instructions sent to ${email}` });
}

export async function handleResetPassword(req: Request, res: Response) {
  const { email, token, newPassword } = req.body;
  if (!email || !newPassword) {
    res.status(400).json({ error: 'Email and new password are required.' });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }
      user.passwordHash = passwordHash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.json({ success: true, message: 'Password reset successfully.' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const user = memoryUserStore.get(email.toLowerCase());
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    res.json({ success: true, message: 'Password reset successfully.' });
  }
}

export async function handleGoogleOAuth(req: Request, res: Response) {
  const { credential } = req.body; // mock google token payload
  const mockPayload = credential ? JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString()) : null;
  
  if (!mockPayload) {
    res.status(400).json({ error: 'Invalid Google credentials.' });
    return;
  }

  const email = mockPayload.email;
  const name = mockPayload.name;
  const avatarUrl = mockPayload.picture;

  if (isMongoConnected()) {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name,
          email,
          passwordHash: await bcrypt.hash('OAuthGoogleGenerated_' + Math.random(), 10),
          avatarUrl,
          isVerified: true
        });
      }
      const tokenUser = { id: user._id.toString(), email: user.email, role: user.role };
      const accessToken = generateAccessToken(tokenUser);
      const refreshToken = generateRefreshToken(tokenUser);
      user.refreshToken = refreshToken;
      await user.save();

      res.json({ success: true, token: accessToken, refreshToken, user: { id: user._id.toString(), name, email, avatarUrl, role: user.role, plan: user.plan } });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  } else {
    let user = memoryUserStore.get(email);
    if (!user) {
      user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 10),
        name,
        email,
        passwordHash: await bcrypt.hash('OAuthGoogleGenerated_' + Math.random(), 10),
        avatarUrl,
        role: 'subscriber',
        plan: 'Free Tier',
        interests: ['AI & Technology'],
        readingStats: { ...INITIAL_USER_PROFILE.readingStats },
        preferences: { ...INITIAL_USER_PROFILE.preferences },
        isVerified: true
      };
      memoryUserStore.set(email, user);
    }
    const tokenUser = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenUser);
    const refreshToken = generateRefreshToken(tokenUser);

    res.json({ success: true, token: accessToken, refreshToken, user: { id: user.id, name, email, avatarUrl, role: user.role, plan: user.plan } });
  }
}
