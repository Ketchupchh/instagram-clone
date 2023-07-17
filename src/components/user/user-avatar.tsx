import cn from 'clsx'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type UserAvatarProps = {
    className?: string;
    src: string;
    username: string;
}

export function UserAvatar({
    className="w-10 h-10 rounded-full overflow-hidden",
    src,
    username,
} : UserAvatarProps) : JSX.Element
{

    const [loading, setLoading] = useState(true);

    const handleLoad = (): void => setLoading(false);

    return (
        <Link href={`/user/${username}`}>
            <div className={className}>
                <Image
                    className={
                        cn(
                            "rounded-full w-full h-full",
                            loading && "animate-pulse bg-neutral-700"
                        )
                    }
                    src={src}
                    alt={username}
                    width={100}
                    height={100}
                    onLoadingComplete={handleLoad}
                />
            </div>
        </Link>
    );
}