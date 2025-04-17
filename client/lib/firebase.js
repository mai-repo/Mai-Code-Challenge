import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB3esv6DpccWnioShXErN3teAwAdPnHR3I",
    authDomain: "code-b4235.firebaseapp.com",
    projectId: "code-b4235",
    storageBucket: "code-b4235.firebasestorage.app",
    messagingSenderId: "51751304778",
    appId: "1:51751304778:web:490bcc09341f6f5f0e30b3",
    measurementId: "G-EY180RS82V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)