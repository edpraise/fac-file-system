'use server';

import dbConnect from '@/lib/mongodb';
import HcfDues from '@/models/HcfDues';
import ActivityLog from '@/models/ActivityLog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// List of 36 States in Nigeria + FCT
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

export async function getHcfDuesAction() {
  await dbConnect();
  
  // Fetch existing records
  const records = await HcfDues.find({});
  
  // Create a map of existing payments
  const recordsMap = new Map(records.map(r => [r.stateName, r.paidYears]));
  
  // Guarantee every state has an entry in the returned array
  const formattedDues = NIGERIAN_STATES.map(stateName => ({
    stateName,
    paidYears: recordsMap.get(stateName) || [],
  }));

  return formattedDues;
}

export async function toggleHcfDueAction(stateName: string, year: number, paid: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authenticated');
  }

  const isAdmin = (session.user as any).role === 'admin';
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required to update dues');
  }

  await dbConnect();

  let record = await HcfDues.findOne({ stateName });

  if (!record) {
    record = new HcfDues({
      stateName,
      paidYears: [],
    });
  }

  if (paid) {
    if (!record.paidYears.includes(year)) {
      record.paidYears.push(year);
    }
  } else {
    record.paidYears = record.paidYears.filter((y: number) => y !== year);
  }

  record.updatedBy = (session.user as any).id;
  record.updatedAt = new Date();
  await record.save();

  // Log the activity
  await ActivityLog.create({
    action: 'edit',
    fileName: `HCF Dues - ${stateName} (${year})`,
    userId: (session.user as any).id,
    userName: session.user?.name,
    details: `${paid ? 'Marked' : 'Unmarked'} HCF Dues as Paid for ${stateName} in ${year}`,
  });

  revalidatePath('/resources');
  return { success: true, paidYears: record.paidYears };
}
