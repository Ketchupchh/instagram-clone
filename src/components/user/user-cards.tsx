import { User } from "@/lib/types/user";
import { UserCard } from "./user-card";

type UserCardsProps = {
    type: string;
    data: User[] | null;
    loading: boolean;
    includeName?: boolean;
    followButton?: boolean;
    followButtonClassName?: string;
    userCardButton?: boolean;
}

export function UserCards({
    type,
    data,
    loading,
    followButtonClassName,
    includeName=false,
    followButton=true,
    userCardButton=false
} : UserCardsProps) : JSX.Element
{

    return (
        <div className="w-full h-full">
            <p className="w-full text-center p-2 border-b dark:border-neutral-700">
                {type}
            </p>
            {loading ? (
                <p>Loading...</p>
            ) : !data ? (
                <>
                </>
            ) : (
                <div className="w-full h-[22.47rem] p-2 overflow-y-auto">
                    {data.map((user, index) => (
                        <UserCard
                            key={index}
                            {...user}
                            avatarSize="w-10 h-10"
                            includeName={includeName}
                            name={includeName ? user.name : ''}
                            followButton={followButton}
                            followButtonClassName={followButtonClassName}
                            userCardButton={userCardButton}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}