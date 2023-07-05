import type { User } from "@/lib/types/user";

type UserCardModalProps = {
    user: User[];
    closeModal: () => void;
}

export function UserCardModal({
    user,
    closeModal,
} : UserCardModalProps) : JSX.Element
{

    return (
        <div className="w-full h-full">
            
        </div>
    );
}