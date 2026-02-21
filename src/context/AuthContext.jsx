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
                        // If no firestore doc exists yet (this happens immediately after signup 
                        // before setDoc finishes), we just set the basic firebase user for now.
                        // The signup function will update the user state with the role once setDoc finishes.

                        // Avoid overriding the full state if the user object already has a custom role 
                        // manually set by the handleEmailSignup or handleGoogleLogin
                        setUser((currentUser) => {
                            if (currentUser?.role && currentUser?.uid === firebaseUser.uid) {
                                return currentUser;
                            }
                            return firebaseUser;
                        });
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

    const handleGoogleLogin = async (role = 'patient') => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                // Create user document for Google Sign-In users
                const newUserObj = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: role,
                    createdAt: new Date().toISOString()
                };
                await setDoc(doc(db, "users", user.uid), newUserObj);
                setUser({ ...user, ...newUserObj }); // Immediately update state
            } else {
                const existingData = userDoc.data();
                // If the user selected a different role on the register page, update it
                if (existingData.role !== role && window.location.pathname === '/register') {
                    const updatedData = { ...existingData, role: role };
                    await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });
                    setUser({ ...user, ...updatedData });
                } else {
                    setUser({ ...user, ...existingData }); // Exists, update state
                }
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
            const newUserObj = {
                uid: user.uid,
                email: user.email,
                ...additionalData,
                createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, "users", user.uid), newUserObj);

            // Immediately update the user state with the new role to fix the race condition
            setUser({ ...user, ...newUserObj });

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

    const updateLocalUser = (updatedFields) => {
        setUser(prev => prev ? { ...prev, ...updatedFields } : prev);
    };

    return (
        <AuthContext.Provider value={{
            user,
            googleLogin: handleGoogleLogin,
            login: handleEmailLogin,
            signup: handleEmailSignup,
            updateLocalUser,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
