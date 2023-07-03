'use client'

import { Placeholder } from '@/components/common/placeholder';
import { UserContextProvider } from '@/lib/context/user-context';
import { usersCollection } from '@/lib/firebase/collections';
import { useCollection } from '@/lib/hooks/useCollection';
import { limit, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation'

export function UserDataLayout({ children }: { children: React.ReactNode }) : JSX.Element
{
  const { id } = useParams();

  const { data, loading } = useCollection(
    query(usersCollection, where('username', '==', id), limit(1)),
    { allowNull: true }
  );

  const user = data ? data[0] : null;

  return (
    <UserContextProvider value={{ user, loading }}>
      {loading ? (
        <Placeholder />
      ) : (
        <>
          {children}
        </>
      )}
    </UserContextProvider>
  );
}