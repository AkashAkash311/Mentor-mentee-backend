import { Request, Response } from "express";
import User from "../models/user.model";
import userProfileSchema from "../models/profile.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

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
        const { userId } = req.user;
        const {
            userName,
            firstName,
            lastName,
            bio,
            experience,
            availability,
            skills,
            interests,
            linkedIn,
            github,
            menteeLimit,
            goal,
            photoUrl,
            achivement
        } = req.body;

        // Validate required fields
        if (
            !userName ||
            !firstName ||
            !bio ||
            !experience ||
            !github ||
            !menteeLimit
        ) {
            return res.status(400).json({ msg: "Missing required fields." });
        }
        if (typeof bio !== "string" || bio.length < 50) {
            return res.status(400).json({ msg: "Bio must be at least 50 characters long." });
        }

        // Find or create user profile in userProfileSchema
        let profile = await userProfileSchema.findOne({ userId });
        if (!profile) {
            profile = new userProfileSchema({
            userId,
            userName,
            firstName,
            lastName,
            bio,
            experience,
            availability,
            skills,
            interests,
            linkedIn,
            github,
            menteeLimit,
            goal,
            photoUrl,
            achivement
            });
        } else {
            profile.set({
            userName,
            firstName,
            lastName,
            bio,
            experience,
            availability,
            skills,
            interests,
            linkedIn,
            github,
            menteeLimit,
            goal,
            photoUrl,
            achivement
            });
        }

        await profile.save();
        return res.status(200).json({ msg: "Profile updated successfully.", profile });
    } catch (err: any) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.userName) {
            return res.status(409).json({ msg: "Username already exists." });
        }
        console.error(err);
        res.status(500).json({ msg: "Internal server error." });
    }
};
