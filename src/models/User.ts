import mongoose, { Schema, type Document, type Model } from "mongoose";
import { z } from "zod";

// 1. Zod Schema Definition
export const UserSchemaZod = z.object({
  name: z.string().min(2).max(50),
  clerkId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Define the TypeScript type based on the Zod schema
export type UserType = z.infer<typeof UserSchemaZod>;

// 2. Mongoose Schema Definition
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

// 3. Mongoose Model Definition
interface IUser extends UserType, Document {}

// Function to create or retrieve the Mongoose model
function createUserModel(): Model<IUser> {
  // Check if the model has already been defined
  if (mongoose.models.User) {
    return mongoose.models.User as Model<IUser>;
  }
  return mongoose.model<IUser>("User", UserSchema);
}

const User = createUserModel();

export default User;
