import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  fileUrl: string;
  fileName: string;
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
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IResume>('Resume', ResumeSchema);
