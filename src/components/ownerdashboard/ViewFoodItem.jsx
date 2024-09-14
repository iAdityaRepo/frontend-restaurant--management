// src/components/viewfooditem/ViewFoodItem.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext'; // Import useUser hook
import './ViewFoodItem.css';

const ViewFoodItem = () => {
  const { loggedInUser } = useUser(); // Access logged-in user from context
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foodItemsLoading, setFoodItemsLoading] = useState(false);

  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      axios.get(`http://localhost:8081/restaurant/get/${loggedInUser.id}`)
        .then(response => {
          console.log('Restaurants API Response:', response.data); // Debugging log
          if (Array.isArray(response.data)) {
            setRestaurants(response.data);
          } else {
            console.error('Unexpected data format:', response.data);
            setError('Failed to fetch restaurants: Unexpected data format.');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the restaurants!", error);
          setError('Failed to fetch restaurants.');
          setLoading(false);
        });
    } else {
      setError('User ID is not available.');
      setLoading(false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (selectedRestaurantId) {
      setFoodItemsLoading(true);
      axios.get(`http://localhost:8081/foodItem/getAll/${selectedRestaurantId}`)
        .then(response => {
          console.log('Food Items API Response:', response.data); // Debugging log
          if (Array.isArray(response.data)) {
            setFoodItems(response.data);
          } else {
            console.error('Unexpected data format:', response.data);
            setError('Failed to fetch food items: Unexpected data format.');
          }
          setFoodItemsLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the food items!", error);
          setError('Failed to fetch food items.');
          setFoodItemsLoading(false);
        });
    }
  }, [selectedRestaurantId]);

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="view-food-item">
      <h2>Food Items</h2>

      <div className="restaurant-grid">
        <h3>All Restaurants</h3>
        {restaurants.length > 0 ? (
          <div className="restaurant-cards">
            {restaurants.map(restaurant => (
              <div
                className="restaurant-card"
                key={restaurant.id}
                onClick={() => setSelectedRestaurantId(restaurant.id)}
              >
                {restaurant.imageData ? (
                  <img
                    src={`data:image/jpeg;base64,${restaurant.imageData}`}
                    alt={restaurant.restaurantName}
                    className="restaurant-image"
                  />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
                <div className="restaurant-info">
                  <h4>{restaurant.restaurantName || 'No name available'}</h4>
                  <button className="view-food-button">
                    View Food Items
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No restaurants available</p>
        )}
      </div>

      {selectedRestaurantId && (
        <div className="food-item-list">
          <h3>Food Items for Selected Restaurant</h3>
          {foodItemsLoading ? (
            <div className="loading">Loading food items...</div>
          ) : foodItems.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {foodItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.foodName || 'No name available'}</td>
                    <td>{item.description || 'No description available'}</td>
                    <td>{item.categoryName || 'No category available'}</td>
                    <td>{item.price != null ? `${item.price.toFixed(2)}` : 'No price available'}</td>
                    <td>{item.isAvailable ? 'Available' : 'Not Available'}</td>
                    <td>
                      {item.imageData ? (
                        <img
                          src={`data:image/jpeg;base64,${item.imageData}`}
                          alt={item.foodName}
                          className="food-item-image"
                        />
                      ) : (
                        'No image available'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No food items available for the selected restaurant.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewFoodItem;
