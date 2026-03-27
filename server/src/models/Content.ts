import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['hero', 'about'],
      unique: true,
    },
    hero: {
      tagline: String,
      title: String,
      description: String,
      primaryButtonText: String,
      primaryButtonLink: String,
      secondaryButtonText: String,
      secondaryButtonLink: String,
    },
    about: {
      title: String,
      description1: String,
      description2: String,
      contactTitle: String,
      contactSubtitle: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Content', contentSchema);
