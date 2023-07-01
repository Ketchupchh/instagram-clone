'use client'

import { useWindow } from "@/lib/context/window-context";
import Link from "next/link";
import { CustomIcon } from "../ui/custom-icon";

export function MobileHeader() : JSX.Element
{

    const { isMobile } = useWindow();

    return (
        <>
            {isMobile && (
                <div className="fixed top-0 flex flex-row gap-x-5 items-center bg-white dark:bg-black w-full h-20 border-b dark:border-neutral-800 z-50 px-5">
                    <Link className="flex flex-row items-center gap-x-2" href="/">
                        <CustomIcon className="w-24 h-24" iconName='InstagramTextLogo' />
                        <CustomIcon iconName='ArrowDownIcon' />
                    </Link>

                    <search className="flex flex-row ml-auto items-center gap-x-2 bg-black/10 dark:bg-neutral-800 rounded-lg p-2">
                        <CustomIcon className="dark:text-neutral-500 w-6 h-6" iconName='MagnifyingGlass' />
                        <input
                            className="bg-transparent outline-none"
                            type="search"
                        />
                    </search>

                    <CustomIcon className="w-6 h-6" iconName='HeartIcon' />
                </div>
            )}
        </>
    );
}