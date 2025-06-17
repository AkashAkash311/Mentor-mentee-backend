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
