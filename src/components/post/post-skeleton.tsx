

export function PostSkeleton() : JSX.Element
{
    return (
        <div className="flex flex-col gap-x-3 w-full border dark:border-neutral-800 rounded-xl dark:bg-black">
            <div className="flex flex-row items-center p-3 gap-x-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800" />
                <div className="flex flex-col gap-y-2">
                    <div className="w-28 h-2 bg-neutral-800" />
                    <div className="w-20 h-2 bg-neutral-800" />
                </div>
            </div>

            <div className="w-full h-96 bg-neutral-800 rounded-b-xl"/>
        </div>
    );
}