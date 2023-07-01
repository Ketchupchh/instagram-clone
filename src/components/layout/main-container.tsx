'use client'

import { useWindow } from '@/lib/context/window-context';
import cn from 'clsx'

type MainContainerProps = {
    children: React.ReactNode;
}

export function MainContainer({
    children
} : MainContainerProps) : JSX.Element
{

    const { isMobile } = useWindow();

    return (
        <div className={cn("flex flex-row min-h-screen justify-center gap-10", isMobile && "mb-20")}>
            {children}
        </div>
    );
}