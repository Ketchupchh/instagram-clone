import { useAuth } from "@/lib/context/auth-context";
import { manageFollow, manageTotalPhotos, manageTotalPosts, removePost } from "@/lib/firebase/utils";
import type { Post } from "@/lib/types/post";

type PostSettingsModalProps = Post & {
    closeModal: () => void;
}

export function PostSettingsModal(post: PostSettingsModalProps) : JSX.Element
{

    const { user } = useAuth();

    const userId = user?.id as string;
    const isOwner = userId === post.createdBy;
    const isFollowing = user?.following?.includes(post.createdBy);

    const handleFollow = async (): Promise<void> => {
        manageFollow(isFollowing ? 'unfollow' : 'follow', userId as string, post.createdBy);
    }

    const handleRemove = async (): Promise<void> => {
        await Promise.all([
          removePost(post.id),
          manageTotalPosts('decrement', post.createdBy),
          post.images && manageTotalPhotos('decrement', post.createdBy),
        ]);
    
        post.closeModal();
    };

    return (
        <div className="flex flex-col items-center w-full h-full text-[10px] font-bold">
            {!isOwner ? (
                <>
                    {user?.isAdmin ? (
                        <>
                            <button className="w-full p-3 text-[#ED4956]" onClick={handleRemove}>
                                Delete
                            </button>
                            <button className="w-full p-3 border-t border-neutral-700 text-[#ED4956] hover:cursor-not-allowed" disabled>
                                Report
                            </button>
                        </>
                    ) : (
                        <button className="w-full p-3 text-[#ED4956] hover:cursor-not-allowed" disabled>
                            Report
                        </button>
                    )}
                    <button className="w-full p-3 border-t border-neutral-700" onClick={handleFollow}>
                        <p className={isFollowing ? "text-[#ED4956]" : "dark:text-white text-black"}>{isFollowing ? "Unfollow" : "Follow"}</p>
                    </button>
                    <button className="w-full p-3 border-t border-neutral-700">
                        Add to favorites
                    </button>
                </>
            ) : (
                <>
                    <button className="w-full p-3 text-[#ED4956]" onClick={handleRemove}>
                        Delete
                    </button>
                    <button className="w-full p-3 border-t border-neutral-700 hover:cursor-not-allowed" disabled>
                        Edit
                    </button>
                    <button className="w-full p-3 border-t border-neutral-700 hover:cursor-not-allowed" disabled>
                        Turn off commenting
                    </button>
                </>
            )}
            <button className="w-full p-3 border-t border-neutral-700">
                Go to post
            </button>
            {!isOwner ? (
                <>
                    <button className="w-full p-3 border-t border-neutral-700 hover:cursor-not-allowed" disabled>
                        Share to...
                    </button>
                    <button className="w-full p-3 border-t border-neutral-700">
                        Copy link
                    </button>
                    <button className="w-full p-3 border-t border-neutral-700 hover:cursor-not-allowed" disabled>
                        Embed
                    </button>
                </>
            ) : (
                <></>
            )}
            <button className="w-full p-3 border-t border-neutral-700 hover:cursor-not-allowed" disabled>
                About this account
            </button>
            <button className="w-full p-3 border-t border-neutral-700" onClick={post.closeModal}>
                Cancel
            </button>
        </div>
    );
}