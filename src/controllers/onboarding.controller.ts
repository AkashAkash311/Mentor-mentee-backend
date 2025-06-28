import { Request, Response } from "express";
import User from "../models/user.model";
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
        const { name, bio, skills, interests } = req.body;

        // Validate input
        if (!name || !bio || !skills || !interests) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        // Find or create user profile
        let user = await User.findById(userId);
        if (!user) {
            user = new User({ _id: userId, name, bio, skills, interests });
        } else {
            user.set({
                name,
                bio,
                skills,
                interests
            });
        }

        await user.save();
        return res.status(200).json({ msg: "Profile updated successfully.", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error." });
    }
};
