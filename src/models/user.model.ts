import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "mentor" | "mentee";
  field: string;
}

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["mentor", "mentee"], required: true },
    field: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
