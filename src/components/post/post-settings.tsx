import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "../modal/modal";
import { PostSettingsModal } from "../modal/post-settings-modal";
import { CustomIcon } from "../ui/custom-icon";
import type { Post } from "@/lib/types/post";

type PostSettingsProps = Post & {
    className?: string;
}

export function PostSettings(post: PostSettingsProps) : JSX.Element
{

    const {
        open: settingsOpen,
        openModal: settingsOpenModal,
        closeModal: settingsCloseModal
    } = useModal();

    return (
        <>
            <Modal
                className="flex items-center justify-center w-screen h-screen"
                modalClassName="w-[21rem] dark:bg-neutral-800 bg-white rounded-xl"
                open={settingsOpen}
                closeModal={settingsCloseModal}
            >
                <PostSettingsModal {...post} closeModal={settingsCloseModal} />
            </Modal>
            <button className={post.className} onClick={settingsOpenModal}>
                <CustomIcon iconName='EllipsisIcon' />
            </button>    
        </>
    );
}