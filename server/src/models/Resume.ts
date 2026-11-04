import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  fileUrl: string;
  fileName: string;
  publicId?: string;
  uploadedAt: Date;
}

const ResumeSchema: Schema = new Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IResume>('Resume', ResumeSchema);
