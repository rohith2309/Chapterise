// src/App.jsx
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import DashBoard from './Pages/DashBoard';
import PrivateRoute from './Components/LoginModule/PrivateRoute';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import SignOut from './Components/LoginModule/SignOut';
import { useAuth } from './context/AuthContext';
import Course from './Pages/Course';


function NavBar() {
  const { user } = useAuth();
  
  const userName = user ? 'Welcome back '+user['email'].split('@')[0] : 'Hi there! Please login / SignUP !';
  return (<>
    <h1>Chapterise</h1>
    <h4>stay focused!</h4>
    <h5 className='username'>{userName}</h5>
    <nav
        
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/">Course</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div>
          {user && <SignOut />}
        </div>
      </nav>
    </>
  );
}



function App() {
  
  return (
    <AuthProvider>
    
    
    <Router>
      <NavBar />
      <div className="app-container">
        <Routes>
        
          
          <Route element={<PrivateRoute />} >
           <Route path="/" element={<Home/>} />
           <Route path="/dashboard" element={<DashBoard />} />
          </Route>
          
          <Route path="/course/:id" element={<Course/>} />
          <Route path="/login/*" element={<Login />} />
          
      
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;