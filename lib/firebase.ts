import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBfDA4Kcs-fKWUorXWzdaUVZfCMlMXNKGI",
  authDomain: "flowpywr.firebaseapp.com",
  databaseURL: "https://flowpywr-default-rtdb.firebaseio.com",
  projectId: "flowpywr",
  storageBucket: "flowpywr.appspot.com",
  messagingSenderId: "300963519537",
  appId: "1:300963519537:web:f613d97e07f26f34a08910",
  measurementId: "G-VFPGCEK0S8",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

