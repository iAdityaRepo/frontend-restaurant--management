import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddFoodItem.css';

const AddFoodItem = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchCategories(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restaurant/getAll');
      setRestaurants(response.data);
    } catch (error) {
      console.error('There was an error fetching the restaurants!', error);
      setError('Failed to load restaurants.');
    }
  };

  const fetchCategories = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:8080/category/getAll/${restaurantId}`);
      setCategories(response.data);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
      setError('Failed to load categories.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('foodName', foodName);
    formData.append('restaurantId', selectedRestaurant);
    formData.append('description', description);
    formData.append('categoryId', selectedCategory);
    formData.append('isAvailable', isAvailable);
    formData.append('price', price);

    if (imageFile) {
      formData.append('multipartFile', imageFile);
    }

    try {
      const response = await axios.post('http://localhost:8080/foodItem/addFoodItem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setSuccess('Food item successfully added.');
        setError('');
      } else {
        setError('Failed to add food item.');
        setSuccess('');
      }
    } catch (error) {
      console.error('There was an error adding the food item!', error);
      setError('Failed to add food item.');
      setSuccess('');
    }
  };

  return (
    <div className="add-food-item-container">
      <h2>Add Food Item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Food Name:</span>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Select Restaurant:</span>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            required
          >
            <option value="">Select Restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.restaurantName}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Select Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Description:</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Is Available:</span>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
        </label>
        <label>
          <span>Price:</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            required
          />
        </label>
        <label>
          <span>Upload Image:</span>
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <button type="submit">Add Food Item</button>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AddFoodItem;
