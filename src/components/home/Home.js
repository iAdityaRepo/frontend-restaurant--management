import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch all restaurants
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/restaurant/getAll');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants', error);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle button click
  const handleClick = (id) => {
    console.log('Button clicked for restaurant ID:', id);
    // Implement further requests here if needed
  };

  return (
    <div>
      <h1>Restaurants</h1>
      {restaurants.length > 0 ? (
        <div>
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
              <button
                className="restaurant-button"
                onClick={() => handleClick(restaurant.id)}
              >
                <div className="restaurant-image-container">
                  {restaurant.imageData && (
                    <img
                      src={`data:image/jpeg;base64,${restaurant.imageData}`}
                      alt={restaurant.restaurantName}
                      className="restaurant-image"
                    />
                  )}
                </div>
                <span className="restaurant-name">{restaurant.restaurantName}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No restaurants found</p>
      )}
    </div>
  );
};

export default Home;
