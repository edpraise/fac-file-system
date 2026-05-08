'use server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUsersAction() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  const users = await User.find({}, '-password').sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users));
}

export async function updateUserRoleAction(userId: string, role: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  await User.findByIdAndUpdate(userId, { role });
  revalidatePath('/users');
  return { success: true };
}

export async function createUserAction(userData: any) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  const { name, email, password, role, department } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    department,
  });

  revalidatePath('/users');

  const { createNotification } = await import('./notificationActions');
  await createNotification({
    type: 'user_created',
    title: 'New User Registered',
    message: `${name} has been added to the system as ${role} in ${department}.`,
    link: '/users'
  });

  return { success: true, user: JSON.parse(JSON.stringify(newUser)) };
}
