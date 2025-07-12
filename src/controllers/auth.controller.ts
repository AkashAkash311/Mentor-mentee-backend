import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getNextSequence } from "../utils/getNextSequence";
import { ApiError, sendSuccess } from "../utils/response";
import { StatusCodes } from "http-status-codes";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role, field, userName } = req.body;

    if (!firstName || !lastName || !email || !password || !role || !field || !userName) {
      // return res.status(400).json({ msg: "All fields are required." });
      return sendSuccess(
        res,
        StatusCodes.BAD_REQUEST,
        {},
        "All fields are required."
      )
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      // return res.status(409).json({ msg: "Email already registered." });
      return sendSuccess(
        res,
        StatusCodes.CONFLICT,
        {},
        "Email already registered."
      )

    const existingUserName = await User.findOne({ userName });
    if (existingUserName)
      return sendSuccess(
        res,
        StatusCodes.CONFLICT,
        {},
        "This User Name is Already taken !"
      )

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await getNextSequence("userId");

    const user = new User({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      field,
      userName
    });

    await user.save();

    return sendSuccess(
      res,
      StatusCodes.OK,
      "User registered successfully!"
    )
  } catch (err) {
    console.error(err);
    next(
      new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error",
        // err, // optional: pass raw error as details
      ),
    );
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return sendSuccess(
      res,
      StatusCodes.OK,
      {
        token,
        user: {
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          field: user.field,
        },
      },
      "Logged in successfully",
    );
  } catch (err) {
    console.error(err);
    next(
      new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error",
        err, // optional: pass raw error as details
      ),
    );
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    if (!email || !newPassword || !confirmNewPassword) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Email and both password fields are required",
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "New password and confirm password do not match",
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return sendSuccess(
      res,
      StatusCodes.OK,
      null,
      "Password updated successfully",
    );
  } catch (err) {
    next(err);
  }
};