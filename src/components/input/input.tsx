import { ChangeEvent, ClipboardEvent, FormEvent, useId, useRef, useState } from "react";
import { getImagesData } from "@/lib/validation";
import { useAuth } from "@/lib/context/auth-context";
import Image from "next/image";
import type { FilesWithId, ImageData, ImagesPreview } from "@/lib/types/file";


export function Input() : JSX.Element
{
  const { user } = useAuth();

  const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
  const [imagesPreview, setImagesPreview] = useState<ImagesPreview>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const previewCount = imagesPreview.length;
  const isUploadingImages = !!previewCount;

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    const isClipboardEvent = 'clipboardData' in e;

    if (isClipboardEvent) {
      const isPastingText = e.clipboardData.getData('text');
      if (isPastingText) return;
    }

    const files = isClipboardEvent ? e.clipboardData.files : e.target.files;

    const imagesData = getImagesData(files, previewCount);

    if(!imagesData) return;

    const { imagesPreviewData, selectedImagesData } = imagesData;

    setImagesPreview([...imagesPreview, ...imagesPreviewData]);
    setSelectedImages([...selectedImages, ...selectedImagesData]);

    inputRef.current?.focus();
  };

  const removeImage = (targetId: string) => (): void => {
    setSelectedImages(selectedImages.filter(({ id }) => id !== targetId));
    setImagesPreview(imagesPreview.filter(({ id }) => id !== targetId));

    const { src } = imagesPreview.find(
      ({ id }) => id === targetId
    ) as ImageData;

    URL.revokeObjectURL(src);
  };

  const cleanImage = (): void => {
    imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src));

    setSelectedImages([]);
    setImagesPreview([]);
  };

  const discardTweet = (): void => {
    setInputValue('');
    cleanImage();

    inputRef.current?.blur();
  };

  const handleChange = ({
    target: { value }
  }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    //void sendTweet();
  };

  const formId = useId();

  const inputLimit = user?.isAdmin ? 560 : 280;

  const inputLength = inputValue.length;
  const isValidInput = !!inputValue.trim().length;
  const isCharLimitExceeded = inputLength > inputLimit;

  const isValidTweet =
  !isCharLimitExceeded && (isValidInput || isUploadingImages);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const onClick = (): void => inputFileRef.current?.click();

  return (
    <>
      {user && (
        <form onSubmit={handleSubmit}>
          <input
            className='hidden'
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            ref={inputFileRef}
            multiple
          />

          <button onClick={onClick}>
            add photo
          </button>

          {imagesPreview.length > 0 && (
            <Image src={imagesPreview[0].src} alt="s" width={500} height={100} />
          )}
        </form>
      )}
    </>
  );
}