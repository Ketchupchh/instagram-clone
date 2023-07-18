import cn from 'clsx'
import { motion } from 'framer-motion';
import { ChangeEvent, ClipboardEvent, FormEvent, useEffect, useId, useRef, useState } from "react";
import { getImagesData } from "@/lib/validation";
import { useAuth } from "@/lib/context/auth-context";
import Image from "next/image";
import type { FilesWithId, ImageData, ImagesPreview } from "@/lib/types/file";
import { CustomIcon } from '../ui/custom-icon';
import { UserAvatar } from '../user/user-avatar';
import { UserUsername } from '../user/user-username';
import { Timestamp, WithFieldValue, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Post } from '@/lib/types/post';
import { sleep } from '@/lib/utils';
import { manageTotalPhotos, manageTotalPosts, uploadImages } from '@/lib/firebase/utils';
import { postsCollection } from '@/lib/firebase/collections';
import { InputField } from '../input/input-field';
import { PostCarousel } from '../post/post-carousel';
import { NextImage } from '../ui/next-image';
import { XMarkIcon } from '@heroicons/react/24/solid';

type CreatePostModalProps = {
    closeModal: () => void;
}

const titles = [
    {
        title: "Create new post"
    },
    {
        title: "Crop"
    },
    {
        title: "Edit"
    },
    {
        title: "Create new post"
    },
];

