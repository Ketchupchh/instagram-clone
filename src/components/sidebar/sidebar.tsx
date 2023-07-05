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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import cn from 'clsx'
import { UserCard } from "../user/user-card";
import { fetchUsers } from "@/lib/firebase/utils";
import type { User } from "@/lib/types/user";

const blacklistedRoutes = [
    "/create"
]

export function Sidebar() : JSX.Element
{
    const pathname = usePathname();
    const router = useRouter();
    const { isMobile } = useWindow();
    const { user, signInWithGoogle, signOut } = useAuth();
    const {
        open: createOpen,
        openModal: createOpenModal,
        closeModal: createCloseModal
    } = useModal();

    const [searchOpen, setSearchOpen] = useState(false);

    const toggleSearch = () => setSearchOpen(!searchOpen);
    
    const isBlacklistedRoute = blacklistedRoutes.includes(pathname);

    useEffect(() => {
        if(!isMobile && isBlacklistedRoute) router.replace('/');
    }, [isMobile, router, isBlacklistedRoute]);

    const photoURL = user ? user.photoURL : "/Ketchup";
    const username = user ? user.username : "Ketchup";

    const handleCreateClick = () => {
        if(isMobile) router.push('/create');
        else createOpenModal();
    }

    const [inputValue, setInputValue] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {

        let timer: NodeJS.Timeout;
    
        if(searchLoading)
        {
            timer = setTimeout(() => {
                setSearchLoading(false);
            }, 1000);
        }
    
        return () => {
          clearTimeout(timer);
        };

    }, [searchLoading]);

    const handleChange = async ({
      target: { value }
    }: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setInputValue(value);

        if(!searchLoading)
        {
          setUsers([]);
          setUsers(await fetchUsers(inputValue));
          setSearchLoading(true);
        }
    }

    const searchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setSearchOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleOutsideClick);
    
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

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
                            <CustomIcon className="w-24 h-24 dark:text-white text-black" iconName='InstagramTextLogo' />
                            <CustomIcon iconName='ArrowDownIcon' />
                        </Link>

                        <search className="flex flex-row ml-auto items-center gap-x-2 bg-black/10 dark:bg-neutral-800 rounded-lg p-2">
                            <CustomIcon className="dark:text-neutral-500 w-6 h-6 " iconName='MagnifyingGlass' />
                            <Link href='/explore'>
                                <input
                                    className="bg-transparent outline-none"
                                    type="search"
                                    disabled
                                />
                            </Link>
                        </search>

                        <button onClick={signOut}>
                            <CustomIcon className="w-6 h-6 dark:text-white text-black" iconName='HeartIcon' />
                        </button>
                    </div>


                    <motion.div
                        ref={searchRef}
                        className="fixed w-[29rem] left-0 min-h-screen hidden xs:block z-10 dark:bg-black bg-white rounded-r-xl border-r
                                dark:border-neutral-800 pl-[4.2rem]"
                        initial={{
                            x: -220
                        }}
                        animate={{
                            x: searchOpen ? 6 : -220
                        }}
                        transition={{
                            ease: "easeIn"
                        }}
                    >
                        <motion.div
                            className="flex flex-col"
                            initial={{
                                opacity: 0
                            }}
                            animate={{
                                opacity: searchOpen ? 1 : 0
                            }}
                        >
                            <div className="flex flex-col w-full h-40 border-b dark:border-neutral-800 px-5 gap-y-8">
                                <p className="font-bold text-[23px] mt-6">Search</p>

                                <input
                                    className="outline-none dark:bg-neutral-800 bg-neutral-400 h-10 rounded-md px-3"
                                    placeholder="Search"
                                    type="search"
                                    value={inputValue}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col w-full h-full px-5">
                                {searchLoading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <>
                                        {users.map((u, index) => (
                                            <UserCard key={index} {...u} avatarSize="w-10 h-10" includeName name={u.name}/>
                                        ))}
                                    </>
                                )}
                            </div>

                        </motion.div>
                    </motion.div>

                    <div
                        className={
                            cn(
                                    `fixed bottom-0 min-h-[50px] w-full justify-around flex-row p-1 flex border-t dark:border-neutral-800
                                    dark:bg-black bg-white xs:border-r xs:flex-col xs:gap-y-2 xs:p-0 xl:p-6 xs:pt-10 xl:w-[15.3rem]
                                    xs:left-0 xs:w-[4rem] xs:min-h-screen xs:border-t-0 z-10`,
                                    searchOpen && "!w-[4.6rem] !border-0"
                            )
                        }
                    >
                        <Link className="hidden xs:flex xs:justify-center xl:justify-normal items-center xs:w-10 xs:h-10 xl:w-full xl:full xs:p-1 xl:p-0 rounded-full mb-8 xs:mt-5 xl:mt-4 xs:ml-3 xl:ml-0 hover-animation xs:dark:hover:bg-neutral-600/20 xl:dark:hover:bg-transparent" href={`/`}>
                            <CustomIcon className={cn("xs:hidden xl:block dark:text-white text-black", searchOpen && "xl:hidden")} iconName='InstagramTextLogo' />
                            <CustomIcon className={cn("xs:block xl:hidden dark:text-white text-black", searchOpen && "!block")} iconName='InstagramLogo' />
                        </Link>

                        <Link
                            href="/"
                            className={
                                cn(
                                    `hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xs:ml-3
                                    xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20 rounded-full`,
                                    searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                )
                            }
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="HomeIcon" />
                            </motion.div>
                            <p className={cn("hidden xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Home</p>
                        </Link>

                        <button
                            className={
                                cn(
                                    `hidden hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10
                                    xs:ml-3 xs:p-2 xl:p-3 xs:flex flex-row items-center gap-x-5 font-bold
                                    xs:dark:hover:bg-neutral-600/20 rounded-full text-left`,
                                    searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                )
                            }
                            onClick={toggleSearch}
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="SearchIcon" />
                            </motion.div>
                            <p className={cn("xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Search</p>
                        </button>

                        <Link
                            className={
                                cn(
                                    `hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10
                                    xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold
                                    xs:dark:hover:bg-neutral-600/20 rounded-full`,
                                    searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                )
                            }
                            href="/explore"
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="ExploreIcon" />
                            </motion.div>
                            <p className={cn("hidden xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Explore</p>
                        </Link>

                        <Link
                            className={
                                cn(
                                    `hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10
                                    xs:ml-3 xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold
                                    xs:dark:hover:bg-neutral-600/20 rounded-full`,
                                    searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                )
                            }
                            href="/reels"
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="ReelsIcon" />
                            </motion.div>
                            <p className={cn("hidden xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Reels</p>
                        </Link>

                        <button
                            className={
                                cn(
                                    `hover-animation xl:-ml-3 xs:justify-center xl:justify-normal flex flex-row xs:w-10 xs:h-10
                                    xs:ml-3 xs:p-2 xl:p-3 items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20
                                    rounded-full text-left hover:cursor-not-allowed`,
                                    searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                )
                            }
                            disabled
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName='MessagesIcon' />
                            </motion.div>
                            <p className={cn("hidden xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Messages</p>
                        </button>

                        <button
                            className={
                                cn(
                                    `hidden hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10xs:ml-3
                                    xs:p-2 xl:p-3 xs:flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20
                                    rounded-full text-left`,
                                    searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                )
                            }
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName="HeartIcon" />
                            </motion.div>
                            <p className={cn("hidden xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Notifications</p>
                        </button>

                        <button
                            className={
                                cn(
                                    `hover-animation xl:-ml-3 xs:justify-center xl:justify-normal xs:w-10 xs:h-10 xs:ml-3
                                    xs:p-2 xl:p-3 flex flex-row items-center gap-x-5 font-bold xs:dark:hover:bg-neutral-600/20
                                    rounded-full text-left`,
                                    searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                )
                            }
                            onClick={handleCreateClick}
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                <CustomIcon className="w-[23px] h-[23px] dark:text-white text-black" iconName='CreateIcon' />
                            </motion.div>
                            <p className={cn("hidden xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Create</p>
                        </button>

                        {user ? (
                            <Link
                                className={
                                    cn(
                                        `hover-animation xl:flex xl:-ml-3 xs:justify-center xl:justify-normal font-bold
                                        xs:dark:hover:bg-neutral-600/20 rounded-full flex flex-row items-center gap-x-2
                                        xs:w-10 xs:h-10 xs:ml-3 xs:p-2 xl:p-3`,
                                        searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                    )
                                }
                                href={`/user/${user ? user.username : "/Ketchup"}`}
                            >
                                <UserAvatar className="w-6 h-6 rounded-full overflow-hidden" src={photoURL} username={username} />
                                <p className={cn("hidden xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Profile</p>
                            </Link>
                        ) : (
                            <button
                                className={
                                    cn(
                                        `hover-animation xl:flex xl:-ml-3 xs:justify-center xl:justify-normal font-bold
                                         xs:dark:hover:bg-neutral-600/20 rounded-full flex flex-row items-center gap-x-2
                                         xs:w-10 xs:h-10 xs:ml-3 xs:p-2 xl:p-3`,
                                         searchOpen ? "xl:w-12 xl:h-12" : "xl:w-full xl:h-full"
                                    )
                                }
                                onClick={signInWithGoogle}
                            >
                                <div className="w-6 h-6 bg-neutral-800 rounded-full" />
                                <p className={cn("hidden xs:hidden xl:block", searchOpen && "xs:hidden xl:hidden")}>Sign In</p>
                            </button>
                        )}
                        
                        {!isMobile && (
                            <div className={cn("hidden xs:block xl:ml-0 xs:-ml-3 mt-auto w-full", searchOpen && "xl:invisible")}>
                                <MoreSettings />
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}