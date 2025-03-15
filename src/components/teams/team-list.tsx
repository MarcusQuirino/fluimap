"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Team = {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

interface ApiError {
  error: string;
}

interface TeamsResponse {
  teams: Team[];
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

async function fetchTeams(): Promise<Team[]> {
  const response = await fetch("/api/teams");

  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to fetch teams");
  }

  const data = (await response.json()) as TeamsResponse;
  return data.teams;
}

export function TeamList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [runningTeams, setRunningTeams] = useState<Record<string, boolean>>({});

  const {
    data: teams = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  if (error instanceof Error) {
    toast.error(error.message);
  }

  async function deleteTeam(teamId: string) {
    if (
      !confirm(
        "Are you sure you want to delete this team? This will also delete all respondees.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiError;
        throw new Error(errorData.error || "Failed to delete team");
      }

      toast.success("Team deleted successfully");
      // Invalidate and refetch teams
      void queryClient.invalidateQueries({ queryKey: ["teams"] });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }

  async function runSurvey(teamId: string) {
    try {
      setRunningTeams((prev) => ({ ...prev, [teamId]: true }));

      const response = await fetch("/api/surveys/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiError;
        throw new Error(errorData.error || "Failed to run survey");
      }

      const data = (await response.json()) as SurveyRunResponse;
      toast.success(
        `Survey started with ID: ${data.surveyId}. ${data.respondeeCount} emails will be sent.`,
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setRunningTeams((prev) => ({ ...prev, [teamId]: false }));
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading teams...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Teams</CardTitle>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No teams found. Create your first team to get started.
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {teams.map((team) => (
                <Card key={team._id} className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        {team.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {team.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/teams/${team._id}`)
                          }
                        >
                          Manage
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => void deleteTeam(team._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => void runSurvey(team._id)}
                      disabled={runningTeams[team._id]}
                      className="w-full"
                    >
                      {runningTeams[team._id] ? "Running..." : "Run Survey"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
