import mongoose, { Schema, Document, Types } from "mongoose";

export interface userProfile {
  userId: Types.ObjectId; // Reference to User
  userName: string;
  firstName: string;
  lastName: string;
  bio: string;
  experience: string;
  availability: string[];
  skills: string[];
  interests: string[];
  linkedIn?: string;
  github?: string;
  menteeLimit?: number;
  goal?: string;
  photoUrl?: string;
  achivement?: string[];
}

const userProfileSchema = new Schema<userProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    bio: { type: String, required: true, minlength: 50 },
    experience: { type: String, required: true },
    availability: { type: [String] },
    skills: { type: [String] },
    interests: { type: [String] },
    linkedIn: { type: String },
    github: { type: String, required: true },
    menteeLimit: { type: Number, required: true },
    goal: { type: String },
    photoUrl: { type: String, required: true },
    achivement: { type: [String] }
  }
);

export default mongoose.model<userProfile>("user_profiles", userProfileSchema);
