import Link from "next/link";
import { UserAvatar } from "./user-avatar";
import { UserUsername } from "./user-username";
import { FollowButton } from "../ui/follow-button";
import { PostUserData } from "@/lib/types/post";
import { useAuth } from "@/lib/context/auth-context";
import type { User } from "@/lib/types/user";

type UserCardProps = User;

export function UserCard(userData: UserCardProps) : JSX.Element
{

    const { user } = useAuth();

    const isOwner = user?.id === userData.id;

    return (
        <div className="w-full flex flex-row items-center gap-x-2 py-2">
            <Link className="flex flex-row gap-x-2" href={`/user/${userData.username}`}>
                <UserAvatar src={userData.photoURL} username={userData.username} />
                <UserUsername userId={userData.id} username={userData.username} verified={userData.verified} size="text-[13px]" badgeClassname="w-4 h-4" b />
            </Link>
            {!isOwner && <FollowButton className="text-[10px] text-[#0095f6] hover:text-white ml-auto" targetUserId={userData.id} userFollowing={user ? user.following : []} userId={user ? user.id : ""} />}
        </div>
    );
}