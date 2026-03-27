import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  position: string;
  company: string;
  period: string;
  description?: string;
  techStack?: string[];
  order: number;
}

const ExperienceSchema: Schema = new Schema({
  position: {
    type: String,
    required: true,
    trim: true
  },
  company: {
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
  techStack: {
    type: [String],
    default: []
  },
  order: {
    type: Number,
    default: 0
  }
});

ExperienceSchema.index({ order: 1 });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
