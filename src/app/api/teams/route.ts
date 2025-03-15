import { type NextRequest, NextResponse } from "next/server";
import Team from "@/models/Team";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/server/db";
import { revalidatePath } from "next/cache";

// GET handler to retrieve all teams for the authenticated user
export async function GET() {
  try {
    await dbConnect();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teams = await Team.find({ ownerId: userId });

    return NextResponse.json({ teams }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving teams:", error);
    return NextResponse.json(
      { error: "Failed to retrieve teams" },
      { status: 500 },
    );
  }
}

// POST handler to create a new team
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name: string;
      description?: string;
    };

    const { name, description } = body;

    const team = await Team.create({
      name,
      description,
      ownerId: userId,
    });

    revalidatePath("/dashboard");

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 },
    );
  }
}
