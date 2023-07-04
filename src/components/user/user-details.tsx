import { useWindow } from "@/lib/context/window-context";
import { User } from "@/lib/types/user";
import { UserAvatar } from "./user-avatar";
import { UserUsername } from "./user-username";
import { CustomIcon } from "../ui/custom-icon";
import { useAuth } from "@/lib/context/auth-context";
import { FollowButton } from "../ui/follow-button";
import Link from "next/link";

type UserDetailsProps = User;

export function UserDetails(userData: UserDetailsProps) : JSX.Element
{

    const { isMobile } = useWindow();

    const { user } = useAuth();

    const isOwner = user?.id === userData.id;

    return (
        <>
            {isMobile ? (
                <>
                    <div className="flex flex-row items-center mr-auto px-5 gap-x-7">
                        <div className="w-full rounded-full">
                            <UserAvatar className="w-20 h-20 rounded-full overflow-hidden" src={userData.photoURL} username={userData.username} />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <div className='flex flex-row items-center gap-x-2'>
                                <UserUsername userId={userData.id} username={userData.username} verified={userData.verified} size="text-[20px]" />
                                <CustomIcon iconName='EllipsisIcon' />
                            </div>
                            <div className='flex flex-row items-center gap-x-3'>
                                {isOwner ? (
                                    <>
                                        <Link className="flex items-center justify-center bg-white rounded-md text-[15px] h-8 w-28 text-black" href="/settings">
                                            Edit profile
                                        </Link>
                                        <button className="bg-white rounded-md text-[15px] h-8 w-28 text-black" disabled>View Archive</button>
                                    </>
                                ) : (
                                    <>
                                        {user && (
                                            <FollowButton
                                                className="flex items-center justify-center col-span-3 w-20 h-8 p-3 bg-[#0095f6] rounded-md text-[12px] font-bold"
                                                textClassName="text-white"
                                                targetUserId={userData.id}
                                                userId={user.id}
                                                userFollowing={user.following}
                                            />
                                        )}
                                        {/*<button className="bg-white rounded-md text-[15px] h-8 px-1 text-black"><CustomIcon iconName='UserPlusIcon' /></button>*/}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='w-full px-5'>
                        {userData.name && <p className='break-words font-bold'>{userData.name}</p>}
                        <p className='break-words'>{userData.bio}</p>
                    </div>
                </>
            ) : (
                <div className="w-full grid grid-cols-[auto,1fr] gap-x-24 gap-y-1 px-20">
                    <div className="w-full rounded-full">
                        <UserAvatar className="w-36 h-36 rounded-full overflow-hidden" src={userData.photoURL} username={userData.username} />
                    </div>
                    <div className="items-center grid grid-rows-3 grid-cols-4 gap-x-5 break-words text-black dark:text-white w-[40rem]">
                        <UserUsername userId={userData.id} username={userData.username} verified={userData.verified} size="text-[20px]" />
                        
                        {isOwner ? (
                            <>
                                <Link className="flex items-center justify-center bg-white rounded-md text-[15px] w-28 text-black" href="/settings">
                                    Edit profile
                                </Link>
                                <button className="bg-white rounded-md text-[15px] w-28 -ml-12 text-black hover:cursor-not-allowed" disabled>View Archive</button>
                                <Link className="-ml-20" href="/settings">
                                    <CustomIcon iconName='Options' />
                                </Link>
                            </>
                        ) : (
                            <>
                                {user ? (
                                    <FollowButton
                                        className="flex items-center justify-center ml-12 col-span-3 w-20 h-8 p-3 bg-[#0095f6] rounded-md text-[12px] font-bold"
                                        textClassName="text-white"
                                        targetUserId={userData.id}
                                        userId={user.id}
                                        userFollowing={user.following}
                                    />
                                ) : (
                                    
                                    <div className="col-span-3" />
                                )}
                            </>
                        )}
                        <p><b>{userData.totalPosts}</b> Posts</p> <p className="-ml-10"><b>{userData.followers.length}</b> Followers</p> <p className="col-span-2 -ml-14"><b>{userData.following.length}</b> Following</p>

                        {userData.bio && (
                            <p className="col-span-4 w-full">{userData.bio}</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}