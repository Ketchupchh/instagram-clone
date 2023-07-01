'use client'

import cn from 'clsx'
import { Aside } from '@/components/aside/aside';
import { AsideFooter } from '@/components/aside/aside-footer';
import { useAuth } from '@/lib/context/auth-context';
import { UserAvatar } from '@/components/user/user-avatar';
import { Suggestions } from '@/components/aside/suggestions';
import { UserUsername } from '@/components/user/user-username';
import { orderBy, query, where } from 'firebase/firestore';
import { postsCollection, usersCollection } from '@/lib/firebase/collections';
import { Post } from '@/components/post/post';
import { PostSkeleton } from '@/components/post/post-skeleton';
import { useCollection } from '@/lib/hooks/useCollection';
import { useWindow } from '@/lib/context/window-context';

export default function Home() {

  const { user, signInWithGoogle } = useAuth();
  const { isMobile } = useWindow();

  const { data: postData, loading: postLoading } = useCollection(
    query(
      postsCollection,
      orderBy('createdAt', 'desc'),
    ),
    { allowNull: true }
  );

  const { data: followingData, loading: followingLoading} = useCollection(
    query(
      usersCollection,
      where('followers', 'array-contains', user ? user.id : '')
    )
  )

  return (
    <>
      <div
        className={
          cn(
            'flex flex-col gap-y-5 items-center w-[29rem]',
            isMobile ? "mt-14" : "ml-[16rem]"
          )
        }
      >

        <div className='flex flex-row items-center gap-x-3 px-5 mt-10 w-full h-[7rem] border rounded-lg dark:border-neutral-700 dark:bg-black'>
          {followingLoading ? (
            <>
            </>
          ) : !followingData ? (
            <>
            </>
          ) : (
            <>
              {followingData.map((follower, index) => (
                <UserAvatar key={index} src={follower.photoURL} username={follower.username} />
              ))}
            </>
          )}
        </div>

        <div className='flex flex-col w-full gap-y-5 mb-4'>
          {postLoading ? (
            <PostSkeleton />
          ) : (
            <>
              {postData && (
                <>
                  {postData.map((post, index) => (
                    <>
                      {post.user.private ? (
                        <>
                          {user?.id === post.createdBy && (
                            <Post key={index} {...post} />
                          )}
                          {user?.following.includes(post.createdBy) && <Post key={index} {...post} />}
                        </>
                      ) : (
                        <Post key={index} {...post} />
                      )}
                    </>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Aside>
        <div className='flex flex-row items-center gap-x-5 w-full mb-5'>
          {user ? (
            <>
              <UserAvatar src={user.photoURL} username={user.username} />
              <UserUsername username={user.username} userId={user.id} verified={user.verified} b size='text-[15px]'/>
              <button className='ml-auto text-[#0095f6] text-[12px]' onClick={signInWithGoogle}>
                Switch
              </button>
            </>
          ) : (
            <>
              <button className='' onClick={signInWithGoogle}>
                Sign in
              </button>
            </>
          )}
        </div>
        <Suggestions />
        <AsideFooter/>
      </Aside>
    </>
  )
}
