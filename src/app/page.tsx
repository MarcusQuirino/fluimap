import type { UserType } from "@/models/User";
import User from "@/models/User";
import mongoose from "mongoose";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

// Ensure MongoDB connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  return mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fluimap");
};

const getUsers = async () => {
  await connectDB();
  return User.find() as Promise<UserType[]>;
};

export default async function Home() {
  const users = await getUsers();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to FluiMap</h1>
      <form action={async () => {
        "use server";
        try {
          // Connect to MongoDB
          await connectDB();
          
          // Create a new user with Mongoose
          const user = new User({
            name: "John Doe",
            email: `john.doe@example.com`, // Adding timestamp to make email unique on each attempt
          });
          
          await user.save();
          console.log("User created:", user);
        } catch (error) {
          console.error("Error creating user:", error);
        }
        }}>
          <Button
          type="submit"
        >
          Create Test User
        </Button>
      </form>

      <ModeToggle />

      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.createdAt?.toISOString()}>{user.name} {user.email}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
