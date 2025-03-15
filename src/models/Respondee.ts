import mongoose, { Schema, type Document, type Model } from "mongoose";
import { z } from "zod";

// 1. Zod Schema Definition
export const RespondeeSchemaZod = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.string().min(2).max(50),
  teamId: z.string(), // Reference to the team this respondee belongs to
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Define the TypeScript type based on the Zod schema
export type RespondeeType = z.infer<typeof RespondeeSchemaZod>;

// 2. Mongoose Schema Definition
const RespondeeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    teamId: { type: String, required: true },
  },
  { timestamps: true },
);

// 3. Mongoose Model Definition
interface IRespondee extends RespondeeType, Document {}

// Function to create or retrieve the Mongoose model
function createRespondeeModel(): Model<IRespondee> {
  // Check if the model has already been defined
  if (mongoose.models.Respondee) {
    return mongoose.models.Respondee as Model<IRespondee>;
  }
  return mongoose.model<IRespondee>("Respondee", RespondeeSchema);
}

const Respondee = createRespondeeModel();

export default Respondee;
