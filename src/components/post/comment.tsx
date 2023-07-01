import cn from 'clsx'
import { commentsCollection } from "@/lib/firebase/collections";
import { useCollection } from "@/lib/hooks/useCollection";
import { orderBy, query, where } from "firebase/firestore";
import { UserAvatar } from "../user/user-avatar";
import { UserUsername } from "../user/user-username";
import { CustomIcon } from "../ui/custom-icon";
import { UserTooltip } from "../user/user-tooltip";
import { manageComment, manageCommentLike, manageReply, removeComment } from "@/lib/firebase/utils";
import { useAuth } from "@/lib/context/auth-context";
import { SetStateAction, useState } from "react";
import type { Comment } from "@/lib/types/comment";

type CommentProps = Comment & {
    setTextInput: (value: SetStateAction<string>) => void;
    setIsReplying: (value: SetStateAction<boolean>) => void;
    setCommentId: (value: SetStateAction<string>) => void;
    setCommentParent: (value: SetStateAction<string>) => void;
    origPostId: string;
    isReply?: boolean;
    commentReplyId?: string;
}

export function PostComment(comment: CommentProps) : JSX.Element
{
    
    const { data: repliesData, loading: repliesLoading } = useCollection(
        query(
          commentsCollection,
          where('parent.id', '==', comment.id),
          orderBy('createdAt', 'asc')
        ),
        { allowNull: true }
    );

    const { user } = useAuth();

    const isParent = user?.id === comment.parent.parentId;
    const isOwner = user?.id === comment.createdBy;
    const isAdmin = user?.isAdmin;
    const commentIsLiked = comment.userLikes.includes(user ? user.id : "1");

    const [seeReplies, setSeeReplies] = useState(false);

    const handleSeeReplies = () : void => setSeeReplies((prevSeeReplies) => !prevSeeReplies);

    const handleRemove = async () : Promise<void> => {
        const [commentRef] = await Promise.all([
            removeComment(comment.id),
            manageComment('decrement', comment.origPostId),
            comment.isReply && manageReply('decrement', comment.parent.id),
        ]);
    };

    function handleOnReplyClick()
    {
        comment.setTextInput(`@${comment.user.username} `);
        comment.setIsReplying(true);
        comment.setCommentId(comment.parent.replyParent ? comment.commentReplyId ? comment.commentReplyId : comment.parent.id : comment.id); //I wrote this whole reply thing at like 7am give me a break
        comment.setCommentParent(comment.createdBy);
    }

    return (
        <div className="flex flex-col gap-x-3 group/comment">
            <div className="flex flex-row gap-x-3 items-center">

                <UserTooltip postUserId={comment.createdBy} postUser={comment.user}>
                    <UserAvatar src={comment.user.photoURL} username={comment.user.username} size={35} />
                </UserTooltip>
                <UserTooltip postUserId={comment.createdBy} postUser={comment.user}>
                    <UserUsername userId={comment.createdBy} username={comment.user.username} verified={comment.user.verified} b badgeClassname="w-4 h-4" />
                </UserTooltip>

                <p className="text-[12px]">{comment.comment}</p>

                <button
                    className="w-3 h-3 ml-auto"
                    onClick={manageCommentLike(
                        commentIsLiked ? "unlike" : "like",
                        user ? user.id : "1",
                        comment.id
                    )}
                >
                    {commentIsLiked ? (
                        <CustomIcon className={"w-full h-full text-red-600"} iconName='SolidHeartIcon' />
                    ) : (
                        <CustomIcon className={"w-full h-full"} iconName='HeartIcon' />
                    )}
                </button>
            </div>
            <div className="flex flex-row gap-x-3 h-6 text-neutral-400 text-[11px] ml-11">
                {comment.userLikes.length > 0 && (
                    <button className="font-bold">
                        {comment.userLikes.length > 1 ? (
                            <>
                                {comment.userLikes.length} likes
                            </>
                        ) : (
                            <>
                                {comment.userLikes.length} like
                            </>
                        )}
                    </button>
                )}
                <button className="font-bold" onClick={handleOnReplyClick}>
                    Reply
                </button>

                {(isOwner || isParent || isAdmin) && (
                    <button
                        className="hidden group-hover/comment:block"
                        onClick={handleRemove}
                    >
                        <CustomIcon iconName='EllipsisIcon' />
                    </button>
                )}
            </div>
            {!comment.isReply && (
                <>
                    {comment.userComments > 0 && (
                        <div className="flex flex-col gap-y-3">
                            <button
                                className="flex flex-row gap-x-4 items-center w-40 ml-10 text-[12px] dark:text-neutral-500 font-bold"
                                onClick={handleSeeReplies}
                            >
                                <div className="w-6 border dark:border-neutral-500"/>
                                {seeReplies ? "Hide replies" : `View replies (${comment.userComments})`}
                            </button>
                            {seeReplies && (
                                <div className="ml-10">
                                    {repliesLoading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <>
                                            {repliesData && (
                                                <>
                                                    {repliesData.map((reply, index) => (
                                                        <PostComment
                                                            key={index}
                                                            {...reply}
                                                            setTextInput={comment.setTextInput}
                                                            setIsReplying={comment.setIsReplying}
                                                            setCommentId={comment.setCommentId}
                                                            setCommentParent={comment.setCommentParent}
                                                            origPostId={comment.origPostId}
                                                            isReply={true}
                                                            commentReplyId={comment.parent.replyParent ? comment.parent.replyParent : comment.id}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}