// src/Components/AuthForm.jsx
import { useState } from 'react';

const AuthForm = ({ onSubmit, buttonText, loading, error, success }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="auth-form">
      {success && (
        <div className="success-message">
          {buttonText === 'Sign Up' ? 'Registration successful! You can now sign in.' : 'Sign-in successful!'}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? `${buttonText}ing...` : buttonText}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;