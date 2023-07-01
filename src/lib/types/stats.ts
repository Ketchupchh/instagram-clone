import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';

export type Stats = {
  likes: string[];
  posts: string[];
  updatedAt: null;
};

export const statsConverter: FirestoreDataConverter<Stats> = {
  toFirestore(stat) {
    return { ...stat };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return { ...data } as Stats;
  }
};