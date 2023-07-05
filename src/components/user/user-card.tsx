import Link from "next/link";
import { UserAvatar } from "./user-avatar";
import { UserUsername } from "./user-username";
import { FollowButton } from "../ui/follow-button";
import { useAuth } from "@/lib/context/auth-context";
import type { User } from "@/lib/types/user";

type UserCardProps = User & {
    avatarSize?: string;
    badgeSize?: string;
    includeName?: boolean;
    followButton?: boolean;
    followButtonClassName?: string;
    userCardButton?: boolean;
};

export function UserCard(userData: UserCardProps) : JSX.Element
{

    const { user } = useAuth();

    const isOwner = user?.id === userData.id;

    return (
        <div className="w-full flex flex-row items-center gap-x-2 py-2">
            <Link className="flex flex-row gap-x-2" href={`/user/${userData.username}`}>
                <UserAvatar className={userData.avatarSize ? userData.avatarSize : "w-8 h-8"} src={userData.photoURL} username={userData.username}/>
                <UserUsername
                    userId={userData.id}
                    username={userData.username}
                    verified={userData.verified}
                    size="text-[13px]"
                    badgeClassname={userData.badgeSize ? userData.badgeSize : "w-4 h-4"}
                    name={userData.name}
                    includeName={userData.includeName}
                    b
                />
            </Link>
            {!isOwner && userData.followButton && (
                <FollowButton
                    className={userData.followButtonClassName ? userData.followButtonClassName : "text-[10px] text-[#0095f6] hover:text-white ml-auto"}
                    targetUserId={userData.id}
                    userFollowing={user ? user.following : []}
                    userId={user ? user.id : ""}
                    userCardButton={userData.userCardButton}
                />
            )}
        </div>
    );
}