"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"

const NavBar = () => {

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/u/${user?.username}`);
        toast.success("Link copied to clipboard", {
            description: "Share this link with people to get feedback",
        });
    }
    const { data: session } = useSession();
    const user: User = session?.user;
    const { theme, setTheme } = useTheme();

    return ( 
        <>
            <nav className="flex items-center justify-between">
                <div className="">
                    <Link href={"/"} className="text-3xl font-bold tracking-tight sm:text-4xl select-none">messages</Link>
                </div>
                <div className="flex-1 justify-items-end">
                    <div>
                        {
                            session ? 
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                    className="w-48 font-[family-name:var(--font-geist-sans)]"
                                    align="end"
                                    >
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={copyLink}>
                                            Share link
                                        </DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Dark Mode</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="font-[family-name:var(--font-geist-sans)]">
                                                    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                                        <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            : <Link href={'/sign-in'} className="font-semibold sm:text-xl">Sign In</Link>
                        }
                    </div>
                </div>
            </nav>

        </>
    );
}
 
export default NavBar;


