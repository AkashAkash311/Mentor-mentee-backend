import { Request, Response } from "express";
import Post from "../models/post.model";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, authorId } = req.body;
    if (!title || !content || !authorId) {
      return res.status(400).json({ msg: "Title, content, and authorId are required." });
    }
    // Validate authorId (should be a valid ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(authorId)) {
      return res.status(400).json({ msg: "Invalid authorId format." });
    }
    // Create a new post
    const newPost = new Post({
      postId: Date.now(), // Using timestamp as a simple unique ID
      user: authorId,
      title,
      description: content, // Assuming content is the description
      likes: [],
      comments: [],
    });
    await newPost.save();
    
    res.status(201).json({ msg: "Post created successfully!", post: { title, content, authorId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error." });
  }
}