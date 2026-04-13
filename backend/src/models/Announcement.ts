import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnnouncement extends Document {
  userId:    mongoose.Types.ObjectId;
  title:     string;
  body:      string;
  isPinned:  boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


AnnouncementSchema.index({ isPinned: -1, createdAt: -1 });

export const AnnouncementModel: Model<IAnnouncement> =
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);