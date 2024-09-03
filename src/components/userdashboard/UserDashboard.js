import React, { useState } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false); // State to control the panel visibility

  const handleMyProfileClick = () => {
    // Toggle visibility of the profile panel
    setShowProfilePanel(!showProfilePanel);

    if (!showProfilePanel) {
      // Fetch profile data only when showing the panel
      axios.get(`http://localhost:8081/user/get/${user.id}`)
        .then(response => {
          setProfileData(response.data); // Set the received user data in the state
        })
        .catch(error => {
          console.error("There was an error fetching the profile!", error);
        });
    }
  };

  return (
    <div className="user-dashboard">
      <div className="navbar">
        <button className="my-profile-button" onClick={handleMyProfileClick}>
          My Profile
        </button>
      </div>

      {showProfilePanel && (
        <div className={`profile-panel ${showProfilePanel ? 'visible' : ''}`}>
          {profileData && (
            <div className="profile-details">
              <h2>Profile Information</h2>
              <p><strong>Name:</strong> {profileData.name}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Wallet Balance:</strong> {profileData.walletBalance}</p>
              <p><strong>Phone Number:</strong> {profileData.phoneNo}</p>
              <p><strong>Role:</strong> {profileData.role}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
