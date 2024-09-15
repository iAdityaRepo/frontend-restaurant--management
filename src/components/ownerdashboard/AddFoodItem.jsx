import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AddFoodItem.css';

const AddFoodItem = () => {
  const { loggedInUser } = useUser();
  const userId = loggedInUser ? loggedInUser.id : null;
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userId) {
      fetchRestaurants(userId);
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userId: 'User ID is not available.',
      }));
    }
  }, [userId]);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchCategories(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  const fetchRestaurants = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8081/restaurant/get/${userId}`);
      setRestaurants(response.data);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        restaurants: 'Failed to load restaurants.',
      }));
    }
  };

  const fetchCategories = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:8081/category/getAll/${restaurantId}`);
      setCategories(response.data);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categories: 'Failed to load categories.',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!foodName.trim()) {
      newErrors.foodName = 'Food name cannot be blank';
    } else if (foodName.length < 3) {
      newErrors.foodName = 'Food name must be at least 3 characters long';
    } else if (!/^[a-zA-Z ]+$/.test(foodName)) {
      newErrors.foodName = 'Food name must contain only alphabets and spaces';
    }

    if (!selectedRestaurant) {
      newErrors.restaurantId = 'Restaurant must be selected';
    }

    if (!description.trim()) {
      newErrors.description = 'Description cannot be blank';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!selectedCategory) {
      newErrors.categoryId = 'Category must be selected';
    }

    if (!price || price < 0) {
      newErrors.price = 'Price cannot be null or negative';
    }

    if (isAvailable === null) {
      newErrors.isAvailable = 'Availability status cannot be null';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

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
      const response = await axios.post('http://localhost:8081/foodItem/addFoodItem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setSuccess('Food item successfully added.');
        setFoodName('');
        setSelectedRestaurant('');
        setDescription('');
        setSelectedCategory('');
        setPrice('');
        setImageFile(null);
        setIsAvailable(true);
        setErrors({});
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        window.alert(error.response.data.message);
      } else {
        window.alert('Failed to add food item.');
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Use navigate to go back to the previous page
  };

  if (!loggedInUser) {
    return <p>Please log in to access this page.</p>;
  }

  return (
    <div className="add-food-item-container">
      <h2>Add Food Item</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <div className="label"><label htmlFor="foodName">Food Name:</label></div>
          <div className="input">
            <input
              type="text"
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
            {errors.foodName && <p className="error">{errors.foodName}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="label"><label htmlFor="restaurant">Select Restaurant:</label></div>
          <div className="input">
            <select
              id="restaurant"
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
            >
              <option value="">Select Restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.restaurantName}
                </option>
              ))}
            </select>
            {errors.restaurantId && <p className="error">{errors.restaurantId}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="label"><label htmlFor="category">Select Category:</label></div>
          <div className="input">
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="error">{errors.categoryId}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="label"><label htmlFor="description">Description:</label></div>
          <div className="input">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p className="error">{errors.description}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="label"><label htmlFor="price">Price:</label></div>
          <div className="input">
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="label"><label htmlFor="isAvailable">Available:</label></div>
          <div className="input">
            <select
              id="isAvailable"
              value={isAvailable}
              onChange={(e) => setIsAvailable(e.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {errors.isAvailable && <p className="error">{errors.isAvailable}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="label"><label htmlFor="imageFile">Upload Image:</label></div>
          <div className="input">
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
        </div>

        <div className="upload-and-submit-container">
          <button type="submit">Add Food Item</button>
          <button type="button" className="back-button" onClick={handleBack}>Back</button>
        </div>
      </form>
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default AddFoodItem;
