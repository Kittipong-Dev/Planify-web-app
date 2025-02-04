import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Optional if using React Router for navigation
import '/styles/sidebar.css';

const Sidebar = ({ user }) => {
  
  return (
    <div id="sidebar">

      {/* Sidebar Content */}
      <div className="sidebar-content">
        {/* User Profile */}
        <div id="userbox">
          <img
            src={user.avatarUrl}
            alt="Profile Picture"
            id="profile-pic"
          />
          <span id="username">{user.username}</span>
        </div>
        <div className='logo' id='logo'>
          <img alt=''></img>
        </div>  
      </div>
    </div>
  );
};

export default Sidebar;
