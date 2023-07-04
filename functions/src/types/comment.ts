import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import type { PostUserData } from "./post";

export type Comment = {
  id: string;
  comment: string;
  parent: { id: string; parentId: string; replyParent: string | null; };
  mention: string | null;
  userLikes: string[];
  userComments: number;
  user: PostUserData;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
}

export const commentConverter: FirestoreDataConverter<Comment> = {
  toFirestore(comment) {
    return { ...comment };
  },
  fromFirestore(snapshot) {
    const { id } = snapshot;
    const data = snapshot.data(); 
    return { id, ...data } as Comment;
  }
};