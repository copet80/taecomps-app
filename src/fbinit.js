// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
