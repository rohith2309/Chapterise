// src/Pages/Login.jsx
import { Routes, Route } from 'react-router-dom';
import { SignUp, SignIn } from '../Components/LoginModule';

const Login = () => {
  return (
    <Routes>
      <Route path="signup" element={<SignUp />} />
      <Route path="" element={<SignIn />} />
    </Routes>
  );
};

export default Login;