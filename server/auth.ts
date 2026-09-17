import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, isMongoConnected, IUser } from './db';
import { INITIAL_USER_PROFILE } from '../src/data/mockNewsData';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'chr_access_secret_super_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'chr_refresh_secret_super_key';

// In-Memory store fallback
export const memoryUserStore = new Map<string, any>(); // email -> user info

// Pre-seed admin user in memory fallback
const seedEmail = 'demo@chronicle.ai';
memoryUserStore.set(seedEmail, {
  id: 'usr_demo_001',
  name: 'Demo Admin',
  email: seedEmail,
  passwordHash: bcrypt.hashSync('demo1234', 10),
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  role: 'admin',
  plan: 'Enterprise SaaS',
  interests: ['AI & Technology', 'Science & Space'],
  readingStats: { ...INITIAL_USER_PROFILE.readingStats },
  preferences: { ...INITIAL_USER_PROFILE.preferences },
  isVerified: true,
  createdAt: new Date()
});

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
    next;
  };
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
        isVerified: false,
        verificationToken: Math.random().toString(36).substring(2, 10).toUpperCase()
      });
      await user.save();
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
      role: 'subscriber' as const,
      plan: 'Free Tier' as const,
      interests: ['AI & Technology'],
      readingStats: { ...INITIAL_USER_PROFILE.readingStats },
      preferences: { ...INITIAL_USER_PROFILE.preferences },
      isVerified: false,
      verificationToken: 'MOCK_VERIFY_TOKEN'
    };
    memoryUserStore.set(normalizedEmail, newUser);
    const tokenUser = { id, email: normalizedEmail, role: 'subscriber' };
    const accessToken = generateAccessToken(tokenUser);
    const refreshToken = generateRefreshToken(tokenUser);

    res.json({
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
