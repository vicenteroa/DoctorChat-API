export const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECTID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};
