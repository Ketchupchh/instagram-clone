'use client'

import Link from "next/link";
import { CustomIcon } from "../ui/custom-icon";
import { useWindow } from "@/lib/context/window-context";
import { useAuth } from "@/lib/context/auth-context";
import { UserAvatar } from "../user/user-avatar";


export function MobileFooter() : JSX.Element
{

    const { isMobile } = useWindow();
    const { user, signInWithGoogle } = useAuth();

    return (
        <>
            { isMobile && (
                <div className="fixed bottom-0 flex flex-row items-center justify-around bg-white dark:bg-black w-full h-12 border-t dark:border-neutral-800 z-50">
                    <Link href='/'><CustomIcon iconName='HomeIcon' /></Link>
                    <Link href="/explore"><CustomIcon iconName='ExploreIcon' /></Link>
                    <Link href="/explore"><CustomIcon iconName='ReelsIcon' /></Link>
                    <button><CustomIcon iconName='CreateIcon' /></button>
                    <button><CustomIcon iconName='MessagesIcon' /></button>

                    {user ? (
                        <Link href={`/user/${user?.username}`}><UserAvatar src={user.photoURL} username={user.username} size={30} /></Link>
                    ) : (
                        <button onClick={signInWithGoogle}>
                            Sign in
                        </button>
                    )}
                </div>
            )}
        </>
    );
}