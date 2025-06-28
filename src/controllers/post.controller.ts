import { Request, Response } from "express";
import Post from "../models/post.model";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Here you would typically save the post to the database
    // For now, we will just return a success message
    res.status(201).json({ msg: "Post created successfully!", post: { title, content, authorId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error." });
  }
}