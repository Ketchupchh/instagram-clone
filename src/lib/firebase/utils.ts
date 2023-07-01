import {
  doc,
  query,
  where,
  limit,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  increment,
  writeBatch,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getCountFromServer
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import {
  usersCollection,
  postsCollection,
  userStatsCollection,
  commentsCollection,
  userSavedCollection
} from './collections';
import type { WithFieldValue, Query } from 'firebase/firestore';
import type { EditableUserData } from '@/lib/types/user';
import type { Theme } from '../types/theme';
import type { FilesWithId, ImagesPreview } from '../types/file';
import { Saved } from '../types/saved';

export async function updateUserTheme(
  userId: string,
  themeData: { theme?: Theme; }
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, { ...themeData });
}

export async function checkUsernameAvailability(
  username: string
): Promise<boolean> {
  const { empty } = await getDocs(
    query(usersCollection, where('username', '==', username), limit(1))
  );
  return empty;
}

export async function getCollectionCount<T>(
  collection: Query<T>
): Promise<number> {
  const snapshot = await getCountFromServer(collection);
  return snapshot.data().count;
}

export async function updateUserData(
  userId: string,
  userData: EditableUserData
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp()
  });
}

export async function updateUsername(
  userId: string,
  username?: string
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    ...(username && { username }),
    updatedAt: serverTimestamp()
  });
}

export async function manageFollow(
  type: 'follow' | 'unfollow',
  userId: string,
  targetUserId: string
): Promise<void> {
  const batch = writeBatch(db);

  const userDocRef = doc(usersCollection, userId);
  const targetUserDocRef = doc(usersCollection, targetUserId);

  if (type === 'follow') {
    batch.update(userDocRef, {
      following: arrayUnion(targetUserId),
      updatedAt: serverTimestamp()
    });
    batch.update(targetUserDocRef, {
      followers: arrayUnion(userId),
      updatedAt: serverTimestamp()
    });
  } else {
    batch.update(userDocRef, {
      following: arrayRemove(targetUserId),
      updatedAt: serverTimestamp()
    });
    batch.update(targetUserDocRef, {
      followers: arrayRemove(userId),
      updatedAt: serverTimestamp()
    });
  }

  await batch.commit();
}

export async function removePost(postId: string): Promise<void> {
  const userRef = doc(postsCollection, postId);
  await deleteDoc(userRef);
}

export async function removeComment(commentId: string): Promise<void> {
  const userRef = doc(commentsCollection, commentId);
  await deleteDoc(userRef);
}

export async function manageReply(
  type: 'increment' | 'decrement',
  commentId: string
): Promise<void> {
  const commentRef = doc(commentsCollection, commentId);

  try {
    await updateDoc(commentRef, {
      userComments: increment(type === 'increment' ? 1 : -1),
      updatedAt: serverTimestamp()
    });
  } catch {
    // do nothing, because parent comment was already deleted
  }
}

export async function manageComment(
  type: 'increment' | 'decrement',
  postId: string
): Promise<void> {
  const postRef = doc(postsCollection, postId);

  try {
    await updateDoc(postRef, {
      userComments: increment(type === 'increment' ? 1 : -1),
      updatedAt: serverTimestamp()
    });
  } catch {
    // do nothing, because parent post was already deleted
  }
}

export async function manageSaved(
  type: 'save' | 'unsave',
  userId: string,
  postId: string
): Promise<void> {
  const savedRef = doc(userSavedCollection(userId), postId);

  if (type === 'save') {
    const savedData: WithFieldValue<Saved> = {
      id: postId,
      createdAt: serverTimestamp()
    };
    await setDoc(savedRef, savedData);
  } else await deleteDoc(savedRef);
}

export async function uploadImages(
  userId: string,
  files: FilesWithId
): Promise<ImagesPreview | null> {
  if (!files.length) return null;

  const imagesPreview = await Promise.all(
    files.map(async (file) => {
      let src: string;

      const { id, name: alt } = file;

      const storageRef = ref(storage, `images/${userId}/${alt}`);

      try {
        src = await getDownloadURL(storageRef);
      } catch {
        await uploadBytesResumable(storageRef, file);
        src = await getDownloadURL(storageRef);
      }

      return { id, src, alt };
    })
  );

  return imagesPreview;
}

export async function manageTotalPosts(
  type: 'increment' | 'decrement',
  userId: string
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    totalPosts: increment(type === 'increment' ? 1 : -1),
    updatedAt: serverTimestamp()
  });
}

export async function manageTotalPhotos(
  type: 'increment' | 'decrement',
  userId: string
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    totalPhotos: increment(type === 'increment' ? 1 : -1),
    updatedAt: serverTimestamp()
  });
}

export function manageLike(
  type: 'like' | 'unlike',
  userId: string,
  postId: string
) {
  return async (): Promise<void> => {
    const batch = writeBatch(db);

    const userStatsRef = doc(userStatsCollection(userId), 'stats');
    const postRef = doc(postsCollection, postId);

    if (type === 'like') {
      batch.update(postRef, {
        userLikes: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
      batch.update(userStatsRef, {
        likes: arrayUnion(postId),
        updatedAt: serverTimestamp()
      });

      console.log(userStatsRef)
    } else {
      batch.update(postRef, {
        userLikes: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
      batch.update(userStatsRef, {
        likes: arrayRemove(postId),
        updatedAt: serverTimestamp()
      });
    }

    await batch.commit();
  };
}

export function manageCommentLike(
  type: 'like' | 'unlike',
  userId: string,
  commentId: string
) {
  return async (): Promise<void> => {
    const batch = writeBatch(db);

    const userStatsRef = doc(userStatsCollection(userId), 'stats');
    const commentRef = doc(commentsCollection, commentId);

    if (type === 'like') {
      batch.update(commentRef, {
        userLikes: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
      batch.update(userStatsRef, {
        likes: arrayUnion(commentId),
        updatedAt: serverTimestamp()
      });
    } else {
      batch.update(commentRef, {
        userLikes: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
      batch.update(userStatsRef, {
        likes: arrayRemove(commentId),
        updatedAt: serverTimestamp()
      });
    }

    await batch.commit();
  };
}

export async function verifyUser(userId: string): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    verified: true
  });
}

export async function unverifyUser(userId: string): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    verified: false
  });
}

export async function adminUser(userId: string): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    isAdmin: true
  });
}

export async function unadminUser(userId: string): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    isAdmin: false
  });
}