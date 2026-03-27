import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  type: string;
  itemId?: mongoose.Types.ObjectId;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
}

const AnalyticsSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['project_view', 'post_view', 'contact_form', 'page_view']
  },
  itemId: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    enum: ['Project', 'Post']
  },
  userAgent: {
    type: String
  },
  ip: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

AnalyticsSchema.index({ timestamp: -1 });
AnalyticsSchema.index({ type: 1, itemId: 1 });

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
