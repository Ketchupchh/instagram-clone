import cn from 'clsx'
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type UserUsernameProps = {
    userId: string;
    username: string;
    name?: string;
    verified: boolean;
    b?: boolean;
    size?: string;
    badgeClassname?: string;
    includeName?: boolean;
}

export function UserUsername({
    userId,
    username,
    name,
    verified,
    b=false,
    size="text-[12px]",
    badgeClassname="h-6 h-6",
    includeName=false
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
            {includeName ? (
                <div className='flex flex-col'>
                    <div className='flex flex-row gap-x-2 items-center'>
                        {username}
                        {verified && <CheckBadgeIcon className={cn("text-[#3797f0]", badgeClassname)} />}
                    </div>
                    <p className='text-neutral-500'>{name}</p>
                </div>
            ) : (
                <>
                    {username}
                    {verified && <CheckBadgeIcon className={cn("text-[#3797f0]", badgeClassname)} />}
                </>
            )}
        </Link>
    );
}