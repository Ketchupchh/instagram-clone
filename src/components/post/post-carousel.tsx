import { NextImage } from "../ui/next-image";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Dispatch, SetStateAction, useState } from "react";
import cn from 'clsx'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import type { ImagesPreview } from "@/lib/types/file";

import 'swiper/css';
import { Pagination } from "./pagination";
import { manageLike } from "@/lib/firebase/utils";
import { useAuth } from "@/lib/context/auth-context";

type PostCarouselProps = {
    postId?: string;
    images: ImagesPreview;
    pagination?: boolean;
    pagClassName?: string;
    setIndex?: Dispatch<SetStateAction<number>>;
}

export function PostCarousel({
    postId,
    images,
    pagination,
    pagClassName,
    setIndex
} : PostCarouselProps) : JSX.Element
{
    const { user } = useAuth();
    const [currIndex, setCurrIndex] = useState(0);

    const SwiperButtonNext = () => {
        const swiper = useSwiper();
        return (
            <>
                {images.length > 1 && (
                    <button
                        className={
                            cn(
                                `hidden absolute right-4 top-96 xs:flex items-center justify-center mt-10 w-6 h-6 rounded-full bg-white/50 z-10
                                [box-shadow:#65778633_0px_0px_15px,_#65778626_0px_0px_3px_2px]`,
                                currIndex === images.length - 1 && 'hidden'
                            )
                        }
                        onClick={() => swiper.slideNext()}
                    >
                        <ChevronRightIcon className="w-4 h-4 text-black/30" />
                    </button>
                )}
            </>
        );
    };

    const SwiperButtonPrev = () => {
        const swiper = useSwiper();
        return (
            <>
                {images.length > 1 && (
                    <button
                        className={
                            cn(
                                `hidden absolute left-4 top-96 xs:flex items-center justify-center mt-10 w-6 h-6 rounded-full bg-white/50 z-10
                                [box-shadow:#65778633_0px_0px_15px,_#65778626_0px_0px_3px_2px]`,
                                currIndex === 0 && 'hidden'
                            )
                        }
                        onClick={() => swiper.slidePrev()}
                    >
                        <ChevronLeftIcon className="w-4 h-4 text-black/30" />
                    </button>
                )}
            </>
        );
    };

    return (
        <Swiper
            className="w-full h-full relative"
            slidesPerView={1}
            onSlideChange={
                (swiper) => {
                    if(setIndex)
                        setIndex(swiper.activeIndex);
                    
                    setCurrIndex(swiper.activeIndex);
                }
            }
        >
            <SwiperButtonPrev />

            {images.map(({id, src, alt}) => (
                <SwiperSlide key={id} className="w-full h-full">
                    <NextImage
                        key={id}
                        className="relative h-full w-full"
                        useSkeleton
                        src={src}
                        alt={alt}
                        layout="fill"
                        onDoubleClick={manageLike(
                            "like",
                            user ? user.id : "1",
                            postId ? postId : '1'
                        )}
                    />
                </SwiperSlide>
            ))}

            <SwiperButtonNext />
            
            {pagination && <Pagination className={pagClassName} images={images.length} index={currIndex} isModal />}
        </Swiper>
    );
}