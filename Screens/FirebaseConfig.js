// firebase.js
import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAAbr5jkGP_F7o-ziPNswIqdTIuNax0kVk",
  authDomain: "shieldx-65997.firebaseapp.com",
  projectId: "shieldx-65997",
  storageBucket: "shieldx-65997.appspot.com",
  messagingSenderId: "71781689007",
  appId: "1:71781689007:android:bddf5f04451c71e0dc165a",
};

const app = initializeApp(firebaseConfig);

//export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
