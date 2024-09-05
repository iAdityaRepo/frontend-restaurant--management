import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAllRestaurants.css';

const ViewAllRestaurants = ({ userId }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/restaurant/get/${userId}`)
        .then(response => {
          setRestaurants(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('User ID is missing.');
      setLoading(false);
    }
  }, [userId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (restaurants.length === 0) return <div className="no-restaurants">No restaurants found.</div>;

  return (
    <div className="restaurant-list">
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
          <h2>{restaurant.restaurantName}</h2>
          <p><strong>Address:</strong> {restaurant.address}</p>
          <p><strong>Contact:</strong> {restaurant.contactNumber}</p>
          <p><strong>Description:</strong> {restaurant.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewAllRestaurants;
