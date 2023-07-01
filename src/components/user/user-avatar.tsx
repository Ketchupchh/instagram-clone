import Image from "next/image";
import Link from "next/link";

type UserAvatarProps = {
    src: string;
    username: string;
    size?: number;
}

export function UserAvatar({
    src,
    username,
    size=55
} : UserAvatarProps) : JSX.Element
{
    return (
        <Link href={`/user/${username}`}>
            <Image className="rounded-full" src={src} alt="user" width={size} height={size}/>
        </Link>
    );
}