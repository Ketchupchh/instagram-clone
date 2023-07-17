import Image from "next/image";

export function Placeholder() : JSX.Element
{
    return (
        <div className="flex flex-col min-h-screen w-screen bg-main-background items-center justify-center">
            <Image src="/images/ig-logo.png" alt="ig-logo" width={80} height={80} />
        </div>
    );
}