import { initializeApp, getApps } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

// Helper to log errors to screen if console is hidden
const logErrorToScreen = (msg: string) => {
    console.error(msg);
    // Don't overwrite body immediately, wait to see if app mounts, 
    // but store it to show if needed.
    (window as any).__FIREBASE_INIT_ERROR__ = msg;
};

// 1. Validate Config
const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("Attempting Firebase Config:", config);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
    // Check if critical keys interfere
    if (!config.apiKey) {
        throw new Error("Firebase API Key is missing. Check .env file.");
    }

    // 2. Initialize or Get Existing
    if (!getApps().length) {
        app = initializeApp(config);
    } else {
        app = getApps()[0];
    }

    // 3. Initialize Services
    auth = getAuth(app);
    db = getFirestore(app);

} catch (error: any) {
    logErrorToScreen("Firebase Init Error: " + error.message);
    // Re-throw so main app knows, or handle gracefully?
    // Let's create dummy objects to prevent 'undefined' crash on import
    // This allows the UI to render and show the error properly
    const dummy: any = {};
    app = dummy;
    auth = dummy;
    db = dummy;
    throw error; // Actually, better to throw so ErrorBoundary catches it? 
    // No, imports run before ErrorBoundary. 
    // We will verify this approach.
}

export { app, auth, db };
export default app;
