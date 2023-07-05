import cn from 'clsx'
import type { ChangeEvent, KeyboardEvent } from "react";

type InputFieldProps = {
    className?: string;
    inputId: string;
    inputValue: string | null;
    inputLimit?: number;
    hideInputLimit?: boolean;
    placeholder?: string;
    useTextArea?: boolean;
    handleChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handleKeyboardShortcut?: ({
        key,
        ctrlKey
    }: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function InputField({
    className,
    inputId,
    inputValue,
    inputLimit,
    hideInputLimit,
    placeholder,
    useTextArea,
    handleChange,
    handleKeyboardShortcut
} : InputFieldProps) : JSX.Element
{

    const slicedInputValue = inputValue?.slice(0, inputLimit) ?? '';

    const inputLength = slicedInputValue.length;
    const isHittingInputLimit = inputLimit && inputLength > inputLimit;

    return (
        <div className="flex flex-col gap-y-1 w-full h-full">
            {useTextArea ? (
                <textarea
                    className={cn(className, 'dark:text-white text-black')}
                    id={inputId}
                    placeholder={placeholder}
                    value={slicedInputValue}
                    onChange={!isHittingInputLimit ? handleChange : undefined}
                    onKeyUp={handleKeyboardShortcut}
                />
            ) : (
                <input
                    className={cn(className, 'dark:text-white text-black')}
                    id={inputId}
                    placeholder={placeholder}
                    type='text'
                    value={slicedInputValue}
                    onChange={!isHittingInputLimit ? handleChange : undefined}
                    onKeyUp={handleKeyboardShortcut}
                />
            )}
            {inputLimit && !hideInputLimit &&(
                <span
                    className='text-[13px] dark:text-neutral-500'
                >
                    {inputLength} / {inputLimit}
                </span>
            )}
        </div>
    );
}