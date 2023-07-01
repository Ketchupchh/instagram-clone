import { manageFollow } from "@/lib/firebase/utils";

type FollowButtonProps = {
    className?: string;
    textClassName?: string;
    targetUserId: string;
    userFollowing: string[];
    userId: string;
}

export function FollowButton({
    className,
    textClassName,
    targetUserId,
    userFollowing,
    userId
} : FollowButtonProps) : JSX.Element
{

    const isFollowing = userFollowing.includes(targetUserId);

    const handleFollow = async (): Promise<void> => {
        manageFollow(isFollowing ? 'unfollow' : 'follow', userId as string, targetUserId);
    }

    return (
        <button className={className} onClick={handleFollow}>
            <p className={textClassName ? textClassName : isFollowing ? "text-red-600" : "text-[#0095f6]"}>
                {isFollowing ? "Unfollow" : "Follow"}
            </p>
        </button>
    );
}