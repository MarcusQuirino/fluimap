"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
const FormSchema = z.object({
  content: z.string().max(150, {
    message: "the post must not be longer than 150 characters.",
  }),
});

export function PostForm() {
  const { user } = useUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  console.dir(user, { depth: null });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          content: data.content,
          author: user?.fullName,
          authorId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      router.refresh();

      toast("post created!");
    } catch (error) {
      console.error(error);
      toast("Failed to create post");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's on your mind?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>write something interesting</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
