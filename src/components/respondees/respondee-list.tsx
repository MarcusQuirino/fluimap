"use client";

import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Respondee = {
  _id: string;
  name: string;
  email: string;
  role: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
};

interface ApiError {
  error: string;
}

interface TeamResponse {
  team: {
    _id: string;
    name: string;
    description?: string;
    ownerId: string;
  };
  respondees: Respondee[];
}

interface RespondeeListProps {
  teamId: string;
}

async function fetchRespondees(teamId: string): Promise<Respondee[]> {
  const response = await fetch(`/api/teams/${teamId}`);

  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || "Failed to fetch team members");
  }

  const data = await response.json() as TeamResponse;
  return data.respondees;
}

export function RespondeeList({ teamId }: RespondeeListProps) {
  const queryClient = useQueryClient();
  
  const { 
    data: respondees = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ["respondees", teamId],
    queryFn: () => fetchRespondees(teamId),
  });

  if (error instanceof Error) {
    toast.error(error.message);
  }

  async function deleteRespondee(respondeeId: string) {
    if (!confirm("Are you sure you want to delete this team member?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/respondees/${respondeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || "Failed to delete team member");
      }

      toast.success("Team member deleted successfully");
      // Invalidate and refetch team members
      void queryClient.invalidateQueries({ queryKey: ["respondees", teamId] });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading team members...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        {respondees.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No team members found. Add team members to get started.
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {respondees.map((respondee) => (
                <Card key={respondee._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{respondee.name}</h3>
                      <p className="text-sm">{respondee.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Role: {respondee.role}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void deleteRespondee(respondee._id)}
                    >
                      Remove
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