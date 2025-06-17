import mongoose, { Schema, Document } from "mongoose";

export interface userProfile{
  userName: string, 
  bio: string,
  experience: string, 
  availability: string[], 
  skills: string[],
  interests: string[], 
  linkedIn?: string,
  github?: string,
  menteeLimit?: number,
  goal?: string, // only for mentees
  photoUrl?: string,
}

const useProfileSchema = new Schema<userProfile> (
    {
        userName: { type: String, required: true, unique: true }, 
        bio: { type: String, required: true, minlength: 50 },
        experience: { type: String, required: true }, 
        availability: { type: [String] }, 
        skills: { type: [String] },
        interests: { type: [String] }, 
        linkedIn: { type: String }, 
        github: { type: String, required: true },
        menteeLimit: { type: String, required: true },
        goal: { type: String },
        photoUrl: { type: String, required: true },
    }
)

export default mongoose.model<userProfile>("user_profiles", useProfileSchema);