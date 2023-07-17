import { useWindow } from "@/lib/context/window-context";
import { User } from "@/lib/types/user";
import { UserAvatar } from "./user-avatar";
import { UserUsername } from "./user-username";
import { CustomIcon } from "../ui/custom-icon";
import { useAuth } from "@/lib/context/auth-context";
import { FollowButton } from "../ui/follow-button";
import Link from "next/link";
import { Modal } from "../modal/modal";
import { UserCards } from "./user-cards";
import { useModal } from "@/lib/hooks/useModal";
import { usersCollection } from "@/lib/firebase/collections";
import { useArrayDocument } from "@/lib/hooks/useArrayDocument";

type UserDetailsProps = User;

export function UserDetails(userData: UserDetailsProps) : JSX.Element
{

    const { isMobile } = useWindow();

    const { user } = useAuth();

    const isOwner = user?.id === userData.id;

    const {
        open: followersModalOpen,
        openModal: followersOpenModal,
        closeModal: followersCloseModal
    } = useModal();

    const {
        open: followingModalOpen,
        openModal: followingOpenModal,
        closeModal: followingCloseModal
    } = useModal();

    const { data: followersData, loading:followersLoading } = useArrayDocument(
        userData.followers,
        usersCollection,
        { disabled: !'followers' }
    );

    const { data: followingData, loading:followingLoading } = useArrayDocument(
        userData.following,
        usersCollection,
        { disabled: !'following' }
    );

    return (
        <>
            <Modal
                className="flex items-center justify-center w-screen h-screen"
                modalClassName="flex flex-col w-[25rem] h-[25rem] dark:bg-neutral-800 bg-white rounded-xl overflow-hidden"
                open={followersModalOpen}
                closeModal={followersCloseModal}
            >
                <UserCards
                    type="followers"
                    data={followersData}
                    loading={followersLoading}
                    includeName
                    followButton
                    userCardButton
                />
            </Modal>

            <Modal
                className="flex items-center justify-center w-screen h-screen"
                modalClassName="flex flex-col w-[25rem] h-[25rem] dark:bg-neutral-800 bg-white rounded-xl overflow-hidden"
                open={followingModalOpen}
                closeModal={followingCloseModal}
            >
                <UserCards
                    type="following"
                    data={followingData}
                    loading={followingLoading}
                    includeName
                    followButton
                    userCardButton
                />
            </Modal>
            
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
                                        <Link
                                            className="flex items-center justify-center bg-black/5 hover:bg-black/10 dark:bg-[#363636]
                                                    dark:hover:bg-[#282828] rounded-md text-[15px] h-8 w-28 text-black dark:text-white"
                                            href="/settings"
                                        >
                                            Edit profile
                                        </Link>
                                        <button
                                            className="bg-black/5 hover:bg-black/10 dark:bg-[#363636] dark:hover:bg-[#282828] rounded-md
                                                        text-[15px] h-8 w-28 text-black dark:text-white"
                                            disabled
                                        >
                                            View Archive
                                        </button>
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
                                <Link className="flex items-center justify-center bg-black/5 hover:bg-black/10 dark:bg-[#363636] dark:hover:bg-[#282828] rounded-md text-[15px] w-28 dark:text-white text-black py-1" href="/settings">
                                    Edit profile
                                </Link>
                                <button className="bg-black/5 hover:bg-black/10 dark:bg-[#363636] dark:hover:bg-[#282828] rounded-md text-[15px] w-28 -ml-12 dark:text-white text-black py-1 hover:cursor-not-allowed" disabled>View Archive</button>
                                <Link className="-ml-20" href="/settings">
                                    <CustomIcon iconName='Options' />
                                </Link>
                            </>
                        ) : (
                            <>
                                {user ? (
                                    <FollowButton
                                        className="col-span-3"
                                        targetUserId={userData.id}
                                        userId={user.id}
                                        userFollowing={user.following}
                                        userCardButton
                                    />
                                ) : (
                                    <div className="col-span-3" />
                                )}
                            </>
                        )}
                        <p>
                            <b>{userData.totalPosts}</b> Posts
                        </p>
                        <button className="text-left" onClick={followersOpenModal}>
                            <b>{userData.followers.length}</b> Followers
                        </button>
                        <button className="text-left" onClick={followingOpenModal}>
                            <b>{userData.following.length}</b> Following
                        </button>
                        
                        {userData.name && (
                            <p className="col-span-4 w-full font-bold">{userData.name}</p>
                        )}
                        {userData.bio && (
                            <p className="col-span-4 w-full">{userData.bio}</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}