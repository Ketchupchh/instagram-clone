import { collection } from 'firebase/firestore';
import { db } from './firebase'
import { userConverter } from '@/lib/types/user';
import { postConverter } from '@/lib/types/post';
import { statsConverter, type Stats } from '../types/stats';
import { commentConverter } from '../types/comment';
import type { CollectionReference } from 'firebase/firestore';
import { savedConverter, type Saved } from '../types/saved';

export const usersCollection = collection(db, 'users').withConverter(
  userConverter
);

export const postsCollection = collection(db, 'posts').withConverter(
  postConverter
);

export const commentsCollection = collection(db, 'comments').withConverter(
  commentConverter
);

export function userSavedCollection(
  id: string
): CollectionReference<Saved> {
  return collection(db, `users/${id}/saved`).withConverter(
    savedConverter
  );
}

export function userStatsCollection(id: string): CollectionReference<Stats> {
  return collection(db, `users/${id}/stats`).withConverter(statsConverter);
}
