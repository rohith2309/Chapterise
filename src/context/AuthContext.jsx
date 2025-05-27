import { useState,useContext,createContext,useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState([]);
  useEffect(() => {
    const unsubscribe =  onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid); // Replace 'userId' with the actual user ID
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCourse(data.courses || []);
        }
      }else {
        setCourse ([]); // Reset courses when user logs out
      }
      setLoading(false);
    });



    return () => unsubscribe();
  }, []);
  
  const context_data={
    user,
    loading,
    course,
  }
  return (
    <AuthContext.Provider value={context_data}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}