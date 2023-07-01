import cn from 'clsx'
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type UserUsernameProps = {
    userId: string;
    username: string;
    verified: boolean;
    b?: boolean;
    size?: string;
    badgeClassname?: string;
}

export function UserUsername({
    userId,
    username,
    verified,
    b=false,
    size="text-[12px]",
    badgeClassname="h-6 h-6"
} : UserUsernameProps) : JSX.Element
{
    return (
        <Link
            href={`/user/${username}`}
            className={
                cn(
                    "flex flex-row gap-x-2 items-center",
                    size && size,
                    b && "font-bold"
                )
            }
        >
            {username}
            {verified && <CheckBadgeIcon className={cn("text-[#3797f0]", badgeClassname)} />}
        </Link>
    );
}