import { type NextRequest, NextResponse } from "next/server";
import Team from "@/models/Team";
import Respondee from "@/models/Respondee";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/server/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

// Helper function to generate a unique survey ID
function generateSurveyId(): string {
  // Generate a random 10-character string for the survey ID
  return crypto.randomBytes(5).toString("hex");
}

interface SurveyRunResponse {
  success: boolean;
  surveyId: string;
  respondeeCount: number;
  respondeeLinks: {
    id: string;
    name: string;
    email: string;
    link: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      teamId: string;
    };

    const { teamId } = body;

    // Verify that the team exists and the user is the owner
    const team = await Team.findById(teamId);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (team.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get all respondees for this team
    const respondees = await Respondee.find({ teamId });

    if (respondees.length === 0) {
      return NextResponse.json(
        { error: "No respondees found for this team" },
        { status: 400 },
      );
    }

    // Generate a unique survey ID
    const surveyId = generateSurveyId();

    // Base URL from environment or default
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // Generate unique links for each respondee
    const respondeeLinks = respondees.map((respondee) => {
      const uniqueLink = `${baseUrl}/surveys/${surveyId}/${String(respondee._id)}`;

      // In a real implementation, you would send emails here
      // For now, just log the email and link
      console.log(`Sending email to ${respondee.email}:`);
      console.log(`Survey link: ${uniqueLink}`);

      return {
        id: String(respondee._id),
        name: respondee.name,
        email: respondee.email,
        link: uniqueLink,
      };
    });

    revalidatePath(`/dashboard`);

    const response: SurveyRunResponse = {
      success: true,
      surveyId,
      respondeeCount: respondees.length,
      respondeeLinks,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error running survey:", error);
    return NextResponse.json(
      { error: "Failed to run survey" },
      { status: 500 },
    );
  }
}
