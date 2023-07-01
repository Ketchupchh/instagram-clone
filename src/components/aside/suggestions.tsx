import { useAuth } from "@/lib/context/auth-context";
import { usersCollection } from "@/lib/firebase/collections";
import { useCollection } from "@/lib/hooks/useCollection";
import { useDocument } from "@/lib/hooks/useDocument";
import { doc, documentId, limit, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import { UserCard } from "../user/user-card";
import { UserTooltip } from "../user/user-tooltip";


export function Suggestions() : JSX.Element
{

    const { randomSeed } = useAuth();

    const { data: ketchupData, loading: ketchupLoading } = useDocument(
        doc(usersCollection, 'BYmUxZqADsgz2U6hT5J2B0aeRWo1'),
        { allowNull: true }
    );

    const { data: suggestionsData, loading: suggestionsLoading } = useCollection(
        query(
          usersCollection,
          where(documentId(), '>=', randomSeed),
          orderBy(documentId()),
          limit(5)
        ),
        { allowNull: true }
    );

    return (
        <div className="flex flex-col w-full mb-3">
            <div className="flex flex-row items-center">
                <p className="font-bold text-neutral-400 text-[14px]">Suggested for you</p>
                <Link className="ml-auto text-[12px] font-bold" href={`/explore/people`}>See All</Link>
            </div>
            {suggestionsLoading || ketchupLoading ? (
                <p>Loading...</p>
            ) : suggestionsData ? (
                <>
                    {ketchupData && (
                        <UserTooltip postUserId={ketchupData.id} UserData={ketchupData}>
                            <UserCard {...ketchupData} />
                        </UserTooltip>
                    )}
                    {suggestionsData.map((user, index) => (
                        <>
                            {user.id !== "BYmUxZqADsgz2U6hT5J2B0aeRWo1" && (
                                <UserCard key={index} {...user} />
                            )}
                        </>
                    ))}
                </>
            ) : (
                <>
                    {ketchupData && (
                        <UserTooltip postUserId={ketchupData.id} UserData={ketchupData}>
                            <UserCard {...ketchupData} />
                        </UserTooltip>
                    )}
                </>
            )}
        </div>
    );
}