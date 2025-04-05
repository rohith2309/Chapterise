// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import DashBoard from './Pages/DashBoard';
import Player from './Pages/Player';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/player" element={<Player />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;