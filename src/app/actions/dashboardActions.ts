'use server';

import dbConnect from '@/lib/mongodb';
import File from '@/models/File';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getDashboardStatsAction() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  await dbConnect();

  const totalFiles = await File.countDocuments();
  const totalUsers = await User.countDocuments();
  
  // Get storage used
  const files = await File.find({}, 'size');
  const totalStorage = files.reduce((acc, file) => acc + file.size, 0);

  // Get recent logs
  const recentLogs = await ActivityLog.find()
    .sort({ timestamp: -1 })
    .limit(5)
    .populate('userId', 'name');

  // Get distribution by category
  const categories = await File.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  return {
    stats: {
      totalFiles,
      totalUsers,
      totalStorage: (totalStorage / 1024 / 1024).toFixed(2) + ' MB',
      activeUsers: Math.ceil(totalUsers * 0.8), // Mock active users
    },
    recentLogs: JSON.parse(JSON.stringify(recentLogs)),
    categoryData: categories.map(c => ({ name: c._id, value: c.count }))
  };
}
