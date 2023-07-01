import Image from "next/image";
import { UserTooltip } from "../user/user-tooltip";
import { UserAvatar } from "../user/user-avatar";
import { UserUsername } from "../user/user-username";
import { PostSettings } from "../post/post-settings";
import { PostActions } from "../post/post-actions";
import { useCollection } from "@/lib/hooks/useCollection";
import { orderBy, query, where } from "firebase/firestore";
import { commentsCollection } from "@/lib/firebase/collections";
import { useAuth } from "@/lib/context/auth-context";
import { manageComment, manageReply } from "@/lib/firebase/utils";
import { sleep } from "@/lib/utils";
import { Timestamp, WithFieldValue, addDoc, serverTimestamp } from "firebase/firestore";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { PostComment } from "../post/comment";
import type { Post } from "@/lib/types/post";
import type { Comment } from "@/lib/types/comment";

type PostModalProps = Post & {
    closeModal: () => void;
}

export function PostModal(post: PostModalProps) : JSX.Element
{

    const { data: repliesData, loading: repliesLoading } = useCollection(
        query(
          commentsCollection,
          where('parent.id', '==', post.id),
          orderBy('createdAt', 'desc')
        ),
        { allowNull: true }
    );

    const { user } = useAuth();

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [commentId, setCommentId] = useState('');
    const [commentParent, setCommentParent] = useState('');

    useEffect(() => {
        if(isReplying && inputValue === '')
        {
            setIsReplying(false);
        }
    }, [inputValue, isReplying]);

    const sendComment = async (): Promise<void> => {

        if(inputValue === '') return;

        inputRef.current?.blur();

        const userId = user?.id as string;
        const PhotoURL = user?.photoURL as string;
        const username = user?.username as string;
        const name = user?.name as string;
        const verified = user?.verified as boolean;
        const isAdmin = user?.isAdmin as boolean;
        const bio = user?.bio as string;
        const following = user?.following as string[];
        const followers = user?.followers as string[];
        const createdAt = user?.createdAt as Timestamp;
        const updatedAt = user?.updatedAt as Timestamp;
        const totalPosts = user?.totalPosts as number;
        const totalPhotos = user?.totalPhotos as number;
        const isPrivate = user?.private as boolean;

        const postData: WithFieldValue<Omit<Comment, 'id'>> = {
            comment: inputValue.trim(),
            parent: { id: isReplying ? commentId.trim() : post.id, parentId: isReplying ? commentParent.trim() : post.createdBy, replyParent: isReplying ? commentId.trim() : null },
            mention: null,
            userLikes: [],
            createdBy: userId,
            user: {
                userId: userId,
                bio: bio,
                name: name,
                username: username,
                photoURL: PhotoURL,
                isAdmin: isAdmin,
                verified: verified,
                following: following,
                followers: followers,
                createdAt: createdAt,
                updatedAt: updatedAt,
                totalPosts: totalPosts,
                totalPhotos: totalPhotos,
                private: isPrivate,
            },
            createdAt: serverTimestamp(),
            updatedAt: null,
            userComments: 0,
        };

        await sleep(500);

        const [commentRef] = await Promise.all([
            addDoc(commentsCollection, postData),
            manageComment('increment', post.id),
            isReplying && manageReply('increment', commentId)
        ]);

        setInputValue('');
    }

    const handleChange = ({
        target: { value }
    }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        void sendComment();
    };

    return (
        <div className="flex flex-row w-full h-full">
            {post.images && (
                <>
                    <div className="relative w-[60rem] h-full">
                        <Image className="w-full h-full" src={post.images[0].src} alt={post.images[0].alt} fill objectFit="contain"/>
                    </div>
                    <div className="flex flex-col w-[30rem] h-full border-l border-neutral-800">
                        <div className="flex flex-row gap-x-3 p-3 border-b border-neutral-800">
                            <UserTooltip postUser={post.user} postUserId={post.createdBy}>
                                <UserAvatar src={post.user.photoURL} username={post.user.username} size={35}/>
                            </UserTooltip>
                            <UserUsername userId={post.createdBy} username={post.user.username} verified={post.user.verified} b badgeClassname="w-4 h-4" />

                            <PostSettings className="ml-auto" {...post} />
                        </div>
                        <div className="p-3 w-full h-full">
                            {post.caption && (
                                <div className="flex flex-col mb-5">
                                    <div className="flex flex-row gap-x-3 items-center">
                                        <UserAvatar src={post.user.photoURL} username={post.user.username} size={35} />
                                        <UserUsername userId={post.createdBy} username={post.user.username} verified={post.user.verified} b badgeClassname="w-4 h-4" />
                                        <p className="text-[12px]">{post.caption}</p>
                                    </div>
                                </div>
                            )}

                            {repliesLoading ? (
                                <>
                                    <p>Loading...</p>
                                </>
                            ) : !repliesData ? (
                                <>
                                    {!post.caption && (
                                        <div className="flex flex-col justify-center items-center w-full h-full">
                                            <p className="text-[23px] font-bold">No comments yet.</p>
                                            <p className="text-[13px]">Start the conversation.</p>
                                        </div> 
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col gap-y-5">
                                    {repliesData.map((comment, index) => (
                                        <PostComment
                                            key={index}
                                            {...comment}
                                            setTextInput={setInputValue}
                                            setIsReplying={setIsReplying}
                                            setCommentId={setCommentId}
                                            setCommentParent={setCommentParent}
                                            origPostId={post.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row gap-x-3 p-3 border-t border-b border-neutral-800">
                            <PostActions {...post} />
                        </div>
                        <div className="h-14 p-3">
                            <form className="flex flex-row gap-x-3 items-center w-full h-full" onSubmit={handleSubmit}>
                                <textarea
                                    className='w-full h-full bg-inherit outline-none resize-none text-[13px]'
                                    placeholder='Write a comment...'
                                    rows={4}
                                    value={inputValue}
                                    onChange={handleChange}
                                />
                                <button className="ml-auto text-[13px] font-bold">
                                    Post
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}