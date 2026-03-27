import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  proficiency: number;
  visible: boolean;
  order: number;
}

const SkillSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['languages', 'frameworks', 'databases', 'tools', 'coursework'],
    trim: true
  },
  proficiency: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  visible: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

SkillSchema.index({ category: 1, order: 1 });

export default mongoose.model<ISkill>('Skill', SkillSchema);
