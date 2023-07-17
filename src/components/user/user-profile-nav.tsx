import Link from "next/link";
import { CustomIcon } from "../ui/custom-icon";
import { Modal } from "../modal/modal";
import { UserCards } from "./user-cards";
import { useModal } from "@/lib/hooks/useModal";
import { usersCollection } from "@/lib/firebase/collections";
import { useArrayDocument } from "@/lib/hooks/useArrayDocument";
import cn from 'clsx'

type UserProfileNavProps = {
    isOwner: boolean;
    username: string;
    totalPosts: number;
    followers: string[];
    following: string[];
    route: string;
} 

export function UserProfileNav({
    isOwner,
    username,
    totalPosts,
    followers,
    following,
    route
} : UserProfileNavProps) : JSX.Element
{

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
        followers,
        usersCollection,
        { disabled: !'followers' }
    );

    const { data: followingData, loading:followingLoading } = useArrayDocument(
        following,
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

            {isOwner && (
                <div
                    className="flex flex-row items-center px-5 xs:px-0"
                >
                    <div className="flex flex-col items-center font-bold text-[12px] gap-y-3 hover:cursor-not-allowed mb-4 xs:mb-10">
                        <button
                            className="flex items-center justify-center w-20 h-20 rounded-full ring-1 bg-white/[.05] ring-neutral-200 dark:ring-neutral-800 hover:cursor-not-allowed"
                            disabled
                        >
                            <CustomIcon className='dark:text-neutral-800 text-neutral-200' iconName='PlusIcon' />
                        </button>
                        New
                    </div>
                </div>
            )}

            <div className='xs:hidden flex flex-row justify-around items-center w-full py-2 border-t dark:border-neutral-800'>
                <div className='flex flex-col items-center'>
                    <p className='font-bold'>{totalPosts}</p>
                    <p className='text-[14px] dark:text-neutral-400'>{totalPosts > 1 ? "posts" : "post"}</p>
                </div>
                <button className='flex flex-col items-center' onClick={followersOpenModal}>
                    <p className='font-bold'>{followers.length}</p>
                    <p className='text-[14px] dark:text-neutral-400'>{followers.length > 1 ? "followers" : "follower"}</p>
                </button>
                <button className='flex flex-col items-center' onClick={followingOpenModal}>
                    <p className='font-bold'>{following.length}</p>
                    <p className='text-[14px] dark:text-neutral-400'>following</p>
                </button>
            </div>

            <div className="flex items-center border-b xs:border-b-0 xs:border-t dark:border-neutral-800 xs:mt-5 xs:justify-center">
                <div className="flex flex-row justify-around w-full border-t dark:border-neutral-800 xs:border-t-0 xs:w-96">
                    <Link
                        className={
                            cn(
                                "flex items-center gap-x-2 p-2 xs:flex-row xs:p-0 xs:h-12 xs:justify-center",
                                route === "posts" && "border-t-0 xs:border-t-2"
                            )
                        }
                        href={`/user/${username}`}
                    >
                        <CustomIcon className={cn('w-6 h-6 xs:w-3 xs:h-3', route === "posts" && "text-sky-500 xs:text-current")} iconName='GridIcon' />
                        <p className="hidden xs:block">Posts</p>
                    </Link>
                    <Link className="xs:hidden flex justify-center p-2" href={`/user/${username}`}><CustomIcon iconName='ReelsIcon' /></Link>
                    {isOwner && (
                        <Link
                            className={
                                cn(
                                    "flex items-center gap-x-2 p-2 xs:flex-row xs:p-0 xs:h-12 xs:justify-center",
                                    route === "saved" && "border-t-0 xs:border-t-2"
                                )
                            }
                            href={`/user/${username}/saved`}
                        >
                            <CustomIcon className={cn('w-6 h-6 xs:w-3 xs:h-3', route === "saved" && "text-sky-500 xs:text-current")} iconName='SaveIcon' />
                            <p className="hidden xs:block">Saved</p>
                        </Link>
                    )}
                    <Link className="flex items-center gap-x-2 p-2 xs:flex-row xs:p-0 xs:h-12 xs:justify-center xs:hover:cursor-not-allowed" href={`/user/${username}`}>
                        <CustomIcon className='w-6 h-6 xs:w-3 xs:h-3' iconName='UserTagIcon' />
                        <p className="hidden xs:block">Tagged</p>
                    </Link>
                </div>
            </div>
        </>
    );
}