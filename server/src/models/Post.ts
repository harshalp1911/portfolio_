import mongoose, { Document, Schema } from 'mongoose';

interface IComment {
  author: string;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  caption?: string;
  likes: number;
  comments: IComment[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  author: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  caption: {
    type: String,
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [CommentSchema],
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

PostSchema.index({ createdAt: -1 });
PostSchema.index({ published: 1 });

export default mongoose.model<IPost>('Post', PostSchema);
