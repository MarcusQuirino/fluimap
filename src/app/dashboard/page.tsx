import { Suspense } from "react";
import dbConnect from "@/server/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import { TeamForm } from "@/components/teams/team-form";
import { TeamList } from "@/components/teams/team-list";
import { ScrollArea } from "@/components/ui/scroll-area";

async function createUser(clerkId: string, name: string | null) {
  const user = await User.findOne({ clerkId });
  if (!user) {
    await User.create({ clerkId, name });
  }
}

export default async function SurveysPage() {
  await dbConnect();

  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const user = await currentUser();

  if (user === null) return redirectToSignIn();

  await createUser(user.id, user?.fullName);

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Surveys</h1>
          <p className="text-muted-foreground mt-2">
            Manage your teams and surveys
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Suspense fallback={<div>Loading teams...</div>}>
              <TeamList />
            </Suspense>
          </div>
          <div>
            <TeamForm />
          </div>
        </div>
      </main>
    </ScrollArea>
  );
}