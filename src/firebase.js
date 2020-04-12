import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDOhPxjRar-uNPKKMJ72p1NgjdA2mLYq5w",
  authDomain: "vue-fire-96ec3.firebaseapp.com",
  databaseURL: "https://vue-fire-96ec3.firebaseio.com",
  projectId: "vue-fire-96ec3",
  storageBucket: "vue-fire-96ec3.appspot.com",
  messagingSenderId: "101448444478",
  appId: "1:101448444478:web:bb4448aa6ea1ca2648ff6f",
  measurementId: "G-V7RKQH3TVC"
};


firebase.initializeApp(firebaseConfig);

export const db       = firebase.firestore();
export const auth     = firebase.auth();
export const storage  = firebase.storage();
