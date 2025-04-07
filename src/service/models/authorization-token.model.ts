import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthorizationToken extends Document {
  userId: mongoose.Types.ObjectId;
  refreshTokenHash: string;
  accessTokenHash: string;
  refreshExpiresAt: Date;
  accessExpiresAt: Date;
  isValid: boolean;
  replacedByTokenId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorizationTokenSchema = new Schema<IAuthorizationToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    refreshTokenHash: {
      type: String,
      required: true
    },
    accessTokenHash: {
      type: String,
      required: true
    },
    refreshExpiresAt: {
      type: Date,
      required: true
    },
    accessExpiresAt: {
      type: Date,
      required: true
    },
    isValid: {
      type: Boolean,
      default: true
    },
    replacedByTokenId: {
      type: Schema.Types.ObjectId,
      ref: 'AuthorizationToken'
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
AuthorizationTokenSchema.index({ userId: 1, isValid: 1 });
AuthorizationTokenSchema.index({ refreshTokenHash: 1 }, { unique: true });
AuthorizationTokenSchema.index({ accessTokenHash: 1 }, { unique: true });

export default mongoose.model<IAuthorizationToken>('AuthorizationToken', AuthorizationTokenSchema); 