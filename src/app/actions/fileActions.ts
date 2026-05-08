'use server';

import dbConnect from '@/lib/mongodb';
import File from '@/models/File';
import ActivityLog from '@/models/ActivityLog';
import { uploadFile, deleteFile as deleteFromCloudinary } from '@/lib/cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function uploadFileAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  await dbConnect();

  const file = formData.get('file') as File;
  const category = formData.get('category') as string;
  const name = formData.get('name') as string;
  const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()) || [];

  if (!file) throw new Error('No file provided');

  // Convert file to base64 for Cloudinary
  const bytes = await (file as any).arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64File = `data:${(file as any).type};base64,${buffer.toString('base64')}`;

  const cloudinaryResponse = await uploadFile(base64File);

  const newFile = await File.create({
    name: name || (file as any).name,
    cloudinaryUrl: cloudinaryResponse.secure_url,
    cloudinaryId: cloudinaryResponse.public_id,
    fileType: (file as any).type,
    size: (file as any).size,
    category,
    tags,
    uploadedBy: (session.user as any).id,
    department: (session.user as any).department,
  });

  await ActivityLog.create({
    action: 'upload',
    fileId: newFile._id,
    fileName: newFile.name,
    userId: (session.user as any).id,
    userName: session.user?.name,
    details: `Uploaded to ${category}`,
  });

  revalidatePath('/resources');

  const { createNotification } = await import('./notificationActions');
  await createNotification({
    type: 'file_upload',
    title: 'New Resource Uploaded',
    message: `${newFile.name} was uploaded to ${category} by ${session.user?.name}.`,
    link: '/resources'
  });

  return { success: true, file: JSON.parse(JSON.stringify(newFile)) };
}

export async function getFilesAction(filters: { category?: string, search?: string }) {
  await dbConnect();
  
  let query: any = {};
  if (filters.category && filters.category !== 'All') {
    query.category = filters.category;
  }
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { tags: { $in: [new RegExp(filters.search, 'i')] } }
    ];
  }

  const files = await File.find(query).sort({ uploadDate: -1 }).populate('uploadedBy', 'name');
  return JSON.parse(JSON.stringify(files));
}

export async function deleteFileAction(fileId: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  await dbConnect();

  const file = await File.findById(fileId);
  if (!file) throw new Error('File not found');

  await deleteFromCloudinary(file.cloudinaryId);
  await File.findByIdAndDelete(fileId);

  await ActivityLog.create({
    action: 'delete',
    fileName: file.name,
    userId: (session.user as any).id,
    details: `Deleted file from ${file.category}`,
  });

  revalidatePath('/resources');
  return { success: true };
}

export async function updateFileAction(fileId: string, data: { name: string, category: string, tags?: string[] }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  await dbConnect();

  const updatedFile = await File.findByIdAndUpdate(
    fileId, 
    { $set: data }, 
    { new: true }
  );

  if (!updatedFile) throw new Error('File not found');

  await ActivityLog.create({
    action: 'edit',
    fileId: updatedFile._id,
    fileName: updatedFile.name,
    userId: (session.user as any).id,
    userName: session.user?.name,
    details: `Updated file metadata in ${updatedFile.category}`,
  });

  revalidatePath('/resources');
  return { success: true, file: JSON.parse(JSON.stringify(updatedFile)) };
}

export async function getActivityLogsAction() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  await dbConnect();

  const logs = await ActivityLog.find()
    .sort({ timestamp: -1 })
    .limit(50);
    
  return JSON.parse(JSON.stringify(logs));
}
