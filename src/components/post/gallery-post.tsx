import { Post } from "@/lib/types/post";
import Image from "next/image";
import cn from 'clsx'
import { CustomIcon } from "../ui/custom-icon";
import { PostModalWrap } from "./post-modal-wrap";
import { useState } from "react";

type GalleryPostProps = Post;

export function GalleryPost(post: GalleryPostProps) : JSX.Element
{

    const [loading, setLoading] = useState(true);

    const handleLoad = (): void => setLoading(false);

    return (
        <>
            {post.images && (
                <PostModalWrap {...post}>
                    <div className="relative [&:hover>img]:opacity-50 group flex flex-row gap-x-6 justify-center items-center w-[8.5rem] h-[8.5rem] xs:w-[19rem] xs:h-[19rem]">
                        <Image
                            className={
                                cn(
                                    "absolute w-full h-full z-1",
                                    loading && "animate-pulse bg-neutral-700"
                                )
                            }
                            src={post.images[0].src}
                            alt={post.user.username}
                            fill
                            objectFit="cover"
                            onLoadingComplete={handleLoad}
                        />
                        <p className="hidden xs:flex flex-row gap-x-2 items-center group-hover:opacity-100 opacity-0 font-bold z-10"><CustomIcon iconName='SolidHeartIcon' />{post.userLikes.length}</p>
                        <p className="hidden xs:flex flex-row gap-x-2 items-center group-hover:opacity-100 opacity-0 font-bold z-10"><CustomIcon iconName='MessageIcon' />{post.userComments}</p> 
                    </div>
                </PostModalWrap>
            )}
        </>
    );
}