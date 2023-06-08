"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LandmarkIcon,
  LogOutIcon,
  NewspaperIcon,
  UserCircle2,
  UserIcon,
} from "lucide-react";

type UserMenuProps = {};
export default function UserMenu({}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage></AvatarImage>
          <AvatarFallback>
            <UserIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-md">The King</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              @mantton
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <div className="flex items-center gap-2">
              <UserCircle2 className="h-4 w-4" />
              <span>Profile</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/feed">
            <div className="flex items-center gap-2">
              <NewspaperIcon className="h-4 w-4" />
              <span>Feed</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/theatres">
            <div className="flex items-center gap-2">
              <LandmarkIcon className="h-4 w-4" />
              <span>Theatres</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/sign-out" className="text-destructive">
            <div className="flex items-center gap-2">
              <LogOutIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
