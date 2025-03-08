import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Posts({
  author,
  content,
  createdAt,
}: {
  author: string;
  content: string;
  createdAt: Date;
}) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="" alt={author} />
            <AvatarFallback>{author.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{author}</h3>
            <p className="text-sm text-muted-foreground">
              Posted: {createdAt?.toLocaleDateString()} at{" "}
              {createdAt?.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("prose dark:prose-invert max-w-none")}>
          <p>{content}</p>
        </div>
      </CardContent>
    </Card>
  );
}
