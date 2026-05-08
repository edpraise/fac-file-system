import mongoose, { Schema, model, models } from 'mongoose';

const FileSchema = new Schema({
  name: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true }, // in bytes
  category: { type: String, required: true },
  tags: [{ type: String }],
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

const File = models.File || model('File', FileSchema);

export default File;
