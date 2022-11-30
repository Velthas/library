import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCbY03FNv8V7rQErFIkQDvNCaPOzs-gelE',
  authDomain: 'vel-library-app.firebaseapp.com',
  projectId: 'vel-library-app',
  storageBucket: 'vel-library-app.appspot.com',
  messagingSenderId: '387572426127',
  appId: '1:387572426127:web:3158c2b7c028795aeed7fa',
  measurementId: 'G-2TXBV01LL4',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app); // Setup auth services
const provider = new GoogleAuthProvider(); // Use google as provider

const signInWithGoogle = (handleSuccess, handleError) => {
  signInWithPopup(auth, provider).then((response) => {
    console.log(response);
    handleSuccess(response);
  }).catch((error) => {
    handleError('There was an issue with authentication. Please try again');
  });
};

const db = getFirestore(app);

export { signInWithGoogle, db };
