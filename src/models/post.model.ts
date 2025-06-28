import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt?: Date;
}

export interface IPost extends Document {
  postId: number;
  user: Types.ObjectId;
  title: string;
  description: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ref is the reference to the User model
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // prevents creating separate _id for each comment
);

const PostSchema: Schema<IPost> = new Schema(
  {
    postId: { type: Number, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);

// Post.find()
//   .populate("user") // author of post
//   .populate("comments.user"); // commenter user inside each comment
