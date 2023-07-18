'use client'

import { CustomIcon } from "@/components/ui/custom-icon";
import { useAuth } from "@/lib/context/auth-context";
import { Timestamp, WithFieldValue, addDoc, serverTimestamp } from "firebase/firestore";
import { ChangeEvent, ClipboardEvent, FormEvent, useEffect, useRef, useState } from "react";
import { manageTotalPhotos, manageTotalPosts, uploadImages } from "@/lib/firebase/utils";
import { sleep } from "@/lib/utils";
import { postsCollection } from "@/lib/firebase/collections";
import { useRouter } from "next/navigation";
import { getImagesData } from "@/lib/validation";
import Image from "next/image";
import { UserAvatar } from "@/components/user/user-avatar";
import { motion } from "framer-motion";
import { NextImage } from "@/components/ui/next-image";
import { XMarkIcon } from "@heroicons/react/24/solid";
import cn from 'clsx'
import type { FilesWithId, ImageData, ImagesPreview } from "@/lib/types/file";
import type { Post } from "@/lib/types/post";
import { PostCarousel } from "@/components/post/post-carousel";

const titles = [
    {
        title: "New Photo Post"
    },
    {
        title: "New Photo Post"
    },
    {
        title: "New Post"
    },
];

export default function Create() {

    // Remind me to make a component for this input so i don't have to copy & paste lol

    const { user } = useAuth();
    const router = useRouter();

    const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
    const [imagesPreview, setImagesPreview] = useState<ImagesPreview>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [titleIndex, setTitleIndex] = useState(1);

    useEffect(() => {
        if(!user) router.replace('/');
    }, [user, router])

    function nextTitleIndex()
    {
        if(titleIndex + 1 === 3) sendPost();
        if(titleIndex + 1 >= titles.length) return;
        setTitleIndex(titleIndex + 1);
    }

    function prevTitleIndex()
    {
        if(titleIndex - 1 < 0) return;

        setTitleIndex(titleIndex - 1);

        if(titleIndex - 1 === 0)
        {
            router.push('/');
        }
    }

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const previewCount = imagesPreview.length;

    const sendPost = async (): Promise<void> => {
        inputRef.current?.blur();

        setLoading(true);

        const userId = user?.id as string;
        const PhotoURL = user?.photoURL as string;
        const username = user?.username as string;
        const name = user?.name as string;
        const verified = user?.verified as boolean;
        const isAdmin = user?.isAdmin as boolean;
        const bio = user?.bio as string;
        const following = user?.following as string[];
        const followers = user?.followers as string[];
        const createdAt = user?.createdAt as Timestamp;
        const updatedAt = user?.updatedAt as Timestamp;
        const totalPosts = user?.totalPosts as number;
        const totalPhotos = user?.totalPhotos as number;
        const isPrivate = user?.private as boolean;

        const postData: WithFieldValue<Omit<Post, 'id'>> = {
            caption: inputValue.trim() || null,
            userLikes: [],
            createdBy: userId,
            user: {
                userId: userId,
                bio: bio,
                name: name,
                username: username,
                photoURL: PhotoURL,
                isAdmin: isAdmin,
                verified: verified,
                following: following,
                followers: followers,
                createdAt: createdAt,
                updatedAt: updatedAt,
                totalPosts: totalPosts,
                totalPhotos: totalPhotos,
                private: isPrivate,
            },
            createdAt: serverTimestamp(),
            updatedAt: null,
            images: await uploadImages(userId, selectedImages),
            userComments: 0,
            userShares: []
        };

        await sleep(500);

        const [postRef] = await Promise.all([
            addDoc(postsCollection, postData),
            manageTotalPosts('increment', userId),
            postData.images && manageTotalPhotos('increment', userId),
        ]);

        router.replace(`/p/${postRef.id}`);
    }

    const handleImageUpload = (
        e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
    ): void => {
        const isClipboardEvent = 'clipboardData' in e;

        if (isClipboardEvent) {
          const isPastingText = e.clipboardData.getData('text');
          if (isPastingText) return;
        }

        const files = isClipboardEvent ? e.clipboardData.files : e.target.files;

        const imagesData = getImagesData(files, previewCount);

        if(!imagesData) return;

        const { imagesPreviewData, selectedImagesData } = imagesData;

        setImagesPreview([...imagesPreview, ...imagesPreviewData]);
        setSelectedImages([...selectedImages, ...selectedImagesData]);

        inputRef.current?.focus();
    };

    const removeImage = (targetId: string) => (): void => {
        setSelectedImages(selectedImages.filter(({ id }) => id !== targetId));
        setImagesPreview(imagesPreview.filter(({ id }) => id !== targetId));

        const { src } = imagesPreview.find(
          ({ id }) => id === targetId
        ) as ImageData;

        URL.revokeObjectURL(src);
    };

    const handleChange = ({
        target: { value }
    }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        void sendPost();
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const onClick = (): void => inputFileRef.current?.click();

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

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // Toggle the dropdown state
    };

    return (
        <div className="xs:hidden flex flex-col w-full h-full dark:bg-neutral-900">
            <div className="flex flex-row items-center justify-between w-full dark:bg-black bg-white border-b dark:border-neutral-800 p-5">
                <button onClick={prevTitleIndex}>
                    <CustomIcon iconName='LeftArrowIcon' />
                </button>
                <p>{titles[titleIndex].title}</p>

                {imagesPreview.length >= 1 ? (
                    <button className="text-[#0095F6]" onClick={nextTitleIndex}>
                        {titleIndex < 2 ? "Next" : "Share"}
                    </button>
                ) : (
                    <div />
                )}
            </div>

            <form className="hidden" onSubmit={handleSubmit}>
                <input
                    className='hidden'
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    ref={inputFileRef}
                    multiple
                />
            </form>
            
            {imagesPreview.length === 0 && (
                <div className="flex justify-center mt-5">
                    <button className="text-[13px] font-bold bg-[#0095f6] rounded-xl p-2" onClick={onClick}>
                        Upload image
                    </button>
                </div>
            )}

            {imagesPreview.length > 0 && titleIndex < 2 && (
                <div className="w-full h-80">
                    <div className='w-full h-full relative'>
                        <PostCarousel images={imagesPreview} />
                    </div>

                    <motion.div
                        ref={dropdownRef}
                        className={
                            cn(
                                `absolute bottom-0 right-5 z-10 h-24 p-3 bg-neutral-700/80 rounded-lg
                                flex flex-row gap-x-3 items-start justify-center`,
                                !shouldShow && 'hidden'
                            )
                        }
                        initial={{
                            opacity: 0,
                            y: 0
                        }}
                        animate={{
                            opacity: isOpen ? 1 : 0,
                            y: isOpen ? -90 : -10,
                        }}
                        transition={{
                            duration: isOpen ? 0 : 0.2
                        }}
                    >
                        {imagesPreview.map(({id, src, alt}) => (
                            <div key={id} className='w-20 h-full relative'>
                                <NextImage
                                    key={id}
                                    className="relative h-full w-full"
                                    useSkeleton
                                    src={src}
                                    alt={alt}
                                    layout='fill'
                                />

                                <button
                                    className='absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full'
                                    onClick={removeImage(id)}
                                >
                                    <XMarkIcon />
                                </button>
                            </div>
                        ))}

                        <button
                            className='flex justify-center items-center w-12 h-12 ring-1 ring-neutral-500 rounded-full'
                            onClick={onClick}
                        >
                            <CustomIcon iconName='PlusIcon' />
                        </button>
                    </motion.div>

                    <button
                        className='absolute bottom-5 right-4 z-10 group flex items-center justify-center w-10 h-10 bg-neutral-700 rounded-full
                                    shadow-md shadow-black/40'
                        onClick={toggleDropdown}
                    >
                        <CustomIcon className='w-4 h-4 group-hover:brightness-75' iconName='GalleryStack' />
                    </button>
                </div>
            )}

            {imagesPreview.length > 0 && titleIndex === 2 && (
                <div className="flex flex-col gap-y-3 w-full">
                    <div className="flex flex-row justify-between gap-x-3 w-full border-b dark:border-neutral-800 dark:bg-black bg-white p-3">
                        <UserAvatar className="w-8 h-8" src={user ? user.photoURL : ''} username={user ? user.username : "avatar"}/>

                        <textarea
                            className="w-[80%] outline-none bg-inherit resize-none"
                            rows={2}
                            value={inputValue}
                            onChange={handleChange}
                        />

                        <div className='w-14 h-14 relative'>
                            <Image className="w-full h-full" src={imagesPreview[0].src} alt={imagesPreview[0].alt} fill objectFit='cover' />
                        </div>
                    </div>

                    <button className="dark:bg-black bg-white text-left border-b border-t dark:border-neutral-800 p-3 cursor-not-allowed" disabled>
                        Add location
                    </button>

                    <button className="dark:bg-black bg-white text-left border-b border-t dark:border-neutral-800 p-3 cursor-not-allowed" disabled>
                        Tag People
                    </button>

                    <p className="px-3 text-[11px] dark:text-neutral-600">Advanced settings</p>
                </div>
            )}
        </div>
    );

}