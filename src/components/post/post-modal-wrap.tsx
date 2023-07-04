import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "../modal/modal";
import { Post } from "@/lib/types/post";
import { ReactNode } from "react";
import { PostModal } from "../modal/post-modal";
import { useWindow } from "@/lib/context/window-context";
import { useRouter } from "next/navigation";

type PostModalWrapProps = Post & {
    children: ReactNode;
}

export function PostModalWrap(post: PostModalWrapProps) : JSX.Element
{

    const { isMobile } = useWindow();
    const router = useRouter();

    const {
        open: postModalOpen,
        openModal: postOpenModal,
        closeModal: postCloseModal
    } = useModal();

    const handleClick = () => {
        if(isMobile) router.push(`/p/${post.id}`);
        else postOpenModal();
    }

    return (
        <>
            <Modal
                className="flex items-center justify-center w-screen h-screen"
                modalClassName="w-[90rem] h-[55rem] dark:bg-black bg-white"
                open={postModalOpen}
                closeModal={postCloseModal}
            >
                <PostModal {...post} closeModal={postCloseModal} />
            </Modal>
            <button onClick={handleClick}>
                {post.children}
            </button>
        </>
    );
}