import { manageLike, manageSaved } from "@/lib/firebase/utils";
import { CustomIcon } from "../ui/custom-icon";
import { useAuth } from "@/lib/context/auth-context";
import { useRouter } from "next/navigation";
import { useWindow } from "@/lib/context/window-context";
import { motion } from "framer-motion";
import type { Post } from "@/lib/types/post";
import { Pagination } from "./pagination";
import { Dispatch, SetStateAction } from "react";

type PostActionsProps = Post & {
    openPostModal?: () => void;
    pagination?: boolean;
    index?: number;
    setIndex?: Dispatch<SetStateAction<number>>;
};

export function PostActions(post: PostActionsProps) : JSX.Element
{

    const { user, userSaved } = useAuth();
    const { isMobile } = useWindow();
    const router = useRouter();

    const postIsLiked = post.userLikes.includes(user ? user.id : "1");
    const postIsSaved = !!userSaved?.some(({ id }) => id === post.id);

    const handleSaved = async () : Promise<void> => {
        if(user)
        {
            await manageSaved(postIsSaved ? 'unsave' : 'save', user.id, post.id);
        }
    }

    const handleCommentClick = () => {
        if(isMobile) router.push(`/p/${post.id}`);
        else post.openPostModal ? post.openPostModal() : router.push(`/p/${post.id}`);
    }
    
    return ( 
        <>
            <motion.button
                className="flex flex-row items-center gap-x-3 hover:brightness-75"
                onClick={manageLike(
                    postIsLiked ? "unlike" : "like",
                    user ? user.id : "1",
                    post.id
                )}
                whileTap={{
                    scale: 1.3
                }}
                transition={{
                    duration: 0.23
                }}
            >
                <CustomIcon className={postIsLiked ? "text-red-600 w-6 h-6" : "dark:text-white text-black w-6 h-6"} iconName={postIsLiked ? "SolidHeartIcon" : "HeartIcon"}  />
            </motion.button>
            <button className="w-6 h-6" onClick={handleCommentClick}>
                <CustomIcon className="hover:brightness-75" iconName="MessageIcon" />
            </button>
            <button className="w-6 h-6 hover:brightness-75 hover:cursor-not-allowed" disabled>
                <CustomIcon iconName="SendToIcon" />
            </button>

            {post.pagination && <Pagination images={post.images ? post.images.length : 0} index={post.index ? post.index : 0} />}

            <button className="w-6 h-6 ml-auto hover:brightness-75" onClick={handleSaved}>
                <CustomIcon iconName={postIsSaved ? "SolidSaveIcon" : "SaveIcon"}/>
            </button>
        </>
    );
}