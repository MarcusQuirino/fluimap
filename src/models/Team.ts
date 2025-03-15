import mongoose, { Schema, type Document, type Model } from "mongoose";
import { z } from "zod";

// 1. Zod Schema Definition
export const TeamSchemaZod = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(250).optional(),
  ownerId: z.string(), // Clerk user ID of the team owner
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Define the TypeScript type based on the Zod schema
export type TeamType = z.infer<typeof TeamSchemaZod>;

// 2. Mongoose Schema Definition
const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: String, required: true },
  },
  { timestamps: true },
);

// 3. Mongoose Model Definition
interface ITeam extends TeamType, Document {}

// Function to create or retrieve the Mongoose model
function createTeamModel(): Model<ITeam> {
  // Check if the model has already been defined
  if (mongoose.models.Team) {
    return mongoose.models.Team as Model<ITeam>;
  }
  return mongoose.model<ITeam>("Team", TeamSchema);
}

const Team = createTeamModel();

export default Team;
