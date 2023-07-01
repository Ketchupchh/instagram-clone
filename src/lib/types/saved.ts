import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';

export type Saved = {
  id: string;
  createdAt: Timestamp;
};

export const savedConverter: FirestoreDataConverter<Saved> = {
  toFirestore(saved) {
    return { ...saved };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return { ...data } as Saved;
  }
};
