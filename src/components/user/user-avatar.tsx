import Image from "next/image";
import Link from "next/link";

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
    return (
        <Link href={`/user/${username}`}>
            <div className={className}>
                <Image className="rounded-full w-full h-full" src={src} alt="user" width={100} height={100}/>
            </div>
        </Link>
    );
}