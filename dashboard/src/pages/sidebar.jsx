import React from 'react';
import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo-container"></div>
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <HomeIcon fontSize="large" className="nav-icon" /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/AddStudent" className="nav-link">
              <InfoIcon fontSize="large" className="nav-icon" /> Add Student
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/users" className="nav-link">
              <GroupIcon fontSize="large" className="nav-icon" /> Users
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={handleSignOut} className="nav-link sign-out-btn">
              <LogoutIcon fontSize="large" className="nav-icon" /> Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
