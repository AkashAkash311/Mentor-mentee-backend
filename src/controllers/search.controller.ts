import { generateEmbedding } from "../utils/embedding";
import { cosineSimilarity } from "../utils/cosineSimilarity";
import { UserProfile } from "../models/profile.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { sendSuccess } from "../utils/response";
import { StatusCodes } from "http-status-codes";

export const searchProfiles = async (req: AuthenticatedRequest, res: any) => {
  try {
    const { query } = req.body;

    if (!query) {
      return sendSuccess(
        res,
        StatusCodes.BAD_REQUEST,
        {},
        "Please fill the TextField!"
      );
    }

    const queryEmbedding = Array.from(await generateEmbedding(query));
    const allProfiles = await UserProfile.find({
      embedding: { $exists: true, $ne: [] },
    });

    const results = allProfiles
      .map((profile) => {
        const similarity = cosineSimilarity(queryEmbedding, profile.embedding);
        return { profile, score: similarity };
      })
      .filter((user) => user.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return sendSuccess(
      res,
      StatusCodes.OK,
      results,
      "Search successful"
    );
  } catch (err) {
    console.error("Error in searchProfiles:", err);
    return sendSuccess(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      {},
      "Search failed"
    );
  }
};