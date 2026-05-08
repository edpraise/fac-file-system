import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    return;
  }

  await mongoose.connect(MONGODB_URI);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gov.ng';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: 'Admin User',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    department: 'ICT',
  });

  console.log('Admin user created successfully');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
