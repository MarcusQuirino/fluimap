import mongoose, { Schema, type Document, type Model } from "mongoose";
import { z } from "zod";

// 1. Zod Schema Definition
export const PostSchemaZod = z.object({
  content: z.string().min(2).max(150),
  author: z.string(),
  authorId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Define the TypeScript type based on the Zod schema
export type PostType = z.infer<typeof PostSchemaZod>;

// 2. Mongoose Schema Definition
const PostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: String, required: true },
  },
  { timestamps: true },
);

// 3. Mongoose Model Definition
interface IPost extends PostType, Document {}

// Function to create or retrieve the Mongoose model
function createPostModel(): Model<IPost> {
  // Check if the model has already been defined
  if (mongoose.models.Post) {
    return mongoose.models.Post as Model<IPost>;
  }

  return mongoose.model<IPost>("Post", PostSchema);
}

const Post = createPostModel();

export default Post;
