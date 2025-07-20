import { Request, Response } from "express";
import User from "../models/user.model";
import { UserProfile } from "../models/profile.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { sendSuccess } from "../utils/response";
import { StatusCodes } from "http-status-codes";

// Gets mentor or mentee lists in the User Table
export const getMentorOrMenteeLists = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const users = await User.find({ role: "mentor" });
        return res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error." });
    }
};


// Edit or Create  Profile
export const editOrCreateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId; // Comes from JWT middleware
    console.log("ferthewfgrthefwgtrhefwtrhr", req.user);
    const {
      name,
      bio,
      location,
      profession,
      avatar,
      interests,
      socialLinks
    } = req.body;

    if (!userId || !name) {
      return sendSuccess(
        res,
        StatusCodes.BAD_REQUEST,
        {},
        "User ID and name are required."
      );
    }

    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // Create new profile
      profile = new UserProfile({
        userId,
        name,
        bio,
        location,
        profession,
        avatar,
        interests,
        socialLinks,
      });
      await profile.save();
    } else {
      // Update existing profile
      profile.set({
        name,
        bio,
        location,
        profession,
        avatar,
        interests,
        socialLinks,
        updatedAt: new Date(),
      });
      await profile.save();
    }

    return sendSuccess(
      res,
      StatusCodes.OK,
      profile,
      profile.isNew ? "Profile created successfully." : "Profile updated successfully."
    );
  } catch (err) {
    console.error("Error in create or edit profile:", err);
    return sendSuccess(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      {},
      "Something went wrong while saving the profile."
    );
  }
};

// get Profile Details
