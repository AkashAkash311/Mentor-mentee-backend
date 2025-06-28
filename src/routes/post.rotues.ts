import { Router, Request, Response, NextFunction } from "express";
import { createPost } from "../controllers/post.controller";

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

router.post("/createPost", asyncHandler(createPost));

export default router;