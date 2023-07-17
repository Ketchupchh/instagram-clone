'use client'

import { useUser } from "@/lib/context/user-context";
import { ReactNode } from "react";
import { UserDetails } from "../user/user-details";
import { UserProfileNav } from "../user/user-profile-nav";
import { useAuth } from "@/lib/context/auth-context";
import { Footer } from "./footer";
import { usePathname, useRouter } from "next/navigation";

type UserHomeLayoutProps = {
    children: ReactNode;
}

const validRoutes = [
    "saved"
];

export function UserHomeLayout({
    children,
} : UserHomeLayoutProps) : JSX.Element
{
    const { user } = useUser();
    const { user: currUser } = useAuth();
    const { back } = useRouter();

    const isOwner = currUser?.id === user?.id;
    
    const pathname = usePathname();
    const parts = pathname.split('/');
    const route = parts[parts.length - 1];

    return (
        <div className="flex flex-col gap-y-5 items-center overflow-hidden pt-24 px-0 w-full ml-0 xs:ml-[20rem] xs:w-[70rem] xs:pt-8 xs:px-10">
            {user && <UserDetails {...user} />}
            <div className="w-full min-h-[40rem] p-0 xs:p-10">
                {user ? (
                    <UserProfileNav
                        isOwner={isOwner}
                        username={user.username}
                        totalPosts={user.totalPosts}
                        followers={user.followers}
                        following={user.following}
                        route={validRoutes.includes(route) ? route : "posts"}
                    />
                ) : (
                    <>
                        <h1 className="px-5 font-bold text-2xl">Sorry, this page isn't available.</h1>
                        <p className='px-5'>The link you followed may be broken, or the page may have been removed. Go back to <button onClick={back}>Instagram.</button></p>
                    </>
                )}
                {children}
            </div>
            <div className="hidden xs:block w-full">
                <Footer />
            </div>
        </div>
    );
}