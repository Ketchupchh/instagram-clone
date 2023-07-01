'use client'

import { useAuth } from "@/lib/context/auth-context";

export function Login() : JSX.Element
{
    const { signInWithGoogle, signOut } = useAuth();

    return (
        <span className="flex gap-x-2">
            <button className="w-10 h-10 bg-sky-600" onClick={signInWithGoogle}>
                Log in
            </button>

            <button className="w-10 h-10 bg-sky-600" onClick={signOut}>
                Sign Out
            </button>
        </span>
    );
}