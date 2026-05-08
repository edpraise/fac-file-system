import mongoose, { Schema, model, models } from 'mongoose';

const ActivityLogSchema = new Schema({
  action: { type: String, enum: ['upload', 'delete', 'edit', 'download'], required: true },
  fileId: { type: Schema.Types.ObjectId, ref: 'File' },
  fileName: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
});

const ActivityLog = models.ActivityLog || model('ActivityLog', ActivityLogSchema);

export default ActivityLog;
