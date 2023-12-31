import { Post } from "@/lib/types/post";
import { UserAvatar } from "../user/user-avatar";
import { UserUsername } from "../user/user-username";
import Link from "next/link";
import { UserTooltip } from "../user/user-tooltip";
import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "../modal/modal";
import { PostModal } from "../modal/post-modal";
import { PostSettings } from "./post-settings";
import { PostActions } from "./post-actions";
import { usersCollection } from "@/lib/firebase/collections";
import { useArrayDocument } from "@/lib/hooks/useArrayDocument";
import { UserCards } from "../user/user-cards";
import { useState } from "react";
import { PostCarousel } from "./post-carousel";
import { manageLike } from "@/lib/firebase/utils";

type PostProps = Post;

export function Post(post: PostProps) : JSX.Element
{
    const [index, setIndex] = useState(0);

    const {
        open: postModalOpen,
        openModal: postOpenModal,
        closeModal: postCloseModal
    } = useModal();

    const {
        open: likeModalOpen,
        openModal: likeOpenModal,
        closeModal: likeCloseModal
    } = useModal();

    const { data, loading } = useArrayDocument(
        post.userLikes,
        usersCollection,
        { disabled: !'likes' }
    );

    return (
        <div className="flex flex-col w-full xs:border xs:dark:border-neutral-800 xs:rounded-xl dark:bg-black items-start">

            <Modal
                className="flex items-center justify-center w-screen h-screen"
                modalClassName="flex flex-col w-[25rem] h-[25rem] dark:bg-neutral-800 bg-white rounded-xl overflow-hidden"
                open={likeModalOpen}
                closeModal={likeCloseModal}
            >
                <UserCards
                    type="likes"
                    data={data}
                    loading={loading}
                    includeName
                    followButton
                    userCardButton
                />
            </Modal>

            <Modal
                className="flex items-center justify-center w-screen h-screen"
                modalClassName="w-[90rem] h-[55rem] dark:bg-black bg-white"
                open={postModalOpen}
                closeModal={postCloseModal}
            >
                <PostModal {...post} closeModal={postCloseModal} />
            </Modal>

            <div className="flex flex-row items-center p-3 gap-x-3 w-full">
                <UserTooltip postUser={post.user} postUserId={post.createdBy}>
                    <UserAvatar className="w-10 h-10 rounded-full overflow-hidden" src={post.user.photoURL} username={post.user.username} />
                </UserTooltip>
                <UserTooltip postUser={post.user} postUserId={post.createdBy}>
                    <UserUsername userId={post.createdBy} username={post.user.username} verified={post.user.verified} b size="text-[14px]" badgeClassname="w-4 h-4"/>
                </UserTooltip>

                <PostSettings className="ml-auto" {...post} />
            </div>
            
            <div className="relative w-full h-96 bg-neutral-800 overflow-hidden">
                {post.images && (
                    <PostCarousel
                        postId={post.id}
                        images={post.images}
                        setIndex={setIndex}
                    />
                )}
            </div>
            <div className="flex flex-row p-3 gap-x-4 w-full">
                <PostActions {...post} openPostModal={postOpenModal} setIndex={setIndex} index={index} pagination />
            </div>
            {post.userLikes.length > 0 && (
                <button className="font-bold px-3 text-[13px]" onClick={likeOpenModal}>
                    {post.userLikes.length} {post.userLikes.length === 1 ? "like" : "likes"}
                </button>
            )}
            <div className="px-3 flex flex-row gap-x-1 mt-1">
                <UserUsername userId={post.createdBy} username={post.user.username} verified={false} b size="text-[13px]"/>
                <p className="text-[13px]">{post.caption}</p>
            </div>
            <Link
                className="px-3 text-[12px] text-neutral-700 mt-1 mb-1"
                href={`/p/${post.id}`}
            >
                {post.userComments > 0 ? `View all ${post.userComments} comments` : `Be the first to comment`}
            </Link>
        </div>
    );
}