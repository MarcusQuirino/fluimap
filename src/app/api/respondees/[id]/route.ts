import { type NextRequest, NextResponse } from "next/server";
import Respondee from "@/models/Respondee";
import Team from "@/models/Team";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/server/db";
import { revalidatePath } from "next/cache";

// Helper function to check authorization
async function checkAuth(userId: string | null, respondeeId: string) {
  if (!userId) {
    return { authorized: false, error: "Unauthorized", status: 401 };
  }

  const respondee = await Respondee.findById(respondeeId);
  
  if (!respondee) {
    return { authorized: false, error: "Respondee not found", status: 404 };
  }

  const team = await Team.findById(respondee.teamId);
  
  if (!team) {
    return { authorized: false, error: "Team not found", status: 404 };
  }
  
  if (team.ownerId !== userId) {
    return { authorized: false, error: "Unauthorized", status: 403 };
  }

  return { authorized: true, respondee, team };
}

// GET handler to retrieve a specific respondee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { userId } = await auth();
    const authResult = await checkAuth(userId, params.id);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status! }
      );
    }

    return NextResponse.json({ respondee: authResult.respondee }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving respondee:", error);
    return NextResponse.json(
      { error: "Failed to retrieve respondee" },
      { status: 500 },
    );
  }
}

// PUT handler to update a specific respondee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { userId } = await auth();
    const authResult = await checkAuth(userId, params.id);
    
    if (!authResult.authorized || !authResult.respondee) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status! }
      );
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      role?: string;
    };
    
    // If email is being updated, check for duplicates
    if (body.email) {
      const existingWithEmail = await Respondee.findOne({
        email: body.email,
        teamId: authResult.respondee.teamId,
        _id: { $ne: params.id }, // Exclude the current respondee
      });
      
      if (existingWithEmail) {
        return NextResponse.json(
          { error: "Another respondee with this email already exists in this team" },
          { status: 400 }
        );
      }
    }
    
    const updatedRespondee = await Respondee.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    revalidatePath(`/surveys`);

    return NextResponse.json({ respondee: updatedRespondee }, { status: 200 });
  } catch (error) {
    console.error("Error updating respondee:", error);
    return NextResponse.json(
      { error: "Failed to update respondee" },
      { status: 500 },
    );
  }
}

// DELETE handler to delete a specific respondee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { userId } = await auth();
    const authResult = await checkAuth(userId, params.id);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status! }
      );
    }

    await Respondee.findByIdAndDelete(params.id);

    revalidatePath(`/surveys`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting respondee:", error);
    return NextResponse.json(
      { error: "Failed to delete respondee" },
      { status: 500 },
    );
  }
}