import { useWindow } from "@/lib/context/window-context";
import { Post } from "@/lib/types/post";
import Image from "next/image";
import cn from 'clsx'
import { CustomIcon } from "../ui/custom-icon";
import { PostModalWrap } from "./post-modal-wrap";

type GalleryPostProps = Post;

export function GalleryPost(post: GalleryPostProps) : JSX.Element
{

    const { isMobile } = useWindow();

    return (
        <>
            {post.images && (
                <PostModalWrap {...post}>
                    <div className={cn("relative [&:hover>img]:opacity-50 group flex flex-row gap-x-6 justify-center items-center", isMobile ? "w-[8.5rem] h-[8.5rem]" : "w-[19rem] h-[19rem]")}>
                        <Image className="absolute w-full h-full z-1" src={post.images[0].src} alt={post.user.username} fill objectFit="cover" />
                        <p className="flex flex-row gap-x-2 items-center group-hover:opacity-100 opacity-0 font-bold z-10"><CustomIcon iconName='SolidHeartIcon' />{post.userLikes.length}</p>
                        <p className="flex flex-row gap-x-2 items-center group-hover:opacity-100 opacity-0 font-bold z-10"><CustomIcon iconName='MessageIcon' />{post.userComments}</p> 
                    </div>
                </PostModalWrap>
            )}
        </>
    );
}