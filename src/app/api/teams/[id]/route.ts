import { type NextRequest, NextResponse } from "next/server";
import Team from "@/models/Team";
import Respondee from "@/models/Respondee";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/server/db";
import { revalidatePath } from "next/cache";

// GET handler to retrieve a specific team
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await Team.findById(params.id);
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the team
    if (team.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get all respondees for this team
    const respondees = await Respondee.find({ teamId: params.id });
    
    return NextResponse.json({ team, respondees }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving team:", error);
    return NextResponse.json(
      { error: "Failed to retrieve team" },
      { status: 500 },
    );
  }
}

// PUT handler to update a specific team
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await Team.findById(params.id);
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the team
    if (team.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = (await request.json()) as {
      name?: string;
      description?: string;
    };
    
    const updatedTeam = await Team.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    revalidatePath("/surveys");

    return NextResponse.json({ team: updatedTeam }, { status: 200 });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 },
    );
  }
}

// DELETE handler to delete a specific team
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await Team.findById(params.id);
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the team
    if (team.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the team
    await Team.findByIdAndDelete(params.id);
    
    // Delete all respondees associated with this team
    await Respondee.deleteMany({ teamId: params.id });

    revalidatePath("/surveys");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 },
    );
  }
}
