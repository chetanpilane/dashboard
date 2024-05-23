import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCeKzcoXHbWzROuLMZYLjs0WdHED011jKA",
  authDomain: "dashboard-8103c.firebaseapp.com",
  projectId: "dashboard-8103c",
  storageBucket: "dashboard-8103c.appspot.com",
  messagingSenderId: "659070841530",
  appId: "1:659070841530:web:053c47087b887acac64883"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication 
const auth = getAuth(app);

export {app,auth};
