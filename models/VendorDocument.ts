import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IDocumentField {
  documentNumber: string;
  files: string[];
  status: 'pending' | 'verified' | 'rejected';
  rejectedReason: string;
}

export interface IVendorDocument extends Document {
  vendorId: mongoose.Types.ObjectId;
  drivingLicense: IDocumentField;
  registrationCertificate: IDocumentField;
  insurance: IDocumentField;
  pollutionCertificate: IDocumentField;
  policeVerification: IDocumentField;
  createdAt: Date;
  updatedAt: Date;
}

const DocFieldSchema = new Schema<IDocumentField>(
  {
    documentNumber: { type: String, default: '' },
    files: { type: [String], default: [] },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    rejectedReason: { type: String, default: '' },
  },
  { _id: false }
);

const VendorDocumentSchema = new Schema<IVendorDocument>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    drivingLicense: { type: DocFieldSchema, default: () => ({}) },
    registrationCertificate: { type: DocFieldSchema, default: () => ({}) },
    insurance: { type: DocFieldSchema, default: () => ({}) },
    pollutionCertificate: { type: DocFieldSchema, default: () => ({}) },
    policeVerification: { type: DocFieldSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const VendorDocument: Model<IVendorDocument> =
  mongoose.models.VendorDocument || mongoose.model<IVendorDocument>('VendorDocument', VendorDocumentSchema);

export default VendorDocument;
