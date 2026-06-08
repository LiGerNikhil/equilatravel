import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  phone: string;
  email: string;
  service: string;
  pickup: string;
  destination: string;
  date: string;
  message: string;
  createdAt: Date;
  status: 'pending' | 'assigned' | 'completed';
  assignedCarId?: string;
  assignedCarName?: string;
  assignedCarNumber?: string;
  assignedCarPrice?: number;
}

const EnquirySchema: Schema<IEnquiry> = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, default: '' },
  service: { type: String, default: '' },
  pickup: { type: String, default: '' },
  destination: { type: String, default: '' },
  date: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
  assignedCarId: { type: String, default: '' },
  assignedCarName: { type: String, default: '' },
  assignedCarNumber: { type: String, default: '' },
  assignedCarPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Enquiry: Model<IEnquiry> = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
