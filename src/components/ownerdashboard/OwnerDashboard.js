import React, { useState } from 'react';
import axios from 'axios';
import './OwnerDashboard.css';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const navigate = useNavigate();

  const handleMyProfileClick = () => {
    setShowProfilePanel(!showProfilePanel);

    if (!showProfilePanel) {
      axios.get(`http://localhost:8081/user/get/${user.id}`)
        .then(response => {
          setProfileData(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the profile!", error);
        });
    }
  };

  const handleAddRestaurantClick = () => {
    navigate('/addRestaurant', { state: { user: user } });
  };

  const handleViewAllRestaurantsClick = () => {
    navigate('/viewAllRestaurants');
  };

  const handleAddCategoryClick = () => {
    navigate('/addCategory');
  };

  const handleViewAllRestaurantCategoriesClick = () => {
    navigate('/viewAllRestaurantCategories');
  };

  const handleUpdateCategoryClick = () => {
    navigate('/updateCategory');
  };

  const handleAddFoodItemClick = () => {
    navigate('/addFoodItem'); // Navigate to the AddFoodItem page
  };

  return (
    <div className="owner-dashboard">
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

      <div className="grid-container">
        <button className="grid-button" onClick={handleAddRestaurantClick}>Add Restaurant</button>
        <button className="grid-button" onClick={handleAddCategoryClick}>Add Category</button>
        <button className="grid-button" onClick={handleUpdateCategoryClick}>Update Category</button>
        <button className="grid-button" onClick={handleAddFoodItemClick}>Add Food Item</button>
        <button className="grid-button" onClick={handleViewAllRestaurantsClick}>View All Restaurants</button>
        <button className="grid-button" onClick={handleViewAllRestaurantCategoriesClick}>View All Restaurant Categories</button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
