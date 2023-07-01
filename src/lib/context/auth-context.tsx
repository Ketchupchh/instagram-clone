'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { auth } from '@/lib/firebase/firebase';
import { onAuthStateChanged, signInWithPopup, signOut as signOutFirebase, GoogleAuthProvider } from 'firebase/auth';
import type { User } from '../types/user';
import type { User as AuthUser } from 'firebase/auth';
import type { ReactNode } from 'react';
import {
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    serverTimestamp,
    WithFieldValue
} from 'firebase/firestore';
import {
    userSavedCollection,
    usersCollection,
    userStatsCollection,
} from '@/lib/firebase/collections';
import { getRandomId, getRandomInt } from '@/lib/random';
import { Stats } from '@/lib/types/stats';
import type { Saved } from '../types/saved';


type AuthContextType = {
    user: User | null;
    error: Error | null;
    loading: boolean;
    randomSeed: string;
    userSaved: Saved[] | null;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
    children: ReactNode;
};

export function AuthContextProvider({
    children
}: AuthContextProviderProps): JSX.Element {

    const [user, setUser] = useState<User | null>(null);
    const [userSaved, setUserSaved] = useState<Saved[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        
        const manageUser = async (authUser: AuthUser): Promise<void> =>
        {
            const {uid, displayName, photoURL} = authUser;

            const userSnapshot = await getDoc(doc(usersCollection, uid));

            if(!userSnapshot.exists())
            {
                let available = false;
                let randomUsername = '';

                while(!available)
                {
                    const normalizeName = displayName?.replace(/\s/g, '').toLowerCase();
                    const randomInt = getRandomInt(1, 10_1000);

                    randomUsername = `${normalizeName as string}${randomInt}`;

                    const randomUserSnapshot = await getDoc(
                        doc(usersCollection, randomUsername)
                    );

                    if(!randomUserSnapshot.exists()) available = true;
                }

                const userData: WithFieldValue<User> = {
                    id: uid,
                    bio: null,
                    name: displayName as string,
                    website: null,
                    location: null,
                    theme: null,
                    photoURL: photoURL as string,
                    username: randomUsername,
                    isAdmin: false,
                    verified: false,
                    following: [],
                    followers: [],
                    createdAt: serverTimestamp(),
                    updatedAt: null,
                    totalPhotos: 0,
                    totalPosts: 0,
                    pinnedPosts: null,
                    private: false,
                    blockedUsers: []
                };

                const userStatsData: WithFieldValue<Stats> = {
                    likes: [],
                    posts: [],
                    updatedAt: null
                };

                try{
                    await Promise.all([
                        setDoc(doc(usersCollection, uid), userData),
                        setDoc(doc(userStatsCollection(uid), 'stats'), userStatsData)
                    ]);

                    const newUser = (await getDoc(doc(usersCollection, uid))).data();
                    setUser(newUser as User);
                } catch(error){
                    setError(error as Error);
                }
            }
            else
            {
                const userData = userSnapshot.data();
                setUser(userData);
            }
            setLoading(false);
        };

        const handleUserAuth = (authUser: AuthUser | null): void => {
            setLoading(true);

            if(authUser) void manageUser(authUser);
            else
            {
                setUser(null);
                setLoading(false);
            }
        };

        onAuthStateChanged(auth, handleUserAuth);
    }, []);

    useEffect(() =>
    {
        if (!user) return;

        const { id } = user;

        const unsubscribeUser = onSnapshot(doc(usersCollection, id), (doc) => {
            setUser(doc.data() as User);
        });

        const unsubscribeBookmarks = onSnapshot(
            userSavedCollection(id),
            (snapshot) => {
              const bookmarks = snapshot.docs.map((doc) => doc.data());
              setUserSaved(bookmarks);
            }
        );

        return () => {
          unsubscribeUser();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);

        } catch (error) {
            setError(error as Error);
        }
    }

    const signOut = async (): Promise<void> => {
        try {
          await signOutFirebase(auth);
        } catch (error) {
          setError(error as Error);
        }
    };

    const randomSeed = useMemo(getRandomId, [user?.id]);

    const value: AuthContextType = {
        user,
        error,
        loading,
        randomSeed,
        userSaved,
        signOut,
        signInWithGoogle
    }
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const auth = useContext(AuthContext);
    if (!auth) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return auth;
}