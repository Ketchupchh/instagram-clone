import { firestore, functions, regionalFunctions } from './lib/utils';
import { User } from './types';

export const updatePostUserData = regionalFunctions.firestore
    .document('/users/{userId}')
    .onUpdate(async (snapshot) : Promise<void> => {
        const userId = snapshot.after.id;
        const userData = snapshot.after.data() as User;
        const beforeUserData = snapshot.before.data() as User;

        functions.logger.info(`Update to ${userId} detected)`)

        if(
            beforeUserData.photoURL === userData.photoURL &&
            beforeUserData.username === userData.username && 
            beforeUserData.name === userData.name &&
            beforeUserData.totalPosts === userData.totalPosts &&
            beforeUserData.followers === userData.followers &&
            beforeUserData.following === userData.following &&
            beforeUserData.isAdmin === userData.isAdmin &&
            beforeUserData.verified === userData.verified &&
            beforeUserData.private === userData.private
        ) return;

        const batch = firestore().batch();
        
        const userTweetsQuery = firestore()
        .collection('posts')
        .where('createdBy', '==', userId);

        const docsSnap = await userTweetsQuery.get();

        functions.logger.info(`Updating ${docsSnap.size} post(s)`)

        docsSnap.docs.forEach(({id, ref}) => {
            functions.logger.info(`Updating ${id}`)
            batch.update(ref, {
                user: {
                    id: userId,
                    photoURL: userData.photoURL,
                    username: userData.username,
                    name: userData.name,
                    totalPosts: userData.totalPosts,
                    followers: userData.followers,
                    following: userData.following,
                    isAdmin: userData.isAdmin,
                    verified: userData.verified,
                    private: userData.private
                },
            })
        })
        
        await batch.commit();

        functions.logger.info(`Updating the userdata of ${userId} (${userData.username}) tweet's complete.`)
    })
