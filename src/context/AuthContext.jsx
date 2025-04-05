// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "../lib/Auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";

export const AuthContext = createContext();

export class AuthProviderErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error: error.message };
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h2>Error in AuthProvider</h2>
          <p>{this.state.error}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider mounted"); // Debug log
    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          console.log("Auth state changed:", currentUser); // Debug log
          setUser(currentUser);
          setLoading(false);
          if (currentUser) {
            navigate("/");
          } else {
            navigate("/login");
          }
        },
        (err) => {
          console.error("Auth state change error:", err); // Error callback
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Error setting up auth listener:", err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      console.log("Cleaning up auth subscription"); // Debug log
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>; // Fallback if error occurs
  }

  return (
    <AuthProviderErrorBoundary>
      <AuthContext.Provider value={{ user, loading }}>
        {loading ? <div>Loading...</div> : children}
      </AuthContext.Provider>
    </AuthProviderErrorBoundary>
  );
};