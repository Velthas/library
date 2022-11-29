import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = (handleSuccess, handleError) => {
  signInWithPopup(auth, provider).then((response) => {
    const name = response.user.displayName;
    const photoUrl = response.user.photoURL;
    handleSuccess({ name, photoUrl });
  }).catch((error) => {
    handleError();
  });
};

export default signInWithGoogle;
