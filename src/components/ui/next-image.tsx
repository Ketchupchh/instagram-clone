import Image, { ImageProps } from "next/image";
import { ReactNode, useState } from "react";
import cn from 'clsx'

type NextImageProps = {
    alt: string;
    width?: string | number;
    children?: ReactNode;
    useSkeleton?: boolean;
    imgClassName?: string;
    blurClassName?: string;
} & ImageProps;

export function NextImage({
    src,
    alt,
    width,
    height,
    children,
    className,
    useSkeleton,
    imgClassName,
    blurClassName,
    ...rest
} : NextImageProps) : JSX.Element
{

    const [loading, setLoading] = useState(!!useSkeleton);

    const handleLoad = (): void => setLoading(false);

    return (
        <figure style={{ width }} className={className}>
            <Image
                className={
                    cn(
                        imgClassName,
                        loading
                            ? blurClassName
                                ?? 'animate-pulse bg-neutral-500 dark:bg-neutral-400'
                            : 'object-cover'
                    )
                }
                src={src}
                alt={alt}
                width={width}
                height={height}
                onLoadingComplete={handleLoad}
                layout="responsive"
                {...rest}
            />
            {children}
        </figure>
    );
}