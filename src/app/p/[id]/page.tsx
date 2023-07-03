'use client'

import { PostComment } from "@/components/post/comment";
import { UserAvatar } from "@/components/user/user-avatar";
import { useAuth } from "@/lib/context/auth-context";
import { commentsCollection, postsCollection } from "@/lib/firebase/collections";
import { manageComment, manageReply } from "@/lib/firebase/utils";
import { useCollection } from "@/lib/hooks/useCollection";
import { useDocument } from "@/lib/hooks/useDocument";
import { sleep } from "@/lib/utils";
import { Timestamp, addDoc, doc, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import type { WithFieldValue } from "firebase-admin/firestore";
import type { Comment } from "@/lib/types/comment";
import Image from "next/image";
import { UserTooltip } from "@/components/user/user-tooltip";
import { UserUsername } from "@/components/user/user-username";
import { PostSettings } from "@/components/post/post-settings";
import { Footer } from "@/components/layout/footer";

export default function Create() {

    const { id } = useParams();

    const { user, signInWithGoogle } = useAuth();

    const { data: postData, loading: postLoading } = useDocument(
        doc(postsCollection, id as string),
        { allowNull: true }
    );

    const { data: repliesData, loading: repliesLoading } = useCollection(
        query(
          commentsCollection,
          where('parent.id', '==', id),
          orderBy('createdAt', 'desc')
        ),
        { allowNull: true }
    );

    const postCreatedBy = postData ? postData.createdBy : '1';

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
            parent: { id: isReplying ? commentId.trim() : id, parentId: isReplying ? commentParent.trim() : postCreatedBy, replyParent: isReplying ? commentId.trim() : null },
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
            manageComment('increment', id),
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
        <div className="flex flex-col w-screen min-h-screen items-center">
            {postLoading ? (
                <>
                </>
            ) : !postData ? (
                <>
                </>
            ) : (
                <>
                    <div className="xs:hidden flex flex-col mt-20 w-full">
                        <div className="flex flex-row gap-x-4 items-center w-full dark:bg-neutral-800 py-2 px-4">
                            {user ? (
                                <>
                                    <UserAvatar className="w-8 h-8" src={user.photoURL} username={user.username} />
                                    <form className="flex flex-row gap-x-4 w-full" onSubmit={handleSubmit}>
                                        <textarea
                                            className="w-full rounded-full h-10 dark:bg-black bg-neutral-500 outline-none border border-neutral-700 pl-5 pt-1.5"
                                            placeholder="Add a comment..."
                                            rows={4}
                                            value={inputValue}
                                            onChange={handleChange}
                                        />
                                        <button>
                                            Post
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <button className="text-center w-full" onClick={signInWithGoogle}>Login to comment</button>
                                </>
                            )}
                        </div>
                        
                        <div className="p-5">
                            {repliesLoading ? (
                                <>
                                    <p>Loading...</p>
                                </>
                            ) : !repliesData ? (
                                <>
                                    {!postData.caption && (
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
                                            origPostId={id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    
                    <div className="hidden xs:flex flex-row w-[50rem] h-[40rem] mt-10 border dark:border-neutral-700">
                        {postData.images && (
                            <div className="relative w-[60%] border-r border-neutral-700">
                                <Image className="w-full h-full" src={postData.images[0].src} alt={postData.images[0].alt} fill objectFit="contain"/>
                            </div>
                        )}

                        <div className="flex flex-col w-[40%] dark:bg-black bg-white">
                            <div className="flex flex-row gap-x-3 p-3 border-b border-neutral-800">
                                <UserTooltip postUser={postData.user} postUserId={postData.createdBy}>
                                    <UserAvatar src={postData.user.photoURL} username={postData.user.username} />
                                </UserTooltip>
                                <UserUsername userId={postData.createdBy} username={postData.user.username} verified={postData.user.verified} b badgeClassname="w-4 h-4" />

                                <PostSettings className="ml-auto" {...postData} />
                            </div>
                            <div className="p-3 w-full h-full overflow-y-auto overflow-x-hidden">
                                {postData.caption && (
                                    <div className="flex flex-col mb-5">
                                        <div className="flex flex-row gap-x-3 items-center">
                                            <UserAvatar src={postData.user.photoURL} username={postData.user.username} />
                                            <UserUsername userId={postData.createdBy} username={postData.user.username} verified={postData.user.verified} b badgeClassname="w-4 h-4" />
                                            <p className="text-[12px]">{postData.caption}</p>
                                        </div>
                                    </div>
                                )}

                                {repliesLoading ? (
                                    <>
                                        <p>Loading...</p>
                                    </>
                                ) : !repliesData ? (
                                    <>
                                        {!postData.caption && (
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
                                                origPostId={id}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="hidden xs:block w-[50rem] mt-10">
                <Footer />
            </div>
        </div>
    );

}