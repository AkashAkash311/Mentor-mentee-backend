import { Router, Request, Response, NextFunction } from "express";
import { editOrCreateProfile, getMentorOrMenteeLists, getProfileDetails } from "../controllers/onboarding.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

router.post("/getMentorOrMenteeLists", authenticate , asyncHandler(getMentorOrMenteeLists));
router.post("/editOrCreateProfile", authenticate, asyncHandler(editOrCreateProfile))
router.post("/getProfileDetails", authenticate, asyncHandler(getProfileDetails))

export default router;
