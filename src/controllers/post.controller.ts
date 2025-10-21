import { Request, Response } from "express";
import Post from "../models/post.model";
import jwt from "jsonwebtoken";

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    if (!title || !content) {
      return res.status(400).json({ msg: "Title, content are required." });
    }
    // Create a new post
    const newPost = new Post({
      postId: Date.now(), // Using timestamp as a simple unique ID
      user: decoded.id,
      title,
      description: content, // Assuming content is the description
      likes: [],
      comments: [],
    });
    await newPost.save();
    
    res.status(200).json({ msg: "Post created successfully!", post: { title, content, authorId: decoded.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error." });
  }
}