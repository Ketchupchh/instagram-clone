import cn from 'clsx'
import { motion } from 'framer-motion';
import { ChangeEvent, ClipboardEvent, FormEvent, useId, useRef, useState } from "react";
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
    }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        void sendPost();
    };

    const inputLimit = user?.isAdmin ? 560 : 280;

    const inputLength = inputValue.length;
    //const isValidInput = !!inputValue.trim().length;
    //const isCharLimitExceeded = inputLength > inputLimit;

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
                    <div className="flex flex-col items-center justify-center w-full h-full rounded-bl-xl">
                        {selectedImages.length <= 0 && (
                            <>
                                <CustomIcon iconName='ImageAndVideoIcon' />
                                <p className="text-xl mb-5">Drag photos and videos here</p>
                                <button className="text-[13px] font-bold bg-[#0095f6] rounded-xl p-2" onClick={onClick}>Select from computer</button>
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
                            </>
                        )}
                        {imagesPreview.length > 0 && (
                            <div className='w-full h-full relative'>
                                <Image className="w-full h-full" src={imagesPreview[0].src} alt={imagesPreview[0].alt} fill objectFit='contain' />
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
                                <textarea
                                    className='bg-inherit outline-none resize-none'
                                    placeholder='Write a caption...'
                                    rows={7}
                                    value={inputValue}
                                    onChange={handleChange}
                                />
                                <div className='flex flex-row items-center'>
                                    <button>
                                        <CustomIcon iconName='EmojiIcon' />
                                    </button>
                                    <p className=' ml-auto text-neutral-500 text-[12px]'>0/2,200</p>
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