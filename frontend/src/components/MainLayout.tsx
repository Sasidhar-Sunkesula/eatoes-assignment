import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Link, Outlet } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useShallow } from "zustand/react/shallow";
import { BaggageClaim } from "lucide-react";

export function MainLayout() {
  const items = useCartStore(useShallow((state) => state.items));
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-h-screen">
      <header className="flex justify-between fixed top-0 h-14 w-full bg-primary-foreground/10 backdrop-blur-sm shrink-0 items-center gap-2 border-b pl-2 pr-4">
        <Link to="/" className="font-bold text-xl">
          Digital Diner
        </Link>
        <nav className="flex items-center gap-6 text-sm mr-4">
          <Link to="/history" className="hover:underline">
            Orders
          </Link>
          <Link
            to="/admin"
            className="hover:underline font-semibold"
          >
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-x-4">
          <Link to="/cart" className="relative">
            <BaggageClaim className="text-gray-600 dark:text-gray-300" />
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemsCount}
              </span>
            )}
          </Link>
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
