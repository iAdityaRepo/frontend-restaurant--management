import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { loggedInUser } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [errorRestaurants, setErrorRestaurants] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      axios.get(`http://localhost:8081/restaurant/get/${loggedInUser.id}`)
        .then(response => {
          setRestaurants(response.data);
          setLoadingRestaurants(false);
        })
        .catch(error => {
          setErrorRestaurants('Failed to fetch restaurants');
          setLoadingRestaurants(false);
        });
    }
  }, [loggedInUser]);

  const handleMyProfileClick = () => {
    setShowProfilePanel(!showProfilePanel);

    if (!showProfilePanel && loggedInUser) {
      axios.get(`http://localhost:8080/user/get/${loggedInUser.id}`)
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

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleMyOrdersClick = () => {
    navigate('/myOrder');
  };

  if (!loggedInUser) {
    return <p>Please log in to access the dashboard.</p>;
  }

  return (
    <div className="owner-dashboard">
      <div className="sidebar">
        <button className="sidebar-button" onClick={handleMyProfileClick}>My Profile</button>
        <button className="sidebar-button" onClick={handleMyOrdersClick}>My Orders</button>

        <button className="sidebar-button" onClick={() => handleMenuClick('restaurant')}>
          Restaurant
        </button>
        {activeMenu === 'restaurant' && (
          <div className="submenu">
            <button className="submenu-button" onClick={() => handleNavigation('/addRestaurant')}>Add Restaurant</button>
          </div>
        )}

        <button className="sidebar-button" onClick={() => handleMenuClick('category')}>
          Category
        </button>
        {activeMenu === 'category' && (
          <div className="submenu">
            <button className="submenu-button" onClick={() => handleNavigation('/addCategory')}>Add Category</button>
            <button className="submenu-button" onClick={() => handleNavigation('/viewAllRestaurantCategories')}>View All Categories</button>
          </div>
        )}

        <button className="sidebar-button" onClick={() => handleMenuClick('foodItem')}>
          Food Item
        </button>
        {activeMenu === 'foodItem' && (
          <div className="submenu">
            <button className="submenu-button" onClick={() => handleNavigation('/addFoodItem')}>Add Food Item</button>
            <button className="submenu-button" onClick={() => handleNavigation('/updateFoodItem')}>Update Food Item</button>
            <button className="submenu-button" onClick={() => handleNavigation('/viewFoodItem')}>View Food Items</button>
          </div>
        )}
      </div>

      <div className="content">
        <h2>Your Restaurants</h2>
        {loadingRestaurants && <p>Loading restaurants...</p>}
        {errorRestaurants && <p>Error: {errorRestaurants}</p>}
        {restaurants.length === 0 && !loadingRestaurants && !errorRestaurants && <p>No restaurants found.</p>}
        
        <div className="restaurant-grid">
          {restaurants.map(restaurant => (
            <div key={restaurant.id} className="restaurant-card">
              {restaurant.imageData ? (
                <img 
                  src={`data:image/jpeg;base64,${restaurant.imageData}`} 
                  alt={restaurant.restaurantName} 
                  className="restaurant-image" 
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <h3>{restaurant.restaurantName}</h3>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Contact:</strong> {restaurant.contactNumber}</p>
              <p><strong>Description:</strong> {restaurant.description}</p>
            </div>
          ))}
        </div>
      </div>

      {showProfilePanel && (
        <div className={`profile-panel ${showProfilePanel ? 'visible' : ''}`}>
          {profileData && (
            <div className="profile-details">
              <h2>Profile Information</h2>
              <p><strong>Name:</strong> {profileData.name}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Phone Number:</strong> {profileData.phoneNo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
