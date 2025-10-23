import { Router, Request, Response, NextFunction } from "express";
import { createPost, getPosts } from "../controllers/post.controller";
import { searchProfiles } from "../controllers/search.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

router.post("/createPost", asyncHandler(createPost));
router.post("/getPosts", asyncHandler(getPosts));
router.post("/searchProfiles", authenticate ,asyncHandler(searchProfiles))

export default router;