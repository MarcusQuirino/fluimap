import { Posts } from "./posts";
import { ScrollArea } from "./ui/scroll-area";
import Post from "@/models/Posts";

async function getPosts() {
  const data = await Post.find();
  return data;
}

export async function PostList() {
  const data = await getPosts();
  return (
    <ScrollArea className="h-[500px] w-full">
      {[...data].reverse().map((data) => (
        <Posts
          key={data._id as string}
          author={data.author}
          content={data.content}
          createdAt={data.createdAt!}
        />
      ))}
    </ScrollArea>
  );
}
