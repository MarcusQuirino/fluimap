import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <div className="flex h-8 w-full items-center justify-between p-8">
      <h1 className="text-2xl font-bold">FluiMap</h1>
      <div className="flex flex-row items-center gap-4">
        <UserButton />
        <ModeToggle />
      </div>
    </div>
  );
}
