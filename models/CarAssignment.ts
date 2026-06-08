import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICarAssignment extends Document {
  carId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  startDate: string;
  endDate?: string;
  pickup?: string;
  destination?: string;
  status: 'active' | 'completed';
  createdAt: Date;
}

const CarAssignmentSchema: Schema<ICarAssignment> = new Schema({
  carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  customerEmail: { type: String, trim: true, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  pickup: { type: String, default: '' },
  destination: { type: String, default: '' },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

const CarAssignment: Model<ICarAssignment> =
  mongoose.models.CarAssignment || mongoose.model<ICarAssignment>('CarAssignment', CarAssignmentSchema);

export default CarAssignment;
