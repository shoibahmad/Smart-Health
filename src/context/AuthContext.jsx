import { createContext, useState, useEffect, useContext } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

const AuthContext = createContext();

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional user data from Firestore
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        setUser({ ...firebaseUser, ...userDoc.data() });
                    } else {
                        // If no firestore doc, just use firebase user (might happen if creation fails or first google login)
                        // For Google login, we might want to create the doc here if it doesn't exist, 
                        // but usually it's better to handle that in the login function.
                        // However, onAuthStateChanged triggers on page reload too, so we need to fetch data.
                        setUser(firebaseUser);
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                // Create user document for Google Sign-In users
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: 'patient', // Default role
                    createdAt: new Date().toISOString()
                });
            }
            return user;
        } catch (error) {
            console.error("Google login failed", error);
            throw error;
        }
    };

    const handleEmailLogin = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle setting user state
            return result.user;
        } catch (error) {
            console.error("Email login failed", error);
            throw error;
        }
    };

    const handleEmailSignup = async (email, password, additionalData) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;

            // Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                ...additionalData,
                createdAt: new Date().toISOString()
            });

            return user;
        } catch (error) {
            console.error("Email signup failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            googleLogin: handleGoogleLogin,
            login: handleEmailLogin,
            signup: handleEmailSignup,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
