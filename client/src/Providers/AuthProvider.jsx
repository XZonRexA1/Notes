import {
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
  } from "firebase/auth";
 import app from "../firebase/firebase.config";
  import { createContext, useEffect, useState } from "react";
  
  export const AuthContext = createContext(null);
  
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    // creating log out
    const logOut = () => {
      setLoading(true);
      return signOut(auth);
    };
  
    // observe auth state change
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
        setUser(loggedUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }, []);
  
    // sign in with google
    const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
  
   
  
    const authInfo = {
      user,
      loading,
      signInWithGoogle,
      logOut,
    };
  
    return (
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
  