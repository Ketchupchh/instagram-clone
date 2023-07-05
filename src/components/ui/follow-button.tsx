import { manageFollow } from "@/lib/firebase/utils";
import cn from 'clsx'

type FollowButtonProps = {
    className?: string;
    textClassName?: string;
    targetUserId: string;
    userFollowing: string[];
    userId: string;
    userCardButton?: boolean;
}

export function FollowButton({
    className,
    textClassName,
    targetUserId,
    userFollowing,
    userId,
    userCardButton=false
} : FollowButtonProps) : JSX.Element
{

    const isFollowing = userFollowing.includes(targetUserId);

    const handleFollow = async (): Promise<void> => {
        manageFollow(isFollowing ? 'unfollow' : 'follow', userId as string, targetUserId);
    }

    return (
        <>
            {userCardButton ? (
                <button
                    className={
                        cn(
                            "flex items-center justify-center w-20 h-8 p-3 bg-[#0095f6] rounded-md text-[12px] font-bold",
                            className,
                            isFollowing ? "dark:bg-white bg-neutral-100" : ""
                        )
                    }
                    onClick={handleFollow}
                >
                    <p className={textClassName ? textClassName : isFollowing ? "text-black" : "text-white"}>
                        {isFollowing ? "Unfollow" : "Follow"}
                    </p>
                </button>
            ) : (
                <button className={className} onClick={handleFollow}>
                    <p className={textClassName ? textClassName : isFollowing ? "text-red-600" : "text-[#0095f6]"}>
                        {isFollowing ? "Unfollow" : "Follow"}
                    </p>
                </button>
            )}
        </>
    );
}