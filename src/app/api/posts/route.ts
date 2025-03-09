import { type NextRequest, NextResponse } from "next/server";
import Post from "@/models/Posts";
import { revalidatePath } from "next/cache";

// POST handler to create a new post
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      content: string;
      author: string;
      authorId: string;
    };
    const { content, author, authorId } = body;

    const post = await Post.create({ content, author, authorId });

    revalidatePath("/");

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
