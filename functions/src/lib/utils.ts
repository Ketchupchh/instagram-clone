import * as functions from 'firebase-functions';

const regionalFunctions = functions.region('us-central1');

export { firestore } from 'firebase-admin';
export { functions, regionalFunctions };
