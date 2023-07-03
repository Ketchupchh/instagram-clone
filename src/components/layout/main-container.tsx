type MainContainerProps = {
    children: React.ReactNode;
}

export function MainContainer({
    children
} : MainContainerProps) : JSX.Element
{
    return (
        <div className="flex flex-row min-h-screen justify-center gap-10 mb-12 xs:mb-2">
            {children}
        </div>
    );
}