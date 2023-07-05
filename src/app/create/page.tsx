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
import type { FilesWithId, ImagesPreview } from "@/lib/types/file";
import type { Post } from "@/lib/types/post";

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

    const handleChange = ({
        target: { value }
    }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        void sendPost();
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const onClick = (): void => inputFileRef.current?.click();

    return (
        <div className="xs:hidden flex flex-col w-full h-full dark:bg-neutral-900">
            <div className="flex flex-row items-center justify-between w-full dark:bg-black bg-white border-b dark:border-neutral-800 p-5">
                <button onClick={prevTitleIndex}>
                    <CustomIcon iconName='LeftArrowIcon' />
                </button>
                <p>{titles[titleIndex].title}</p>
                <button onClick={nextTitleIndex}>
                    {titleIndex < 2 ? "Next" : "Share"}
                </button>
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
                <button onClick={onClick}>
                    Upload image
                </button>
            )}

            {imagesPreview.length > 0 && titleIndex < 2 && (
                <div className="w-full h-80">
                    <div className='w-full h-full relative'>
                        <Image className="w-full h-full" src={imagesPreview[0].src} alt={imagesPreview[0].alt} fill objectFit='contain' />
                    </div>
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