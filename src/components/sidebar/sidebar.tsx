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
import { motion } from "framer-motion";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from "react";

const blacklistedRoutes = [
    "/create"
]

export function Sidebar() : JSX.Element
{
    const pathname = usePathname();
    const router = useRouter();
    const { isMobile } = useWindow();
    const { user, signInWithGoogle } = useAuth();
    const {
        open: createOpen,
        openModal: createOpenModal,
        closeModal: createCloseModal
    } = useModal();
    
    const isBlacklistedRoute = blacklistedRoutes.includes(pathname);

    useEffect(() => {
        if(!isMobile) router.replace('/');
    }, [isMobile, router]);

    const photoURL = user ? user.photoURL : "/Ketchup";
    const username = user ? user.username : "Ketchup";

    return (
        <>
            {!isBlacklistedRoute && (
                <>
                    <Modal
                        className="flex items-center justify-center w-screen h-screen"
                        modalClassName=""
                        open={createOpen}
                        closeModal={createCloseModal}
                    >
                        <CreatePostModal closeModal={createCloseModal} />   
                    </Modal>
                    <div className="fixed top-0 flex xs:hidden flex-row gap-x-5 items-center bg-white dark:bg-black w-full h-20 border-b dark:border-neutral-800 z-50 px-5">
                        <Link className="flex flex-row items-center gap-x-2" href="/">
                            <CustomIcon className="w-24 h-24" iconName='InstagramTextLogo' />
                            <CustomIcon iconName='ArrowDownIcon' />
                        </Link>

                        <search className="flex flex-row ml-auto items-center gap-x-2 bg-black/10 dark:bg-neutral-800 rounded-lg p-2">
                            <CustomIcon className="dark:text-neutral-500 w-6 h-6" iconName='MagnifyingGlass' />
                            <input
                                className="bg-transparent outline-none"
                                type="search"
                            />
                        </search>

                        <CustomIcon className="w-6 h-6" iconName='HeartIcon' />
                    </div>
                    <div className='fixed bottom-0 min-h-[50px] w-full justify-around flex-row p-1 flex border-t dark:border-neutral-800
                                    xs:border-r xs:flex-col xs:gap-y-2 xs:p-0 xl:p-6 xs:pt-10 dark:bg-black xl:w-[15.3rem]
                                    xs:left-0 xs:w-[4rem] xs:min-h-screen xs:border-t-0 z-10'
                    >
                        <Link className="hidden xs:flex xs:justify-center xl:justify-normal items-center xs:w-10 xs:h-10 xl:w-full xl:full xs:p-1 xl:p-0 rounded-full mb-8 xs:mt-5 xl:mt-4 xs:ml-3 xl:ml-0 hover-animation xs:dark:hover:bg-neutral-600/20 xl:dark:hover:bg-transparent" href={`/`}>
                            <CustomIcon className="xs:hidden xl:block dark:text-white text-black" iconName='InstagramTextLogo' />
                            <CustomIcon className="xs:block xl:hidden dark:text-white text-black" iconName='InstagramLogo' />
                        </Link>

                        <Link href="/" className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20 rounded-full ">
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="HomeIcon" />
                            </motion.div>
                            <p className="hidden xs:hidden xl:block">Home</p>
                        </Link>
                        <button className="hidden hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 xs:flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20 rounded-full text-left">
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="SearchIcon" />
                            </motion.div>
                            <p className="xs:hidden xl:block">Search</p>
                        </button>
                        <Link href="/explore" className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20 rounded-full">
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="ExploreIcon" />
                            </motion.div>
                            <p className="hidden xs:hidden xl:block">Explore</p>
                        </Link>
                        <Link href="/reels" className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20 rounded-full">
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="ReelsIcon" />
                            </motion.div>
                            <p className="hidden xs:hidden xl:block">Reels</p>
                        </Link>
                        <button className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal flex flex-row xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20 rounded-full text-left hover:cursor-not-allowed" disabled>
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName='MessagesIcon' />
                            </motion.div>
                            <p className="hidden xs:hidden xl:block">Messages</p>
                        </button>
                        <button className="hidden hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 xs:flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20 rounded-full text-left">
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="HeartIcon" />
                            </motion.div>
                            <p className="hidden xs:hidden xl:block">Notifications</p>
                        </button>
                        <button className="hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20 rounded-full text-left" onClick={createOpenModal}>
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName='CreateIcon' />
                            </motion.div>
                            <p className="hidden xs:hidden xl:block">Create</p>
                        </button>
                        {user ? (
                            <Link
                                className="hover-animation xl:flex xl:-ml-3 xs:justify-center xl:justify-normal font-bold
                                            xs:dark:hover:bg-neutral-600/20 rounded-full flex flex-row items-center gap-x-2
                                            xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3"
                                href={`/user/${user ? user.username : "/Ketchup"}`}
                            >
                                <UserAvatar className="w-6 h-6 rounded-full overflow-hidden" src={photoURL} username={username} />
                                <p className="hidden xs:hidden xl:block">Profile</p>
                            </Link>
                        ) : (
                            <button
                                className="hover-animation xl:flex xl:-ml-3 xs:justify-center xl:justify-normal font-bold
                                            xs:dark:hover:bg-neutral-600/20 rounded-full flex flex-row items-center gap-x-2
                                            xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-3 xs:p-2 xl:p-3"
                                onClick={signInWithGoogle}
                            >
                                <div className="xl:w-8 xl:h-8 xs:w-6 xs:h-6 bg-neutral-800 rounded-full" />
                                <p className="xs:hidden xl:block">Sign In</p>
                            </button>
                        )}
                        
                        {!isMobile && (
                            <div className="hidden xs:block xl:ml-0 xs:-ml-3 mt-auto w-full">
                                <MoreSettings />
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}