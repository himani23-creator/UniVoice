import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  complaintId: mongoose.Types.ObjectId;  
  userId:      mongoose.Types.ObjectId;  
  body:        string;
  isInternal:  boolean;
  createdAt:   Date;
  updatedAt:   Date;
}

const CommentSchema = new Schema<IComment>(
  {
    complaintId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast lookup of all comments on a post
CommentSchema.index({ complaintId: 1, createdAt: 1 });

export const CommentModel: Model<IComment> =
  mongoose.model<IComment>("Comment", CommentSchema);