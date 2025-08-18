import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZJyHUDCAfwnFTSyQe7XFfX0mkUFpJ0ZE",
  authDomain: "monocool-bc625.firebaseapp.com",
  projectId: "monocool-bc625",
  storageBucket: "monocool-bc625.appspot.com",
  messagingSenderId: "665585255864",
  appId: "1:665585255864:android:bbf6c4954cad4c6141fb4d",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firestore();