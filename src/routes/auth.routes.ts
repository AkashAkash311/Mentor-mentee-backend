import { Router, Request, Response, NextFunction } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;
