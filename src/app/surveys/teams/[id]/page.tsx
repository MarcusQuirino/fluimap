import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/server/db";
import Team from "@/models/Team";
import User from "@/models/User";
import { RespondeeForm } from "@/components/respondees/respondee-form";
import { RespondeeList } from "@/components/respondees/respondee-list";
import { BulkImportForm } from "@/components/respondees/bulk-import-form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

async function createUser(clerkId: string, name: string | null) {
  const user = await User.findOne({ clerkId });
  if (!user) {
    await User.create({ clerkId, name });
  }
}

export default async function TeamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await dbConnect();

  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const user = await currentUser();

  if (user === null) return redirectToSignIn();

  await createUser(user.id, user?.fullName);

  // Fetch the team
  const team = await Team.findById(params.id);

  // Check if team exists and belongs to the current user
  if (!team || team.ownerId !== userId) {
    return notFound();
  }

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <main className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button variant="outline" asChild>
              <Link href="/surveys">← Back to Teams</Link>
            </Button>
            <h1 className="text-3xl font-bold mt-4">{team.name}</h1>
            {team.description && (
              <p className="text-muted-foreground mt-1">{team.description}</p>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <Suspense fallback={<div>Loading team members...</div>}>
              <RespondeeList teamId={params.id} />
            </Suspense>
          </div>
          
          <div className="space-y-8">
            <RespondeeForm teamId={params.id} />
            <BulkImportForm teamId={params.id} />
          </div>
        </div>
      </main>
    </ScrollArea>
  );
}