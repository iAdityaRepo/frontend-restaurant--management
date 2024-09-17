import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cartImage from '../../assets/images/cart.jpg';
import './Cart.css';
import { useUser } from '../../UserContext';

const Cart = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loggedInUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
    }
  }, [loggedInUser, navigate]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/restaurant/getAll');
      setRestaurants(response.data);
      setShowRestaurants(true);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      alert('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurantId) => {
    navigate(`/food-and-cart/${restaurantId}`);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="empty-cart">
        <img src={cartImage} alt="Empty Cart" className="cart-image" />
        <div className="empty-cart-text">Your cart is empty</div>
        <button
          className="fetch-restaurants-button"
          onClick={fetchRestaurants}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'See restaurants near you'}
        </button>
        {showRestaurants && (
          <div className="restaurants-list">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <div key={restaurant.id} className="restaurant-card">
                  <button
                    className="restaurant-button cart-btn-1"
                    onClick={() => handleSelectRestaurant(restaurant.id)}
                  >
                    <div className="restaurant-image-container">
                      {restaurant.imageData ? (
                        <img
                          src={`data:image/jpeg;base64,${restaurant.imageData}`}
                          alt={restaurant.restaurantName}
                          className="restaurant-image"
                        />
                      ) : (
                        <div className="no-image">No image available</div>
                      )}
                    </div>
                    <span className="restaurant-name">{restaurant.restaurantName}</span>
                    <p>{restaurant.address || 'No address available'}</p>
                    <p>{restaurant.contactNumber || 'No contact number available'}</p>
                  </button>
                </div>
              ))
            ) : (
              <p>No restaurants found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
