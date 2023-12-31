'use client'

import { useUser } from "@/lib/context/user-context";
import { CustomIcon } from '@/components/ui/custom-icon';
import { useCollection } from '@/lib/hooks/useCollection';
import { orderBy, query, where } from 'firebase/firestore';
import { postsCollection } from '@/lib/firebase/collections';
import { GalleryPost } from '@/components/post/gallery-post';
import { useAuth } from '@/lib/context/auth-context';

export default function UserProfile() : JSX.Element
{
    const { user } = useUser();

    const {
        user: currUser
    } = useAuth();

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
        <>

            {user && (
                <>
                    {user.private && !isOwner && !isFollowing ? (
                        <>
                            <div className='flex flex-col items-center justify-center w-full h-40 dark:bg-black bg-white border dark:border-neutral-800 text-[13px] mt-5'>
                                <p>This Account is Private</p>
                                <p>Follow to see their photos and videos.</p>
                            </div>
                        </>
                    ) : (
                        <>

                            {postsLoading ? (
                                <CustomIcon className='loading w-full h-6 mt-10' iconName='LoadingIcon' />
                            ) : !postsData ? (
                                <p className='w-full text-center mt-10'>User hasn't posted</p>
                            ) : (
                                <div className='grid grid-cols-3 gap-5'>
                                    {postsData.map((post, index) => (
                                        <GalleryPost key={index} {...post} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
} 