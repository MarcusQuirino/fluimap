import { type NextRequest, NextResponse } from "next/server";
import Respondee from "@/models/Respondee";
import Team from "@/models/Team";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/server/db";
import { revalidatePath } from "next/cache";

// POST handler to create a new respondee
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name: string;
      email: string;
      role: string;
      teamId: string;
    };
    
    const { name, email, role, teamId } = body;

    // Verify that the team exists and the user is the owner
    const team = await Team.findById(teamId);
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    if (team.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if a respondee with this email already exists in the team
    const existingRespondee = await Respondee.findOne({ email, teamId });
    
    if (existingRespondee) {
      return NextResponse.json(
        { error: "A respondee with this email already exists in this team" },
        { status: 400 }
      );
    }

    const respondee = await Respondee.create({
      name,
      email,
      role,
      teamId,
    });

    revalidatePath(`/surveys`);

    return NextResponse.json({ respondee }, { status: 201 });
  } catch (error) {
    console.error("Error creating respondee:", error);
    return NextResponse.json(
      { error: "Failed to create respondee" },
      { status: 500 },
    );
  }
}

// Bulk create respondees
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      respondees: { name: string; email: string; role: string }[];
      teamId: string;
    };
    
    const { respondees, teamId } = body;

    // Verify that the team exists and the user is the owner
    const team = await Team.findById(teamId);
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    if (team.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Add teamId to each respondee
    const respondeesWithTeamId = respondees.map(respondee => ({
      ...respondee,
      teamId,
    }));

    // Create all respondees in one operation
    const createdRespondees = await Respondee.insertMany(
      respondeesWithTeamId,
      { ordered: false } // Continue processing even if some documents fail
    );

    revalidatePath(`/surveys`);

    return NextResponse.json({ respondees: createdRespondees }, { status: 201 });
  } catch (error) {
    console.error("Error creating respondees in bulk:", error);
    return NextResponse.json(
      { error: "Failed to create respondees" },
      { status: 500 },
    );
  }
}
