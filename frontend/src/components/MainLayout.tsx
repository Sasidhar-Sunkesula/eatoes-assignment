import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="max-h-screen">
      <header className="flex justify-between fixed top-0 h-14 w-full bg-primary-foreground/10 backdrop-blur-sm shrink-0 items-center gap-2 border-b pl-2 pr-4">
        <div className="text-lg font-semibold">Digital Diner</div>
        <div>
          <ModeToggle />
          <SignedOut>
            <Button size="sm">
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main className="mt-14">
        <Outlet />
      </main>
    </div>
  );
}
