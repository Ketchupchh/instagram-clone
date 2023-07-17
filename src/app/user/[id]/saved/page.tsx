'use client'

import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { CustomIcon } from '@/components/ui/custom-icon';
import { useCollection } from '@/lib/hooks/useCollection';
import { orderBy, query, where } from 'firebase/firestore';
import { postsCollection, userSavedCollection } from '@/lib/firebase/collections';
import { GalleryPost } from '@/components/post/gallery-post';
import { useAuth } from '@/lib/context/auth-context';
import { useArrayDocument } from '@/lib/hooks/useArrayDocument';
import { useEffect, useMemo } from 'react';

export default function UserProfileSaved() : JSX.Element
{
    const { user } = useUser();
    const router = useRouter();

    const {
        user: currUser
    } = useAuth();

    const { data: savedRef, loading: savedRefLoading } = useCollection(
        query(
          userSavedCollection(currUser ? currUser.id : '1'),
          orderBy('createdAt', 'desc'),
        ),
        { allowNull: true }
    );

    const postIds = useMemo(
        () => savedRef?.map(({ id }) => id) ?? [],
        [savedRef]
    );

    const { data: postData, loading: postLoading } = useArrayDocument(
        postIds,
        postsCollection,
    );

    const isOwner = currUser?.id === user?.id;

    useEffect(() => {
        if(!isOwner) router.replace(`/user/${user?.username}`)
    }, [user, isOwner, router])

    return(
        <>
            {user && (
                <>
                    {isOwner && (
                        <>
                            {(postLoading || savedRefLoading) ? (
                                <CustomIcon className='loading w-full h-6 mt-10' iconName='LoadingIcon' />
                            ) : !postData ? (
                                <p className='w-full text-center mt-10'>You have nothing saved.</p>
                            ) : (
                                <div className='grid grid-cols-3 gap-5'>
                                    {postData.map((post, index) => (
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