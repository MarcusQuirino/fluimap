import { ModeToggle } from "@/components/mode-toggle";
import { PostForm } from "@/components/post-form";
import { PostList } from "@/components/post-list";
import { connectToDatabase } from "@/lib/db";

export default async function Home() {
  await connectToDatabase();
  return (
    <main className="flex h-screen w-screen flex-col items-center overflow-hidden p-24">
      <h1 className="text-4xl font-bold">Welcome to FluiMap</h1>
      <PostForm />
      <div className="p-4" />
      <PostList />
      <ModeToggle />
    </main>
  );
}
