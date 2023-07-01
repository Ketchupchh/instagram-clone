import cn from 'clsx'
import { ReactNode } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { UserAvatar } from './user-avatar';
import { UserUsername } from './user-username';
import { useCollection } from '@/lib/hooks/useCollection';
import { limit, orderBy, query, where } from 'firebase/firestore';
import { postsCollection } from '@/lib/firebase/collections';
import { useWindow } from '@/lib/context/window-context';
import { FollowButton } from '../ui/follow-button';
import { useAuth } from '@/lib/context/auth-context';
import type { PostUserData } from '@/lib/types/post';
import type { User } from '@/lib/types/user';

type UserTooltipProps = {
    className?: string;
    UserData?: User;
    postUser?: PostUserData;
    postUserId: string;
    children: ReactNode;
}

export function UserTooltip({
    UserData,
    postUser,
    postUserId,
    className,
    children
} : UserTooltipProps) : JSX.Element
{

    const { isMobile } = useWindow();
    const { user } = useAuth();

    const { data: postsData, loading: postsLoading } = useCollection(
        query(
          postsCollection,
          where('createdBy', '==', postUserId),
          orderBy('createdAt', 'desc'),
          limit(3)
        ),
        { allowNull: true }
    );

    const isOwner = UserData ? user?.id === UserData.id : user?.id === postUserId;
    const isPrivate = UserData ? UserData.private : postUser ? postUser.private : false;
    const isFollowing = user?.following.includes(postUserId);

    return (
        <>
            {!isMobile ? (
                <div className="group relative">
                    {children}
                    <div
                        className={
                            cn(
                                `group invisible absolute w-96 rounded-2xl
                                opacity-0 [transition:visibility_0ms_ease_400ms,opacity_200ms_ease_200ms] group-hover:visible 
                                group-hover:opacity-100 group-hover:delay-500 bg-white dark:bg-black z-[9999] overflow-hidden
                                shadow-lg border dark:border-neutral-800 border-neutral-200`,
                                className
                            )
                        }
                    >
                        {postUser && (
                            <>
                            </>
                        )}
                        <div className='p-3'>
                            <div className='flex flex-row gap-x-3'>
                                <UserAvatar src={UserData ? UserData.photoURL : postUser ? postUser.photoURL : '/1'} username={UserData ? UserData.username : postUser ? postUser.username : ""} />
                                <div className='grid grid-rows-3 grid-cols-1'>
                                    <UserUsername userId={UserData ? UserData.id : postUser ? postUser.userId : '1'} username={UserData ? UserData.username : postUser ? postUser.username : ""} verified={UserData ? UserData.verified : postUser ? postUser.verified : false} size='text-[15px]' b />
                                    <p className='text-neutral-600 text-[12px]'>{postUser ? postUser.name : ""}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row p-3 justify-around border-t dark:border-neutral-800 border-neutral-200'>
                            <p className='flex flex-col items-center text-[14px] dark:text-neutral-600'><span className='font-bold text-[15px] text-black dark:text-white'>{UserData ? UserData.totalPosts : postUser ? postUser.totalPosts : 0}</span>Posts</p>
                            <p className='flex flex-col items-center text-[14px] dark:text-neutral-600'><span className='font-bold text-[15px] text-black dark:text-white'>{UserData ? UserData.followers.length : postUser ? postUser.followers.length : 0}</span>Followers</p>
                            <p className='flex flex-col items-center text-[14px] dark:text-neutral-600'><span className='font-bold text-[15px] text-black dark:text-white'>{UserData ? UserData.following.length : postUser ? postUser.following.length : 0}</span>Following</p>
                        </div>
                        <div className='flex flex-row w-full'>
                            {postsLoading ? (
                                <></>
                            ) : (
                                <>
                                    {postsData && (
                                        <>
                                            {postsData.map((post, index) => (
                                                <>
                                                    {isPrivate ? (
                                                        <>
                                                            {isFollowing && (
                                                                <>
                                                                    {post.images ? (
                                                                <Link className='relative w-32 h-32' href={`/p/${post.id}`}>
                                                                    <Image key={index} className='hover:brightness-75 w-full h-full' src={post.images[0].src} alt={post.user.photoURL} fill objectFit='cover' />
                                                                </Link>
                                                            ) : (
                                                                <div className='w-20 h-20 bg-neutral-500' />
                                                            )}
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {post.images ? (
                                                                <Link className='relative w-32 h-32' href={`/p/${post.id}`}>
                                                                    <Image key={index} className='hover:brightness-75 w-full h-full' src={post.images[0].src} alt={post.user.photoURL} fill objectFit='cover' />
                                                                </Link>
                                                            ) : (
                                                                <div className='w-20 h-20 bg-neutral-500' />
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <div className='flex flex-row items-center p-5 gap-x-3 w-full'>
                            {!isOwner ? (
                                <>
                                    <FollowButton
                                        className='bg-white rounded-md p-1 flex items-end justify-center w-full'
                                        textClassName='dark:text-black text-white font-bold text-[15px]'
                                        targetUserId={postUserId}
                                        userId={user ? user.id : '1'}
                                        userFollowing={user ? user.following : []}
                                    />
        
                                    {UserData ? UserData.private : postUser ? postUser.private : false ? (
                                        <>
                                            {user?.following.includes(postUserId) && (
                                                <button
                                                    className='bg-white rounded-md p-1 flex items-end justify-center w-full
                                                        dark:text-black text-white font-bold hover:cursor-not-allowed
                                                        text-[15px]'
                                                    disabled
                                                >
                                                    Message
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            className='bg-white rounded-md p-1 flex items-end justify-center w-full
                                                dark:text-black text-white font-bold hover:cursor-not-allowed
                                                text-[15px]'
                                            disabled
                                        >
                                            Message
                                        </button>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={`/user/${UserData ? UserData.username : postUser ? postUser.username : "not-found"}`}
                                    className='bg-white rounded-md p-1 flex items-end justify-center w-full
                                    dark:text-black text-white font-bold text-[15px]'
                                >
                                    Go to profile
                                </Link>
                            )}

                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {children}
                </>
            )}
        </>
    );
}