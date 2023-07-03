'use client'

import cn from 'clsx'
import { Footer } from "@/components/layout/footer";
import { UserAvatar } from "@/components/user/user-avatar";
import { UserUsername } from "@/components/user/user-username";
import { useUser } from "@/lib/context/user-context";
import { useWindow } from "@/lib/context/window-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomIcon } from '@/components/ui/custom-icon';
import { useCollection } from '@/lib/hooks/useCollection';
import { orderBy, query, where } from 'firebase/firestore';
import { postsCollection } from '@/lib/firebase/collections';
import { GalleryPost } from '@/components/post/gallery-post';
import { UserDetails } from '@/components/user/user-details';
import { useAuth } from '@/lib/context/auth-context';

export default function UserProfile() : JSX.Element
{

    const { isMobile } = useWindow();
    const { user } = useUser();

    const {
        user: currUser
    } = useAuth();

    const { back } = useRouter();

    const { data: postsData, loading: postsLoading } = useCollection(
        query(
          postsCollection,
          where('createdBy', '==', user ? user.id : "1"),
          orderBy('createdAt', 'desc'),
        ),
        { allowNull: true }
    );

    const isOwner = currUser?.id === user?.id;
    const isFollowing = currUser?.following.includes(user ? user.id : "1");

    return(
        <div
            className={
                cn(
                    'flex flex-col gap-y-5 items-center overflow-hidden',
                    isMobile ? "pt-24 w-full" : "ml-[20rem] w-[70rem] pt-8 px-10"
                )
            }
        >
            {user ? (
                <>
                    {user.private && !isOwner && !isFollowing ? (
                        <>
                            <UserDetails {...user} />
                            <div className='flex flex-col items-center justify-center w-full h-40 dark:bg-black bg-white border dark:border-neutral-800 text-[13px] mt-5'>
                                <p>This Account is Private</p>
                                <p>Follow to see their photos and videos.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <UserDetails {...user} />
                            
                            <div
                                className={
                                    cn(
                                        "w-full min-h-[40rem]",
                                        !isMobile && "p-10"
                                    )
                                }
                            >
                                <div
                                    className={
                                        cn(
                                            "flex flex-row items-center",
                                            isMobile && "px-5"
                                        )
                                    }
                                >
                                    {isOwner && (
                                        <div className="flex flex-col items-center font-bold text-[12px] gap-y-3">
                                            <button className="flex items-center justify-center w-20 h-20 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-800">
                                                <CustomIcon className='dark:text-neutral-800 text-neutral-200' iconName='PlusIcon' />
                                            </button>
                                            New
                                        </div>
                                    )}
                                </div>

                                <div className='xs:hidden flex flex-row justify-around items-center w-full py-2 border-t dark:border-neutral-800'>
                                    <div className='flex flex-col items-center'>
                                        <p className='font-bold'>{user.totalPosts}</p>
                                        <p className='text-[14px] dark:text-neutral-400'>{user.totalPosts > 1 ? "posts" : "post"}</p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <p className='font-bold'>{user.followers.length}</p>
                                        <p className='text-[14px] dark:text-neutral-400'>{user.followers.length > 1 ? "followers" : "follower"}</p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <p className='font-bold'>{user.following.length}</p>
                                        <p className='text-[14px] dark:text-neutral-400'>following</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center border-b xs:border-b-0 xs:border-t dark:border-neutral-800 xs:mt-5">
                                    {isMobile ? (
                                        <div className="flex flex-row justify-around w-full border-t dark:border-neutral-800">
                                            <Link className="focus:border-t-2 w-full flex justify-center p-2" href={`/user/${user.username}`}><CustomIcon iconName='GridIcon' /></Link>
                                            <Link className="focus:border-t-2 w-full flex justify-center p-2" href={`/user/${user.username}`}><CustomIcon iconName='ReelsIcon' /></Link>
                                            <Link className="focus:border-t-2 w-full flex justify-center p-2" href={`/user/${user.username}`}><CustomIcon iconName='UserTagIcon' /></Link>
                                        </div>
                                    ) : (
                                        <div className="flex flex-row justify-around w-96">
                                            <Link className="focus:border-t-2" href={`/user/${user.username}`}>Posts</Link>
                                            <Link className="focus:border-t-2" href={`/user/${user.username}`}>Saved</Link>
                                            <Link className="focus:border-t-2" href={`/user/${user.username}`}>Tagged</Link>
                                        </div>
                                    )}
                                </div>

                                <div className='grid grid-cols-3 gap-5'>
                                    {postsLoading ? (
                                        <p className='w-full text-center'>Loading...</p>
                                    ) : !postsData ? (
                                        <>
                                            <p className='w-full text-center'>User hasn't posted</p>
                                        </>
                                    ) : (
                                        <>
                                            {postsData.map((post, index) => (
                                                <GalleryPost key={index} {...post} />
                                            ))}
                                        </>
                                    )}
                                </div>

                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h1 className="px-5 font-bold text-2xl">Sorry, this page isn't available.</h1>
                    <p className='px-5'>The link you followed may be broken, or the page may have been removed. Go back to <button onClick={back}>Instagram.</button></p>
                </>
            )}
            <div className="hidden xs:block w-full">
                <Footer />
            </div>
        </div>
    );
} 