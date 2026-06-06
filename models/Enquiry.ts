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
  createdAt: { type: Date, default: Date.now },
});

const Enquiry: Model<IEnquiry> = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
