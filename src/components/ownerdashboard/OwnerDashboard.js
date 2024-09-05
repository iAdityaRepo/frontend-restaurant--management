import React, { useState } from 'react';
import axios from 'axios';
import './OwnerDashboard.css';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
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

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
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

  
  const handleAddFoodItemClick = () => {
    navigate('/addFoodItem');
  };

  const handleViewFoodItemClick = () => {
    navigate('/viewFoodItem');
  };

  const handleUpdateFoodItemClick = () => {
    navigate('/updateFoodItem');
  };

  return (
    <div className="owner-dashboard">
      <div className="sidebar">
        <button className="sidebar-button" onClick={handleMyProfileClick}>My Profile</button>

        <button className="sidebar-button" onClick={() => handleMenuClick('restaurant')}>
          Restaurant
        </button>
        {activeMenu === 'restaurant' && (
          <div className="submenu">
            <button className="submenu-button" onClick={handleAddRestaurantClick}>Add Restaurant</button>
            <button className="submenu-button" onClick={handleViewAllRestaurantsClick}>View All Restaurants</button>
          </div>
        )}

        <button className="sidebar-button" onClick={() => handleMenuClick('category')}>
          Category
        </button>
        {activeMenu === 'category' && (
          <div className="submenu">
            <button className="submenu-button" onClick={handleAddCategoryClick}>Add Category</button>
            <button className="submenu-button" onClick={handleViewAllRestaurantCategoriesClick}>View All Categories</button>
          </div>
        )}

        <button className="sidebar-button" onClick={() => handleMenuClick('foodItem')}>
          Food Item
        </button>
        {activeMenu === 'foodItem' && (
          <div className="submenu">
            <button className="submenu-button" onClick={handleAddFoodItemClick}>Add Food Item</button>
            <button className="submenu-button" onClick={handleUpdateFoodItemClick}>Update Food Item</button>
            <button className="submenu-button" onClick={handleViewFoodItemClick}>View Food Items</button>
          </div>
        )}
      </div>

      {showProfilePanel && (
        <div className={`profile-panel ${showProfilePanel ? 'visible' : ''}`}>
          {profileData && (
            <div className="profile-details">
              <h2>Profile Information</h2>
              <p><strong>Name:</strong> {profileData.name}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Phone Number:</strong> {profileData.phoneNo}</p>
              <p><strong>Role:</strong> {profileData.role}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
