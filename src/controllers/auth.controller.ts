import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role, field, userName } = req.body;

    if (!firstName || !lastName || !email || !password || !role || !field || !userName) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ msg: "Email already registered." });

    const existingUserName = await User.findOne({ userName });
    if (existingUserName)
      return res.status(409).json({ msg: "This User Name is Already taken !" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      field,
      userName
    });

    await user.save();

    res.status(200).json({ msg: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response) => {
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

    res.status(200).json({ token, user: { email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, field: user.field } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error." });
  }
};
