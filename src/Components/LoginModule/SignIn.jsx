// src/LoginModule/SignIn.jsx
import { useState } from 'react';
import { signInUser, signInWithGoogle } from '../../lib/Auth';
import AuthForm from '../../Components/AuthForm';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInUser(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Sign-in failed');
      console.error('Sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      console.error('Google sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <AuthForm
        onSubmit={handleSignIn}
        buttonText="Sign In"
        loading={loading}
        error={error}
        success={success}
      />
      <button onClick={handleGoogleSignIn} disabled={loading} style={{ marginTop: '10px', width: '100%', padding: '10px' }}>
        {loading ? 'Processing...' : 'Continue with Google'}
      </button>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don’t have an account? <Link to="/login/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;