import { useEffect, useRef, useState } from "react";
import { CustomIcon } from "../ui/custom-icon";
import { motion } from 'framer-motion'
import { useAuth } from "@/lib/context/auth-context";
import { useTheme } from "@/lib/context/theme-context";
import cn from 'clsx'
import Link from "next/link";

export function MoreSettings() : JSX.Element
{

    const { signOut } = useAuth();
    const { theme, changeTheme } = useTheme();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
          ) {
            setIsOpen(false);
          }
        };
    
        document.addEventListener('mousedown', handleOutsideClick);
    
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
    
        if (!isOpen) {
            timer = setTimeout(() => {
                setShouldShow(false);
            }, 200);
        } else setShouldShow(true)
    
        return () => {
          clearTimeout(timer);
        };
    }, [isOpen]);

    function toggleTheme()
    {
        if(theme === "light") changeTheme('dark')
        else changeTheme('light');
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // Toggle the dropdown state
    };

    return (
        <div className="relative">
            <motion.div
                ref={dropdownRef}
                className={cn("absolute flex flex-col w-[15rem] xl:ml-0 xs:ml-5 bg-white dark:bg-neutral-800 shadow-lg shadow-black/30 rounded-md", !shouldShow && 'hidden')}
                initial={{
                    opacity: 0,
                    y: 0
                }}
                animate={{
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? -340 : -200,
                }}
                transition={{
                    duration: isOpen ? 0 : 0.2
                }}
            >
                {shouldShow && (
                    <>
                        <Link href="/settings" className="hover-animation flex flex-row items-center dark:hover:bg-neutral-600 px-4 py-3 rounded-t-md border-b border-neutral-300 dark:border-b-0">
                            Settings
                            <CustomIcon className="ml-auto dark:text-white text-black" iconName='Options' />
                        </Link>
                        <button className="hover-animation flex flex-row items-center dark:hover:bg-neutral-600 px-4 py-3 border-b border-neutral-300 dark:border-b-0">
                            Your activity
                            <CustomIcon className="ml-auto dark:text-white text-black" iconName='Activity' />
                        </button>
                        <button className="hover-animation flex flex-row items-center dark:hover:bg-neutral-600 px-4 py-3 border-b border-neutral-300 dark:border-b-0">
                            Saved
                            <CustomIcon className="ml-auto dark:text-white text-black" iconName='SaveIcon' />
                        </button>
                        <button className="hover-animation flex flex-row items-center dark:hover:bg-neutral-600 px-4 py-3 border-b border-neutral-300 dark:border-b-0" onClick={toggleTheme}>
                            Switch appearance
                            <CustomIcon className="ml-auto dark:text-white text-black" iconName='CrescentMoon' />
                        </button>
                        <button className="hover-animation flex flex-row items-center dark:hover:bg-neutral-600 px-4 py-3 border-b border-neutral-300 dark:border-b-0">
                            Report a problem
                            <CustomIcon className="ml-auto dark:text-white text-black" iconName='ReportIcon' />
                        </button>
                        <button className="hover-animation flex flex-row items-center dark:hover:bg-neutral-600 px-4 py-3 border-b border-neutral-300 dark:border-b-0">
                            Switch accounts
                        </button>
                        <button
                            className="hover-animation flex flex-row items-center dark:hover:bg-neutral-600 px-4 py-3 rounded-b-md"
                            onClick={signOut}
                        >
                            Log out
                        </button>
                    </>
                )}
            </motion.div>
            <button
                className="relative hover-animation xl:flex xl:-ml-3 xs:justify-center xl:justify-normal font-bold
                            dark:hover:bg-neutral-600/20 rounded-full flex flex-row items-center gap-x-2
                            xs:w-10 xs:h-10 xl:w-full xl:h-full xs:ml-6 xs:p-2 xl:p-3"
                onClick={toggleDropdown}
            >
                <CustomIcon iconName="Settings" />
                <p className="xs:hidden xl:block">More</p>
            </button>
        </div>
    );
}