import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';
import type { Theme } from './theme';

export type User = {
  id: string;
  bio: string | null;
  name: string;
  website: string | null;
  location: string | null;
  theme: Theme | null;
  username: string;
  photoURL: string;
  isAdmin: boolean;
  verified: boolean;
  following: string[];
  followers: string[];
  createdAt: Timestamp
  updatedAt: Timestamp | null;
  totalPosts: number;
  totalPhotos: number;
  pinnedPosts: string[] | null;
  private: boolean;
  blockedUsers: string[];
};

export type EditableData = Extract<
  keyof User,
  'bio' | 'name' | 'website' | 'photoURL' | 'location' | 'username'
>;

export type EditableUserData = Pick<User, EditableData>;

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user) {
    return { ...user };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return { ...data } as User;
  }
};