import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation extends Document {
  degree: string;
  institution: string;
  period: string;
  description?: string;
  order: number;
}

const EducationSchema: Schema = new Schema({
  degree: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
});

EducationSchema.index({ order: 1 });

export default mongoose.model<IEducation>('Education', EducationSchema);
