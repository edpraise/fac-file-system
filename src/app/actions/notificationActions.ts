'use server';

import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getNotificationsAction() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  await dbConnect();

  const user = session.user as any;
  
  // Fetch notifications for the user or general ones if they are admin
  let query: any = { recipient: user.id };
  
  if (user.role === 'admin') {
    query = { 
      $or: [
        { recipient: user.id },
        { recipient: null } // System-wide notifications
      ]
    };
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(20);

  return JSON.parse(JSON.stringify(notifications));
}

export async function markAsReadAction(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  await dbConnect();
  await Notification.findByIdAndUpdate(notificationId, { read: true });

  revalidatePath('/');
  return { success: true };
}

export async function markAllAsReadAction() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  await dbConnect();
  const user = session.user as any;

  await Notification.updateMany(
    { recipient: user.id, read: false },
    { read: true }
  );

  revalidatePath('/');
  return { success: true };
}

// Internal helper to create notifications
export async function createNotification(data: {
  recipient?: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  await dbConnect();
  return await Notification.create(data);
}
