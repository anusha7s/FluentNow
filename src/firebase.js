import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBK0x-WOBDLHi_xk7975suAxOOCGrOceM4",
    authDomain: "fluentnow-e0193.firebaseapp.com",
    projectId: "fluentnow-e0193",
    storageBucket: "fluentnow-e0193.firebasestorage.app",
    messagingSenderId: "66741648691",
    appId: "1:66741648691:web:aa6ef609fee3ec396b9246",
    measurementId: "G-1R6FSL78CG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);