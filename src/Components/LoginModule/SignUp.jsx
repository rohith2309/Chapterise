// src/LoginModule/SignUp.jsx
import { useState } from 'react';
import { registerUser, signInWithGoogle } from '../../lib/Auth';
import AuthForm from '../../Components/AuthForm';
import { Link, useNavigate } from 'react-router-dom';
import DashBoard from '../../Pages/DashBoard';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(email, password);
      setSuccess(true);
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  /*const handleGoogleSignIn = async () => {
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
  };*/

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <AuthForm
        onSubmit={handleSignUp}
        buttonText="Sign Up"
        loading={loading}
        error={error}
        success={success}
      />
      
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;