import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase, isMongoConnected, User } from '../server/db';

async function createAdmin() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || 'admin@chronicle.ai').toLowerCase().trim();
  const password = args[1] || process.env.ADMIN_PASSWORD || 'Admin@Chronicle2025!';
  const name = args[2] || process.env.ADMIN_NAME || 'Chronicle Administrator';

  if (!email || !email.includes('@')) {
    console.error('Error: Please provide a valid email address.');
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error('Error: Administrator password must be at least 8 characters long.');
    process.exit(1);
  }

  console.log(`=======================================================`);
  console.log(` Chronicle AI - Secure Administrator Account Provisioning`);
  console.log(`=======================================================`);
  console.log(`Admin Email: ${email}`);
  console.log(`Admin Name:  ${name}`);
  console.log(`Connecting to MongoDB Atlas...`);

  await connectDatabase();

  const passwordHash = await bcrypt.hash(password, 10);

  if (isMongoConnected()) {
    try {
      let user = await User.findOne({ email });
      if (user) {
        user.name = name;
        user.passwordHash = passwordHash;
        user.role = 'admin';
        user.isVerified = true;
        user.plan = 'Enterprise SaaS';
        await user.save();
        console.log(`\nSUCCESS: Existing account for "${email}" updated to Administrator with new password.`);
      } else {
        user = new User({
          name,
          email,
          passwordHash,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=200`,
          role: 'admin',
          plan: 'Enterprise SaaS',
          isVerified: true
        });
        await user.save();
        console.log(`\nSUCCESS: New Administrator account "${email}" created successfully in MongoDB Atlas.`);
      }
      console.log(`User ID:     ${user._id}`);
      console.log(`Role:        ${user.role}`);
      console.log(`Plan:        ${user.plan}`);
      console.log(`Verified:    ${user.isVerified}`);
      console.log(`\nYou can now sign in at http://localhost:3000/admin/login using these credentials.`);
      process.exit(0);
    } catch (err: any) {
      console.error('Database error provisioning administrator:', err.message);
      process.exit(1);
    }
  } else {
    console.log(`\nINFO: Running in Local In-Memory Mode (No MONGODB_URI configured).`);
    console.log(`Default in-memory credentials ready for development:`);
    console.log(`- Email:    ${email}`);
    console.log(`- Role:     admin`);
    console.log(`- Password: (As configured in environment or default)`);
    console.log(`\nWhen MONGODB_URI is configured on Render or in .env, run this script again to persist directly to MongoDB Atlas.`);
    process.exit(0);
  }
}

createAdmin().catch(err => {
  console.error('Fatal error during admin setup:', err);
  process.exit(1);
});
