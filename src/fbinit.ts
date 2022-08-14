// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Firestore, getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

type ReturnParams = {
  app: FirebaseApp;
  analytics: Analytics;
  db: Firestore;
};

export function initFb(): ReturnParams {
  const firebaseConfig = {
    apiKey: 'AIzaSyCKzQXVvDJRX8iuIJ2wdRuz7dNVh1I90lg',
    authDomain: 'taecomps-86563.firebaseapp.com',
    projectId: 'taecomps-86563',
    storageBucket: 'taecomps-86563.appspot.com',
    messagingSenderId: '348550339281',
    appId: '1:348550339281:web:798867ed1a9232012883f0',
    measurementId: 'G-N3YGKGQDMN',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  return { app, analytics, db };
}
