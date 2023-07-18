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
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { CustomIcon } from '@/components/ui/custom-icon';

export default function Home() {

  const { user, signInWithGoogle } = useAuth();

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
            'flex flex-col items-center w-[29rem] xs:w-[39rem] mt-20 gap-y-0 xs:gap-y-5 xs:mt-6 xs:ml-[16rem] overflow-hidden'
          )
        }
      >
        <div
          className='flex flex-row items-center gap-x-5 px-5 w-full h-[6rem] xs:h-[7rem] xs:dark:bg-black
                    dark:bg-neutral-900 border-b dark:border-neutral-700 xs:border-none'
        >
          {followingLoading ? (
            <CustomIcon className='loading w-full h-6' iconName='LoadingIcon' />
          ) : !followingData ? (
            <>
            </>
          ) : (
            <>
              {followingData.map((following, index) => (
                <div key={index} className='flex flex-col items-center'>
                  <UserAvatar key={index} className=" w-14 h-14 rounded-full overflow-hidden" src={following.photoURL} username={following.username} />
                  <div className='flex flex-row items-center'>
                    <p className='text-[12px] text-center w-14 truncate text-ellipsis'>{following.username}</p>
                    {following.verified && <CheckBadgeIcon className='w-4 h-4 text-[#3797f0]' />}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className='flex flex-col w-full xs:w-[29rem] gap-y-0 xs:gap-y-5'>
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
              <UserAvatar className='w-14 h-14' src={user.photoURL} username={user.username} />
              <UserUsername username={user.username} userId={user.id} verified={user.verified} b size='text-[15px]' badgeClassname='w-[20px] h-[20px]'/>
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
