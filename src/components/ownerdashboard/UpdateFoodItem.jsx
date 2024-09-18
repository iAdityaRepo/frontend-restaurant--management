import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { useUser } from '../../UserContext';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import ToastContainer styles
import './UpdateFoodItem.css';

const UpdateFoodItem = () => {
  const { loggedInUser } = useUser();
  const navigate = useNavigate(); 
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFoodItemId, setSelectedFoodItemId] = useState('');
  const [foodItemData, setFoodItemData] = useState({
    foodName: '',
    price: '',
    description: '',
    isAvailable: false,
    categoryId: '', 
    restaurantId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (loggedInUser?.id) {
      fetchRestaurants(loggedInUser.id);
    } else {
      setErrors({ userId: 'User ID is not available.' });
      setLoading(false);
    }
  }, [loggedInUser?.id]);

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchFoodItems(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const fetchRestaurants = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8081/restaurant/get/${userId}`);
      setRestaurants(response.data || []);
    } catch (error) {
      setErrors({ restaurants: 'Failed to fetch restaurants.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodItems = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:8081/foodItem/getAll/${restaurantId}`);
      setFoodItems(response.data || []);
    } catch (error) {
      setErrors({ foodItems: 'Failed to fetch food items.' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!foodItemData.foodName.trim()) {
      newErrors.foodName = 'Food name cannot be blank';
    } else if (foodItemData.foodName.length < 3) {
      newErrors.foodName = 'Food name must be at least 3 characters long';
    } else if (!/^[a-zA-Z ]+$/.test(foodItemData.foodName)) {
      newErrors.foodName = 'Food name must contain only alphabets and spaces';
    }

    if (!foodItemData.description.trim()) {
      newErrors.description = 'Description cannot be blank';
    } else if (foodItemData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!foodItemData.price || foodItemData.price <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodItemData({
      ...foodItemData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ['image/jpeg', 'image/png'];
      if (validExtensions.includes(file.type)) {
        setImageFile(file);
        setErrors(prevErrors => ({ ...prevErrors, imageFile: '' })); // Clear image file error
      } else {
        setErrors(prevErrors => ({ ...prevErrors, imageFile: 'Invalid file type. Only .jpg, .jpeg, and .png are allowed.' }));
      }
    }
  };

  const handleFoodItemSelect = (e) => {
    const foodItemId = e.target.value;
    const foodItem = foodItems.find(item => item.id === parseInt(foodItemId));
    if (foodItem) {
      setSelectedFoodItemId(foodItemId);
      setFoodItemData({
        foodName: foodItem.foodName,
        price: foodItem.price,
        description: foodItem.description,
        isAvailable: foodItem.isAvailable,
        categoryId: foodItem.categoryId, 
        restaurantId: foodItem.restaurantId
      });
      setErrors({});
    }
  };

  const handleUpdateFoodItem = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('foodName', foodItemData.foodName);
    formData.append('price', foodItemData.price);
    formData.append('description', foodItemData.description);
    formData.append('isAvailable', foodItemData.isAvailable);
    formData.append('categoryId', foodItemData.categoryId); 
    formData.append('restaurantId', foodItemData.restaurantId);
    if (imageFile) {
      formData.append('multipartFile', imageFile);
    }

    try {
      await axios.put(`http://localhost:8081/foodItem/update/${selectedFoodItemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Food item updated successfully!');
      setErrors({});
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'Failed to update food item.'}`);
      } else {
        toast.error('Failed to update food item.');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (errors.restaurants) return <div className="error">Error: {errors.restaurants}</div>;

  return (
    <div className="update-food-item-container">
      <button className="back-button" onClick={() => navigate('/ownerDashboard')}>
        &larr; Back to Dashboard
      </button>
      <h2>Update Food Item</h2>

      <div className="form-row-column">
        <div className="form-group">
          <label>Select a Restaurant</label>
          <select onChange={(e) => setSelectedRestaurantId(e.target.value)} value={selectedRestaurantId}>
            <option value="">Select a restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.restaurantName}
              </option>
            ))}
          </select>
          {errors.restaurants && <div className="error">{errors.restaurants}</div>}
        </div>

        <div className="form-group">
          <label>Select a Food Item</label>
          <select onChange={handleFoodItemSelect} value={selectedFoodItemId}>
            <option value="">Select a food item</option>
            {foodItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.foodName}
              </option>
            ))}
          </select>
          {errors.foodItems && <div className="error">{errors.foodItems}</div>}
        </div>
      </div>

      {selectedFoodItemId && (
        <form onSubmit={handleUpdateFoodItem} className="food-item-form">
          <div className="form-group">
            <label>Food Name</label>
            <input
              type="text"
              name="foodName"
              value={foodItemData.foodName}
              onChange={handleInputChange}
            />
            {errors.foodName && <div className="error">{errors.foodName}</div>}
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={foodItemData.price}
              onChange={handleInputChange}
            />
            {errors.price && <div className="error">{errors.price}</div>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={foodItemData.description}
              onChange={handleInputChange}
            />
            {errors.description && <div className="error">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={foodItemData.isAvailable}
                onChange={handleInputChange}
              />
              Available
            </label>
          </div>

          <div className="form-group">
            <label>Upload Image</label>
            <input type="file" onChange={handleFileChange} />
            {errors.imageFile && <div className="error">{errors.imageFile}</div>}
          </div>

          <button type="submit" className="submit-button">Update Food Item</button>
        </form>
      )}

      <ToastContainer />
    </div>
  );
};

export default UpdateFoodItem;
