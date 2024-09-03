import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateFoodItem.css';

const UpdateFoodItem = ({ userId }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFoodItemId, setSelectedFoodItemId] = useState(null);
  const [foodItemData, setFoodItemData] = useState({
    foodName: '',
    price: '',
    description: '',
    isAvailable: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/restaurant/get/${userId}`)
        .then(response => {
          setRestaurants(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch restaurants.');
          setLoading(false);
        });
    } else {
      setError('User ID is not available.');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (selectedRestaurantId) {
      axios.get(`http://localhost:8080/foodItem/getAll/${selectedRestaurantId}`)
        .then(response => {
          setFoodItems(response.data);
        })
        .catch(error => {
          setError('Failed to fetch food items.');
        });
    }
  }, [selectedRestaurantId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodItemData({
      ...foodItemData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFoodItemSelect = (foodItem) => {
    setSelectedFoodItemId(foodItem.id);
    setFoodItemData({
      foodName: foodItem.foodName,
      price: foodItem.price,
      description: foodItem.description,
      isAvailable: foodItem.isAvailable,
    });
  };

  const handleUpdateFoodItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/foodItem/update/${selectedFoodItemId}`, foodItemData);
      alert('Food item updated successfully!');
    } catch (error) {
      console.error('There was an error updating the food item!', error);
    }
  };

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="update-food-item-container">
      <h2>Update Food Item</h2>

      <div className="restaurant-list">
        <h3>Select a Restaurant</h3>
        <select onChange={(e) => setSelectedRestaurantId(e.target.value)}>
          <option value="">Select a restaurant</option>
          {restaurants.map(restaurant => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.restaurantName}
            </option>
          ))}
        </select>
      </div>

      {selectedRestaurantId && (
        <div className="food-item-list">
          <h3>Select a Food Item to Update</h3>
          <select onChange={(e) => handleFoodItemSelect(foodItems.find(item => item.id === parseInt(e.target.value)))}>
            <option value="">Select a food item</option>
            {foodItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.foodName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedFoodItemId && (
        <form onSubmit={handleUpdateFoodItem} className="food-item-form">
          <div className="form-group">
            <label htmlFor="foodName">Food Name:</label>
            <input
              type="text"
              id="foodName"
              name="foodName"
              value={foodItemData.foodName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={foodItemData.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={foodItemData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="isAvailable">Available:</label>
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={foodItemData.isAvailable}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="update-button">Update Food Item</button>
        </form>
      )}
    </div>
  );
};

export default UpdateFoodItem;
