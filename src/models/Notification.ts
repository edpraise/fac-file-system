import mongoose, { Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional: If null, it's a broadcast or for all admins
  type: { 
    type: String, 
    enum: ['file_upload', 'user_created', 'system_alert', 'file_deleted'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String }, // Optional: URL to redirect to
  createdAt: { type: Date, default: Date.now },
});

const Notification = models.Notification || model('Notification', NotificationSchema);

export default Notification;
