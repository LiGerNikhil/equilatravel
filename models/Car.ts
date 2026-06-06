import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './User';

export interface ICar extends Document {
  vendorId: IUser['_id'];
  carName: string;
  carModel?: string;
  vehicleNumber: string;
  pricePerKM: number;
  isAvailable: boolean;
  images: string[];
  features: string[];
  createdAt: Date;
}

const CarSchema: Schema<ICar> = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carName: {
      type: String,
      required: true,
      trim: true,
    },
    carModel: {
      type: String,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pricePerKM: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const Car: Model<ICar> = mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);

export default Car;
