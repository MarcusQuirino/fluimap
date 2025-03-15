"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ApiError {
  error: string;
}

interface BulkImportFormProps {
  teamId: string;
  onSuccess?: () => void;
}

export function BulkImportForm({ teamId, onSuccess }: BulkImportFormProps) {
  const [csvData, setCsvData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleImport = async () => {
    try {
      setIsLoading(true);
      
      // Simple CSV parsing (name, email, role)
      const rows = csvData
        .split("\n")
        .map(row => row.trim())
        .filter(row => row.length > 0);
      
      const respondees = rows.map(row => {
        const [name, email, role] = row.split(",").map(item => item.trim());
        return { name, email, role };
      });
      
      // Validate the data
      const invalidRows = respondees.filter(
        row => !row.name || !row.email || !row.email.includes("@") || !row.role
      );
      
      if (invalidRows.length > 0) {
        throw new Error(`Invalid data in CSV. Each row must contain name, email, and role.`);
      }
      
      const response = await fetch("/api/respondees", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          respondees,
          teamId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || "Failed to import team members");
      }

      toast.success(`Successfully imported ${respondees.length} team members`);
      setCsvData("");
      // Update respondees data after successful import
      void queryClient.invalidateQueries({ queryKey: ["respondees", teamId] });
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bulk Import Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Enter CSV data with format: <span className="font-mono">name, email, role</span>
              <br />
              One entry per line.
            </p>
            <Textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="John Doe, john@example.com, Developer\nJane Smith, jane@example.com, Manager"
              className="h-[150px] font-mono"
            />
          </div>
          <Button 
            onClick={() => void handleImport()} 
            disabled={isLoading || !csvData.trim()}
          >
            {isLoading ? "Importing..." : "Import Members"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}