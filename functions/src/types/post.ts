import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';

export type ImageData = {
  src: string;
  alt: string;
};

export type ImagesPreview = (ImageData & {
  id: number;
})[];

export type PostUserData = {
  userId: string;
  bio: string | null;
  name: string;
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
  private: boolean;
}
  
export type Post = {
  id: string;
  caption: string | null;
  images: ImagesPreview | null;
  userLikes: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  userComments: number;
  userShares: string[];
  user: PostUserData;
};

export const postConverter: FirestoreDataConverter<Post> = {
  toFirestore(post) {
    return { ...post };
  },
  fromFirestore(snapshot) {
    const { id } = snapshot;
    const data = snapshot.data(); 
    return { id, ...data } as Post;
  }
};
  