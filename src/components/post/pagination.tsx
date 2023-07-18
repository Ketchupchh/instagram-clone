import cn from 'clsx'

type PaginationProps = {
    className?: string;
    images: number;
    index: number;
    isModal?: boolean;
}

export function Pagination({
    className,
    images,
    index,
    isModal
} : PaginationProps) : JSX.Element
{

    const Slides = () => {
        if(images <= 1) return <></>;

        const components = [];

        for (let i = 0; i < images; i++) {
          components.push(
            <div 
                key={i}
                className={
                    cn(
                        "w-1.5 h-1.5 rounded-full",
                        index === i
                            ? !isModal
                                ? "bg-sky-600"
                                : "bg-white"
                            : "bg-white/10"
                    )
                }
            />
          );
        }
        return components;
    };

    return (
        <div
            className={
                cn(
                    className,
                    "flex flex-row gap-x-1 items-center",
                    !isModal
                        ? !className && "ml-20 xs:ml-24"
                        : !className && "absolute bottom-5 left-96 ml-20 z-10"
                )
            }
        >
            {Slides()}
        </div>
    );
}