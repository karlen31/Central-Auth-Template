import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  apiKey: string;
  secret: string;
  allowedOrigins: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    apiKey: {
      type: String,
      required: true,
      unique: true
    },
    secret: {
      type: String,
      required: true
    },
    allowedOrigins: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IService>('Service', ServiceSchema); 