import { Schema, model, Types } from "mongoose";

const avatarOptions = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
  "avatar8.png",
  "avatar9.png",
  "avatar10.png"
];

const userProfileSchema = new Schema(
  {
    userId: {
      type: Number,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      maxlength: 280,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    profession: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      enum: avatarOptions,
      default: "avatar1.png",
    },

    interests: [
      {
        type: String,
        trim: true,
      }
    ],

    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    embedding: {
      type: [Number],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const UserProfile = model("UserProfile", userProfileSchema);
