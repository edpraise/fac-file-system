import mongoose, { Schema, model, models } from 'mongoose';

const HcfDuesSchema = new Schema({
  stateName: { type: String, required: true, unique: true },
  paidYears: [{ type: Number }], // array of years they've paid, e.g. [2020, 2021]
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

const HcfDues = models.HcfDues || model('HcfDues', HcfDuesSchema);

export default HcfDues;
