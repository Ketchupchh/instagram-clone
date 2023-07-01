import { useState, useEffect } from 'react';
import { getDoc, onSnapshot } from 'firebase/firestore';
import { useCacheRef } from './useCacheRef';
import type { DocumentReference } from 'firebase/firestore';

type UseDocument<T> = {
  data: T | null;
  loading: boolean;
};

export function useDocument<T>(
  docRef: DocumentReference<T>,
  options?: { allowNull?: boolean; disabled?: boolean }
): UseDocument<T>;

export function useDocument<T>(
  docRef: DocumentReference<T>,
  options?: { allowNull?: boolean; disabled?: boolean }
): UseDocument<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const cachedDocRef = useCacheRef(docRef);

  const { allowNull, disabled } = options ?? {};

    useEffect(() => {
        if (disabled) {
            setData(null);
            setLoading(false);
            return;
        }

        setData(null);
        setLoading(true);

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            const data = snapshot.data({ serverTimestamps: 'estimate' });

            if (allowNull && !data) {
              setData(null);
              setLoading(false);
              return;
            }
          
            setData(data as T);
            setLoading(false);
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cachedDocRef]);

    return { data, loading };
}
