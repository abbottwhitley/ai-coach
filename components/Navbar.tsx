"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const routes = [
    {
        name: "Chat",
        path: "/chatpage",
    },
    {
        name: "Profile",
        path: "/profile",
    }
]


export default function Navbar() {
    const pathname = usePathname();
    const { isSignedIn } = useAuth();


    return (
        <div className="p-4 flex flex-row justify-between items-center bg-black text-white ">
            <Link href="/">
                <h1 className="text-2xl font-bold">My AI Coach</h1>
            </Link>
            {isSignedIn && (
                <div className="flex gap-x-6 text-lg items-center">
                    {routes.map((route, idx) => (
                        <Link
                            key={idx}
                            href={route.path}
                            className={
                                pathname === route.path ? "border-b-2 border-yellow-500" : ""
                            }
                        >
                            {route.name}
                        </Link>
                    ))}
                    <UserButton appearance={{
                        elements: {
                        avatarBox: "w-8 h-8"
                        }
                    }} />
                </div>
            )}
            {!isSignedIn && (
                <div className="flex gap-x-6 text-lg items-center">
                    <Link href="/sign-in">
                        <Button>Sign-In</Button>
                    </Link>
                
                    <Link href="/sign-up">
                        <Button>Sign-Up</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

