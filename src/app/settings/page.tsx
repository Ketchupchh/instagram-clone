'use client'

import { UserAvatar } from "@/components/user/user-avatar";
import { useAuth } from "@/lib/context/auth-context";
import { ChangeEvent, useRef, useState, ClipboardEvent, useEffect } from "react";
import type { FilesWithId, ImagesPreview } from "@/lib/types/file";
import { getImagesData } from "@/lib/validation";
import Image from "next/image";
import type { EditableData, EditableUserData, User } from "@/lib/types/user";
import { updateUserData, uploadImages } from "@/lib/firebase/utils";
import { sleep } from "@/lib/utils";

export type InputFieldProps = {
    label: string;
    inputId: EditableData | Extract<keyof User, 'username'>;
    inputValue: string | null;
    inputLimit?: number;
    useTextArea?: boolean;
    errorMessage?: string;
};

type RequiredInputFieldProps = Omit<InputFieldProps, 'handleChange'> & {
    inputId: EditableData;
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

    const bioSlicedInputValue = editUserData.bio?.slice(0, 150) ?? '';

    const bioInputLength = bioSlicedInputValue.length;
    const isHittingBioInputLimit = 150 && bioInputLength > 150;

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

    const updateData = async (): Promise<void> => {
    
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
    };

    const handleChange =
    (key: EditableData) =>
    ({
      target: { value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditUserData({ ...editUserData, [key]: value });

    return (
        <div className="flex flex-row w-[60rem] h-[45rem] ml-40 border dark:border-neutral-700 dark:bg-black">
            <div className="flex flex-col w-56 border-r dark:border-neutral-700">
                <div className="h-56 border-b dark:border-neutral-700">

                </div>
            </div>
            <div className="flex flex-col py-6 px-11 w-full">
                <p className="text-[23px]">Edit Profile</p>
                <div className="flex flex-col gap-y-5 items-center w-full mt-10">
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
                            <div className="flex flex-row gap-x-7 w-96">
                            
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
                            <div className="flex flex-row gap-x-7 items-center break-words mb-10">
                                <p className="font-bold">Website</p>
                                <div className="flex flex-col gap-y-2 relative">
                                    <input
                                        className="bg-neutral-800 rounded-sm h-8 w-96 placeholder-neutral-600"
                                        placeholder="  Website"
                                        type="text"
                                        onChange={handleChange("website")}
                                    />
                                    <p className="absolute text-[11px] w-96 mt-10 text-neutral-400">Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-x-7 ml-7">
                                <p className="font-bold">Bio</p>
                                <textarea
                                    className="bg-inherit border border-neutral-600 w-96 h-20"
                                    onChange={!isHittingBioInputLimit ? handleChange('bio') : undefined}
                                    value={bioSlicedInputValue}
                                />
                            </div>
                            <div className="flex flex-row gap-x-7 w-96 -ml-[5.3rem]">
                                <p className="font-bold">Gender</p>
                                <div className="flex flex-col">
                                    <button className="w-96 h-8 border border-neutral-600 hover:brightness-75 text-left pl-2 hover:cursor-not-allowed" disabled >Prefer not to say</button>
                                </div>
                            </div>

                            <div className="ml-20 w-96">
                                <button
                                    className="flex items-center justify-center w-20 h-8 p-3 bg-[#0095f6] rounded-md text-[12px] font-bold"
                                    onClick={updateData}
                                >
                                    Submit
                                </button>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}