export function CreatePostModal({
    closeModal
} : CreatePostModalProps) : JSX.Element
{

    const { user } = useAuth();

    const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
    const [imagesPreview, setImagesPreview] = useState<ImagesPreview>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [titleIndex, setTitleIndex] = useState(0);

    function nextTitleIndex()
    {
        if(titleIndex + 1 === 4) sendPost();
        if(titleIndex + 1 >= titles.length) return;
        setTitleIndex(titleIndex + 1);
    }

    function prevTitleIndex()
    {
        if(titleIndex - 1 < 0) return;

        setTitleIndex(titleIndex - 1);

        if(titleIndex - 1 === 0)
        {
            cleanImage();
        }
    }

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const previewCount = imagesPreview.length;
    const isUploadingImages = !!previewCount;

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

        closeModal();
        
        //const { id: postId } = await getDoc(postRef);
        //console.log(`post "${postId} has been uploaded.`)
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

        if(titleIndex === 0)
            nextTitleIndex();

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

    const cleanImage = (): void => {
        imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src));

        setSelectedImages([]);
        setImagesPreview([]);
    };

    const handleChange = ({
        target: { value }
    }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => setInputValue(value);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        void sendPost();
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const onClick = (): void => inputFileRef.current?.click();

    function handleNextButtonClick()
    {
        nextTitleIndex();
    }

    function handleBackButtonClick()
    {
        prevTitleIndex();
    }

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
        <motion.div
            className='flex flex-col items-center w-[45rem] h-[45rem] bg-white dark:bg-neutral-800 rounded-xl'
            initial={{
                width: "45rem"
            }}
            animate={{
                width: titleIndex >= 2 ? "66rem" : "45rem"
            }}
            transition={{
                duration: 0.3
            }}
        >
            <div className='w-full'>
                <div className="flex flex-row w-full items-center justify-center font-bold p-2 border-b border-neutral-300 dark:border-neutral-700 z-10">
                    {titleIndex >= 1 && <button className="mr-auto text-[#0095F6]" onClick={handleBackButtonClick}><CustomIcon iconName='LeftArrowIcon' /></button>}
                    {imagesPreview.length > 0 && (
                        <button
                            className="ml-auto text-[#0095F6]"
                            onClick={handleNextButtonClick}
                        >
                            {titleIndex !== 3 ? "Next" : "Share"}
                        </button>
                    )}
                    
                    <p className={cn(imagesPreview.length > 0 && "absolute ml-auto")}>
                        {titles[titleIndex].title}
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full h-full rounded-b-xl overflow-hidden'>
                <div
                    className={
                        cn(
                            'hover-animation flex flex-col items-center w-full h-full',
                            imagesPreview.length > 0 && "bg-black/10 dark:bg-neutral-900"
                        )
                    }
                >
                    {user && (
                        <form onSubmit={handleSubmit}>
                            <input
                                className='hidden'
                                type='file'
                                accept='image/*'
                                onChange={handleImageUpload}
                                ref={inputFileRef}
                                multiple
                            />
                        </form>
                    )}
                    <div className="flex flex-col items-center justify-center w-[45rem] h-full rounded-bl-xl">
                        {selectedImages.length <= 0 && (
                            <>
                                <CustomIcon iconName='ImageAndVideoIcon' />
                                <p className="text-xl mb-5">Drag photos and videos here</p>
                                <button className="text-[13px] font-bold bg-[#0095f6] rounded-xl p-2" onClick={onClick}>Select from computer</button>
                            </>
                        )}
                        {imagesPreview.length > 0 && (
                            <div className='w-full h-full relative'> 
                                <PostCarousel
                                    images={imagesPreview}
                                />

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
                    </div>
                </div>
                <motion.div
                    className={
                        cn(
                            'h-full border-neutral-300 dark:border-neutral-700',
                            titleIndex >= 2 && "border-l"
                        )
                    }
                    initial={{
                        display: 'none',
                        width: 0,
                        opacity: 0
                    }}
                    animate={{
                        width: titleIndex >= 2 ? 500 : 0,
                        display: 'block',
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.3
                    }}
                >
                    {titleIndex === 2 && (
                        <div className='flex flex-col w-full'>
                            <div className='flex flex-row items-center justify-center text-[13px] font-bold border-b border-neutral-300 dark:border-neutral-700'>
                                <button className='w-full p-3 border-b border-black dark:border-white'>
                                    Filters
                                </button>
                                <button className='w-full p-3 hover:cursor-not-allowed text-[#00376B]/[.20] dark:text-white/[.20]' disabled>
                                    Adjustments
                                </button>
                            </div>
                        </div>
                    )}
                    {titleIndex === 3 && (
                        <div className='flex flex-col w-full'>
                            <div className='flex flex-col gap-y-6 px-5 pt-4'>
                                <div className='flex flex-row gap-x-3'>
                                    <UserAvatar src={user ? user?.photoURL : "/"} username={user ? user?.username : "Ketchup"} />
                                    <UserUsername userId={user ? user.id: ""} username={user ? user.username : ""} verified={false} b/>
                                </div>
                                
                                <InputField
                                    className='bg-inherit outline-none resize-none h-40'
                                    inputId='caption'
                                    inputValue={inputValue}
                                    inputLimit={2200}
                                    handleChange={handleChange}
                                    useTextArea
                                    hideInputLimit
                                />
                                <div className='flex flex-row items-center'>
                                    <button>
                                        <CustomIcon iconName='EmojiIcon' />
                                    </button>
                                    <p className=' ml-auto text-neutral-500 text-[12px]'>{inputValue.length} / {2200}</p>
                                </div>

                                <div className='flex flex-row items-center'>
                                    <input
                                        className='bg-inherit outline-none w-full'
                                        type='search'
                                        placeholder='Add location'
                                    />
                                    <CustomIcon iconName='ArrowDownIcon' />
                                </div>

                                <div className='flex flex-row items-center'>
                                    <button className='hover:cursor-not-allowed' disabled>
                                        Accessibility
                                    </button>
                                    <CustomIcon className='ml-auto h-6 w-6' iconName='ArrowDownIcon' />
                                </div>
                                
                                <div className='flex flex-row items-center'>
                                    <button className='hover:cursor-not-allowed' disabled>
                                        Advanced Settings
                                    </button>
                                    <CustomIcon className='ml-auto h-6 w-6' iconName='ArrowDownIcon' />
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}