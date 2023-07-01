'use client'

import { useWindow } from "@/lib/context/window-context";
import { UserAvatar } from "../user/user-avatar";
import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import { MoreSettings } from "./more-settings";
import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "../modal/modal";
import { CustomIcon } from "../ui/custom-icon";
import { CreatePostModal } from "../modal/create-post-modal";

export function Sidebar() : JSX.Element
{
    const { isMobile } = useWindow();
    const { user, signInWithGoogle, signOut } = useAuth();
    const {
        open: createOpen,
        openModal: createOpenModal,
        closeModal: createCloseModal
    } = useModal();

    const photoURL = user ? user.photoURL : "/Ketchup";
    const username = user ? user.username : "Ketchup";

    return (
        <>
            <Modal
                className="flex items-center justify-center w-screen h-screen"
                modalClassName=""
                open={createOpen}
                closeModal={createCloseModal}
            >
                <CreatePostModal closeModal={createCloseModal} />   
            </Modal>
            {!isMobile && (
                <div className='fixed left-0 flex flex-col gap-y-2 xs:p-0 xl:p-6 pt-10 dark:bg-black xl:w-[15.3rem] xs:w-[4rem] min-h-screen border-r dark:border-neutral-800'>
                    <Link className="flex xs:justify-center xl:justify-normal items-center xs:w-10 xs:h-10 xl:w-full xl:full xs:p-1 xl:p-0 rounded-full mb-8 xs:mt-5 xl:mt-4 xs:ml-3 xl:ml-0 hover-animation xs:dark:hover:bg-neutral-600/20 xl:dark:hover:bg-transparent" href={`/`}>
                        <CustomIcon className="xs:hidden xl:block dark:text-white text-black" iconName='InstagramTextLogo' />
                        <CustomIcon className="xs:block xl:hidden dark:text-white text-black" iconName='InstagramLogo' />
                    </Link>

                    <Link href="/" className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold dark:hover:bg-neutral-600/20 rounded-full ">
                        <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="HomeIcon" />
                        <p className="xs:hidden xl:block">Home</p>
                    </Link>
                    <button className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold dark:hover:bg-neutral-600/20 rounded-full text-left">
                        <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="SearchIcon" />
                        <p className="xs:hidden xl:block">Search</p>
                    </button>
                    <Link href="/explore" className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold dark:hover:bg-neutral-600/20 rounded-full">
                        <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="ExploreIcon" />
                        <p className="xs:hidden xl:block">Explore</p>
                    </Link>
                    <Link href="/reels" className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold dark:hover:bg-neutral-600/20 rounded-full">
                        <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="ReelsIcon" />
                        <p className="xs:hidden xl:block">Reels</p>
                    </Link>
                    <button className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal flex flex-row xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 items-center gap-x-5 font-bold dark:hover:bg-neutral-600/20 rounded-full text-left hover:cursor-not-allowed" disabled>
                        <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName='MessagesIcon' />
                        <p className="xs:hidden xl:block">Messages</p>
                    </button>
                    <button className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold dark:hover:bg-neutral-600/20 rounded-full text-left">
                        <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="HeartIcon" />
                        <p className="xs:hidden xl:block">Notifications</p>
                    </button>
                    <button className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold dark:hover:bg-neutral-600/20 rounded-full text-left" onClick={createOpenModal}>
                        <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName='CreateIcon' />
                        <p className="xs:hidden xl:block">Create</p>
                    </button>
                    {user ? (
                        <Link
                            className="hover-animation xl:flex xl:-ml-3 xs:justify-center xl:justify-normal font-bold
                                        dark:hover:bg-neutral-600/20 rounded-full flex flex-row items-center gap-x-2
                                        xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3"
                            href={`/user/${user ? user.username : "/Ketchup"}`}
                        >
                            <UserAvatar src={photoURL} username={username} size={30} />
                            <p className="xs:hidden xl:block">Profile</p>
                        </Link>
                    ) : (
                        <button
                            className="hover-animation xl:flex xl:-ml-3 xs:justify-center xl:justify-normal font-bold
                                        dark:hover:bg-neutral-600/20 rounded-full flex flex-row items-center gap-x-2
                                        xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3"
                            onClick={signInWithGoogle}
                        >
                            <div className="xl:w-8 xl:h-8 xs:w-6 xs:h-6 bg-neutral-800 rounded-full" />
                            <p className="xs:hidden xl:block">Sign In</p>
                        </button>
                    )}

                    <button className="-ml-3 mt-auto w-full" onClick={signOut}>
                        <MoreSettings />
                    </button>
                </div>
            )}
        </>
    );
}