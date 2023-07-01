import { Post } from "@/lib/types/post";
import { UserAvatar } from "../user/user-avatar";
import { UserUsername } from "../user/user-username";
import { CustomIcon } from "../ui/custom-icon";
import Link from "next/link";
import { UserTooltip } from "../user/user-tooltip";
import Image from "next/image";
import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "../modal/modal";
import { PostSettingsModal } from "../modal/post-settings-modal";
import { manageLike } from "@/lib/firebase/utils";
import { useAuth } from "@/lib/context/auth-context";
import { PostModal } from "../modal/post-modal";
import { PostSettings } from "./post-settings";
import { PostActions } from "./post-actions";

type PostProps = Post;

export function Post(post: PostProps) : JSX.Element
{

    const { user } = useAuth();

    const {
        open: postModalOpen,
        openModal: postOpenModal,
        closeModal: postCloseModal
    } = useModal();

    const postIsLiked = post.userLikes.includes(user ? user.id : "1");

    return (
        <div className="flex flex-col gap-x-3 w-full border dark:border-neutral-800 rounded-xl dark:bg-black">
            <Modal
                className="flex items-center justify-center w-screen h-screen"
                modalClassName="w-[90rem] h-[55rem] dark:bg-black bg-white"
                open={postModalOpen}
                closeModal={postCloseModal}
            >
                <PostModal {...post} closeModal={postCloseModal} />
            </Modal>

            <div className="flex flex-row items-center p-3 gap-x-3">
                <UserTooltip postUser={post.user} postUserId={post.createdBy}>
                    <UserAvatar src={post.user.photoURL} username={post.user.username} size={40} />
                </UserTooltip>
                <UserTooltip postUser={post.user} postUserId={post.createdBy}>
                    <UserUsername userId={post.createdBy} username={post.user.username} verified={post.user.verified} b size="text-[14px]" badgeClassname="w-4 h-4"/>
                </UserTooltip>

                <PostSettings className="ml-auto" {...post} />
            </div>
            
            <div className="relative w-full h-96 bg-neutral-800">
                {post.images && (
                    <Image className="absolute w-full h-full" src={post.images[0].src} alt={post.images[0].alt} fill objectFit="cover" />
                )}
            </div>
            <div className="flex flex-row p-3 gap-x-4">
                <PostActions {...post} openPostModal={postOpenModal} />
            </div>
            {post.userLikes.length > 0 && (
                <p className="font-bold px-3 text-[13px]">{post.userLikes.length} {post.userLikes.length === 1 ? "like" : "likes"}</p>
            )}
            <div className="px-3 flex flex-row gap-x-1">
                <UserUsername userId={post.createdBy} username={post.user.username} verified={false} b size="text-[13px]"/>
                <p className="text-[13px]">{post.caption}</p>
            </div>
            <Link href={`/post/${post.id}`} className="px-3 text-[12px] text-neutral-700">{post.userComments > 0 ? `View all ${post.userComments} comments` : `Be the first to comment`}</Link>
        </div>
    );
}