import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext'; // Import useUser hook
import './UserDashboard.css';

const UserDashboard = () => {
  const { loggedInUser } = useUser(); // Access logged-in user from context
  const [profileData, setProfileData] = useState(null);
  const [ordersData, setOrdersData] = useState(null); // State to hold orders data
  const [restaurantsData, setRestaurantsData] = useState([]); // State to hold restaurant data
  const [showProfilePanel, setShowProfilePanel] = useState(false); // State to control the panel visibility
  const [showOrdersPanel, setShowOrdersPanel] = useState(false); // State to control the orders panel visibility
  const [loading, setLoading] = useState(false); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Timer state
  const [cancelTimers, setCancelTimers] = useState({});

  // Fetch profile data
  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/user/get/${loggedInUser.id}`);
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders data
  const fetchOrdersData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8082/order/user/${loggedInUser.id}`);
      setOrdersData(response.data);
      initializeCancelTimers(response.data);
    } catch (error) {
      console.error("Error fetching orders data:", error);
      setError('Failed to load orders data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all restaurant data
  const fetchRestaurantsData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/restaurant/getAll');
      setRestaurantsData(response.data); // Save restaurant data
    } catch (error) {
      console.error('Error fetching restaurants data:', error);
      setError('Failed to load restaurants data.');
    }
  };

  // Initialize timers for each order
  const initializeCancelTimers = (orders) => {
    const timers = {};
    orders.forEach(order => {
      const createdAt = new Date(order.createdAt);
      const currentTime = new Date();
      const timeDiff = (currentTime - createdAt) / 1000;
      if (order.orderStatus === 'PENDING' && timeDiff <= 30) {
        const remainingTime = 30 - Math.floor(timeDiff);
        timers[order.id] = remainingTime;
      }
    });
    setCancelTimers(timers);
  };

  // Handle profile button click
  const handleProfileButtonClick = () => {
    setShowProfilePanel(prev => !prev);
    setShowOrdersPanel(false);
    if (!showProfilePanel && loggedInUser) {
      fetchProfileData();
    }
  };

  // Handle orders button click
  const handleOrdersButtonClick = () => {
    setShowOrdersPanel(prev => !prev);
    setShowProfilePanel(false);
    if (!showOrdersPanel && loggedInUser) {
      fetchOrdersData();
      fetchRestaurantsData(); // Fetch restaurants when showing orders
    }
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      const requestPayload = { orderStatus: 'CANCELLED' };
      await axios.put(`http://localhost:8082/order/updateStatus/${orderId}`, requestPayload);
      fetchOrdersData(); // Refresh orders data after canceling
    } catch (error) {
      console.error('Error canceling order:', error);
      setError('Failed to cancel the order.');
    }
  };

  // Get restaurant name by ID
  const getRestaurantNameById = (restaurantId) => {
    const restaurant = restaurantsData.find(resto => resto.id === restaurantId);
    return restaurant ? restaurant.restaurantName : 'Unknown';
  };

  // Get restaurant address by ID
  const getRestaurantAddressById = (restaurantId) => {
    const restaurant = restaurantsData.find(resto => resto.id === restaurantId);
    return restaurant ? restaurant.address : 'Unknown';
  };

  // Update cancel timers every second
  useEffect(() => {
    const intervals = Object.keys(cancelTimers).map(orderId => {
      return setInterval(() => {
        setCancelTimers(prevTimers => {
          const updatedTimers = { ...prevTimers };
          updatedTimers[orderId] -= 1;
          if (updatedTimers[orderId] <= 0) {
            clearInterval(intervals[orderId]);
            delete updatedTimers[orderId];
          }
          return updatedTimers;
        });
      }, 1000);
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [cancelTimers]);

  if (!loggedInUser) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="user-dashboard">
      <div className="sidebar">
        <button className="sidebar-button" onClick={handleProfileButtonClick}>
          My Profile
        </button>
        <button className="sidebar-button" onClick={handleOrdersButtonClick}>
          My Orders
        </button>
      </div>
      <div className="content">
        {showProfilePanel && (
          <div className={`profile-panel ${showProfilePanel ? 'visible' : ''}`}>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {profileData && !loading && !error && (
              <div className="profile-details">
                <h2>Profile Information</h2>
                <p><strong>Name:</strong> {profileData.name}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Wallet Balance:</strong> {profileData.walletBalance}</p>
                <p><strong>Phone Number:</strong> {profileData.phoneNo}</p>
              </div>
            )}
          </div>
        )}
        {showOrdersPanel && (
          <div className={`orders-panel ${showOrdersPanel ? 'visible' : ''}`}>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <h2>Your Orders</h2>
            {ordersData && !loading && !error && (
              <div className="orders-grid">
                {ordersData.map(order => {
                  const totalAmount = order.orderDetails.reduce(
                    (sum, item) => sum + item.quantity * item.price, 
                    0
                  );
                  const createdAt = new Date(order.createdAt);
                  const currentTime = new Date();
                  const timeDiff = (currentTime - createdAt) / 1000;
                  const isCancelable = (order.orderStatus === 'PENDING' && timeDiff <= 30);

                  return (
                    <div className="order-card" key={order.id}>
                      <h3>Order ID: {order.id}</h3>
                      <p><strong>Restaurant:</strong> {getRestaurantNameById(order.restaurantId)}</p>
                      <p><strong>Address:</strong> {getRestaurantAddressById(order.restaurantId)}</p>
                      <p><strong>Created At:</strong> {createdAt.toLocaleString()}</p>
                      <div className="order-details">
                        {order.orderDetails.length > 0 ? (
                          <ul>
                            {order.orderDetails.map(item => (
                              <li key={item.foodItemId}>
                                {item.foodItemName}: {item.quantity} (Price: Rs.{item.price})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No items</p>
                        )}
                      </div>
                      <p className="total-amount"><strong>Total Amount:</strong> Rs.{totalAmount.toFixed(2)}</p>
                      <p className={`order-status ${order.orderStatus === 'CANCELLED' ? 'cancelled-status' : ''}`}>
                        <strong>Status:</strong> {order.orderStatus}
                      </p>
                      <div className="order-actions">
                        {isCancelable && (
                          <div className="cancel-container">
                            <button 
                              className="cancel-button" 
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel
                            </button>
                            {cancelTimers[order.id] !== undefined && cancelTimers[order.id] > 0 && (
                              <span className="timer"> ({cancelTimers[order.id]}s)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
