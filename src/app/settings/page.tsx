'use client'

import { UserAvatar } from "@/components/user/user-avatar";
import { useAuth } from "@/lib/context/auth-context";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { getImagesData, isValidUsername } from "@/lib/validation";
import Image from "next/image";
import { checkUsernameAvailability, updateUserData, uploadImages } from "@/lib/firebase/utils";
import { sleep } from "@/lib/utils";
import { motion } from "framer-motion";
import { InputField } from "@/components/input/input-field";
import cn from 'clsx'
import type { FilesWithId } from "@/lib/types/file";
import type { EditableData, EditableUserData, User } from "@/lib/types/user";
import { CustomIcon } from "@/components/ui/custom-icon";

export type InputFieldProps = {
    label: string;
    inputId: EditableData | Extract<keyof User, 'username'>;
    inputValue: string | null;
    inputLimit?: number;
    useTextArea?: boolean;
    errorMessage?: string;
};

type UserImages = Record<
  Extract<EditableData, 'photoURL'>,
  FilesWithId
>;

type TrimmedTexts = Pick<
  EditableUserData,
  Exclude<EditableData, 'photoURL'>
>;

export default function Settings() {

    const { user } = useAuth();

    const [savedProfile, setSavedProfile] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if(savedProfile)
        {
            timer = setTimeout(() => {
                setSavedProfile(false);
            }, 5000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [savedProfile]);

    const inputFileRef = useRef<HTMLInputElement>(null);

    const [userImages, setUserImages] = useState<UserImages>({
        photoURL: [],
    });

    const onClick = (): void => inputFileRef.current?.click();

    const bio = user ? user.bio : "";
    const name = user ? user.name : "";
    const website = user ? user.website : "";
    const photoURL = user ? user.photoURL : "";
    const location = user ? user.location : "";
    const username = user ? user.username : "";

    const [editUserData, setEditUserData] = useState<EditableUserData>({
        bio,
        name,
        website,
        photoURL,
        location,
        username
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => cleanImage, []);

    const cleanImage = (): void => {
        const imagesKey: Readonly<Partial<EditableData>[]> = [
          'photoURL',
        ];
    
        imagesKey.forEach((image) =>
          URL.revokeObjectURL(editUserData[image] ?? '')
        );
    
        setUserImages({
          photoURL: [],
        });
    };

    const editImage =
    ({ target: { files } }: ChangeEvent<HTMLInputElement>): void => {
        const imagesData = getImagesData(files);

        if (!imagesData) {
            return;
        }

        const { imagesPreviewData, selectedImagesData } = imagesData;

        const newImage = imagesPreviewData[0].src;

        setEditUserData({
            ...editUserData,
            ['photoURL']: newImage
        });

        setUserImages({
          ...userImages,
          ['photoURL']: selectedImagesData
        });
    };

    const [available, setAvailable] = useState(false);

    useEffect(() => {
        const checkAvailability = async (value: string): Promise<void> => {
            const empty = await checkUsernameAvailability(value);
      
            if (empty) setAvailable(true);
            else {
              setAvailable(false);
            }
        };

        const error = isValidUsername(username as string, editUserData.username);

        if (error) {
            if(error === 'This is your current username.' && editUserData.photoURL !== photoURL)
            {
                setAvailable(true);
            }
            else{
                setAvailable(false);
            }
        } else void checkAvailability(editUserData.username);
        
        if (editUserData.username   === username    &&
            editUserData.photoURL   !== photoURL    ||
            editUserData.name       !== name        ||
            editUserData.bio        !== bio         ||
            editUserData.website    !== website
        )
        {
            setAvailable(true);
        }
    }, [
        editUserData.photoURL,
        editUserData.username,
        editUserData.name,
        editUserData.bio,
        editUserData.website,
        photoURL,
        username,
        name,
        bio,
        website
    ]);

    const updateData = async (): Promise<void> => {
        
        if(!available) return;

        const userId = user?.id as string;
    
        const { photoURL } = userImages;
    
        const [newPhotoURL] = await Promise.all(
          [photoURL].map((image) => uploadImages(userId, image))
        );
    
        const newImages: Partial<Pick<User, 'photoURL'>> = {
          ...(newPhotoURL && { photoURL: newPhotoURL[0].src })
        };

        const trimmedKeys: Readonly<EditableData[]> = [
            'name',
            'bio',
            'location',
            'website'
        ];
      
        const trimmedTexts = trimmedKeys.reduce(
            (acc, curr) => ({ ...acc, [curr]: editUserData[curr]?.trim() ?? null }),
            {} as TrimmedTexts
        );

        const newUserData: Readonly<EditableUserData> = {
          ...editUserData,
          ...trimmedTexts,
          ...newImages
        };
    
        await sleep(500);
    
        await updateUserData(userId, newUserData);
    
        cleanImage();
        setEditUserData(newUserData);
        setSavedProfile(true);
    };

    const handleChange =
    (key: EditableData) =>
    ({
      target: { value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditUserData({ ...editUserData, [key]: value });

    return (
        <div className="flex flex-row w-full h-full ml-0 xs:w-[60rem] xs:h-[45rem] xs:ml-40 xs:border dark:border-neutral-700 dark:bg-black">
            <div className="hidden xs:flex flex-col w-56 border-r dark:border-neutral-700">
                <div className="h-56 border-b dark:border-neutral-700">

                </div>
            </div>
            <div className="flex flex-col py-8 xs:py-6 xs:px-11 w-full">
                <p className="text-[23px] px-10 xs:px-0">Edit Profile</p>
                <div className="flex flex-col gap-y-5 xs:items-center w-full mt-5 xs:mt-10 px-4 xs:px-0">
                    {user ? (
                        <>
                            <form>
                                <input
                                    className='hidden'
                                    type='file'
                                    accept='image/*'
                                    onChange={editImage}
                                    ref={inputFileRef}
                                />
                            </form>

                            <div className="flex flex-row gap-x-5 xs:gap-x-7 xs:w-96">
                            
                                {editUserData.photoURL ? (
                                    <Image className="rounded-full" src={editUserData.photoURL} alt={user.username} width={40} height={40} />
                                ) : (
                                    <UserAvatar className="w-10 h-10 rounded-full" src={user?.photoURL} username={user.username} />
                                )}
                                <div className="flex flex-col">
                                    <p>{user.username}</p>
                                    <button className="text-[14px] text-[#0095F6] hover:text-[#E0F1FF]" onClick={onClick}>
                                        Change profile photo
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-1 xs:flex-row xs:gap-x-7 xs:-ml-4">
                                <p className="font-bold">Username</p>
                                <InputField
                                    className="bg-inherit border border-neutral-600 px-2 py-1 xs:w-96 h-9 resize-none"
                                    inputId="username"
                                    placeholder="Username"
                                    inputValue={editUserData.username}
                                    inputLimit={20}
                                    handleChange={handleChange('username')}
                                    useTextArea
                                />
                            </div>
                            <div className="flex flex-col gap-y-1 xs:flex-row xs:gap-x-7 xs:ml-4">
                                <p className="font-bold">Name</p>
                                <InputField
                                    className="bg-inherit border border-neutral-600 px-2 py-1 xs:w-96 h-9 resize-none"
                                    inputId="name"
                                    placeholder="Name"
                                    inputValue={editUserData.name}
                                    handleChange={handleChange('name')}
                                    useTextArea
                                />
                            </div>
                            <div className="flex flex-col xs:flex-row gap-y-1 xs:gap-x-7 xs:items-center break-words mb-10">
                                <p className="font-bold">Website</p>
                                <div className="flex flex-col gap-y-2 relative">
                                    <InputField
                                        className="dark:bg-neutral-800 bg-neutral-200 rounded-sm h-8 xs:w-96 dark:placeholder-neutral-600 placeholder-neutral-400 px-2"
                                        inputId="Website"
                                        placeholder="Website"
                                        inputValue={editUserData.website}
                                        handleChange={handleChange('website')}
                                    />
                                    <p className="absolute text-[11px] xs:w-96 mt-10 text-neutral-400">Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-1 xs:flex-row xs:gap-x-7 xs:ml-7">
                                <p className="font-bold">Bio</p>
                                <InputField
                                    className="bg-inherit border border-neutral-600 p-2 xs:w-96 h-20"
                                    inputId="bio"
                                    inputValue={editUserData.bio}
                                    inputLimit={150}
                                    handleChange={handleChange('bio')}
                                    useTextArea
                                />
                            </div>
                            <div className="flex flex-col w-full gap-y-1 xs:flex-row xs:gap-x-7 xs:w-96 xs:-ml-[5.3rem]">
                                <p className="font-bold">Gender</p>
                                <div className="flex flex-col w-full">
                                    <button className="w-full xs:w-96 h-8 border border-neutral-600 hover:brightness-75 text-left pl-2 hover:cursor-not-allowed" disabled >Prefer not to say</button>
                                </div>
                            </div>

                            <div className="xs:ml-20 xs:w-96">
                                <button
                                    className={
                                        cn(
                                            "flex items-center justify-center w-20 h-8 p-3 rounded-md text-[12px] font-bold",
                                            available ? "bg-[#0095f6]" : 'bg-[#0095f6]/70'
                                        )
                                    }
                                    onClick={updateData}
                                    disabled={available ? false : true}
                                >
                                    {savedProfile ? (
                                        <CustomIcon className='loading w-full h-6' iconName='LoadingIcon' />
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Login to edit your account.</p>
                    )}
                </div>
            </div>
            <motion.div
                className="fixed bottom-0 xs:hidden flex items-center px-4 w-full h-10 dark:bg-neutral-800"
                initial={{
                    opacity: 0,
                    y: 100
                }}
                animate={{
                    opacity: savedProfile ? 1 : 0,
                    y: savedProfile ? -50 : 100
                }}
                transition={{
                    ease: "easeOut"
                }}
            >
                Profile saved.
            </motion.div>
        </div>
    );
}