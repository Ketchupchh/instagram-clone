'use client'

import { useWindow } from "@/lib/context/window-context";

type AsideProps = {
    children: React.ReactNode;
}

export function Aside({
    children
} : AsideProps) : JSX.Element
{
    const { isMobile } = useWindow();

    return (
        <>
            {!isMobile && (
                <aside className="flex flex-col items-center w-[20rem] mt-14 xs:hidden xl:block">
                    {children}
                </aside>
            )}
        </>
    );
}