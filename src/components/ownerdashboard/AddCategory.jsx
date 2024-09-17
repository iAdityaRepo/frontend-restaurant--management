import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext'; // Correct relative path to UserContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AddCategory.css';

const AddCategory = () => {
  const { loggedInUser } = useUser(); // Access loggedInUser from UserContext
  const userId = loggedInUser ? loggedInUser.id : null; // Extract userId from loggedInUser
  const navigate = useNavigate(); // Initialize useNavigate

  const [restaurants, setRestaurants] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8081/restaurant/get/${userId}`)
        .then(response => {
          setRestaurants(response.data);
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
  }, [userId]);

  const handleCategoryNameChange = (e) => {
    const value = e.target.value;
    const namePattern = /^[a-zA-Z ]+$/;

    if (value === '' || !namePattern.test(value)) {
      setError('Category name must contain only alphabets and spaces.');
    } else {
      setError('');
    }

    setCategoryName(value);
  };

  const handleRestaurantChange = (e) => {
    setSelectedRestaurantId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID is not available.');
      window.alert(`Error: User ID is not available.`);
      return;
    }

    if (categoryName.trim() === '') {
      setError('Category name cannot be blank.');
      window.alert(`Error: Category name cannot be blank.`);
      return;
    }

    if (categoryName.length < 3) {
      setError('Category name must be at least 3 characters long.');
      window.alert(`Error: Category name must be at least 3 characters long.`);
      return;
    }

    const namePattern = /^[a-zA-Z ]+$/;
    if (!namePattern.test(categoryName)) {
      setError('Category name must contain only alphabets and spaces.');
      window.alert(`Error: Category name must contain only alphabets and spaces.`);
      return;
    }

    const categoryInDto = {
      restaurantId: parseInt(selectedRestaurantId),
      name: categoryName
    };

    axios.post('http://localhost:8081/category/add', categoryInDto)
      .then(response => {
        if (response.status === 201) {
          setSuccessMessage('Category added successfully!');
          setCategoryName('');
          setSelectedRestaurantId('');
          setError('');
          window.alert(`Success: Category added successfully!`);
        } else {
          setError('Failed to add category. Response status: ' + response.status);
          window.alert(`Error: Failed to add category. Response status: ${response.status}`);
        }
      })
      .catch(error => {
        let errorMessage = 'Failed to add category.';
        
        if (error.response) {
          if (error.response.status === 409) {
            errorMessage = error.response.data.message || 'Category already exists.';
          } else {
            errorMessage = error.response.data.message || errorMessage;
          }
        }

        window.alert(`Error: ${errorMessage}`);
        setSuccessMessage('');
        setCategoryName('');
        setSelectedRestaurantId('');
      });
  };

  const handleBackClick = () => {
    navigate('/ownerDashboard'); // Navigate to the OwnerDashboard
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="add-category-container">
      <button className="category-back-button" onClick={handleBackClick}>Back </button>
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Category Name:</span>
          <input
            type="text"
            value={categoryName}
            onChange={handleCategoryNameChange}
            required
          />
        </label>
        <label>
          <span>Select Restaurant:</span>
          <select
            value={selectedRestaurantId}
            onChange={handleRestaurantChange}
            required
          >
            <option value="">Select a restaurant</option>
            {restaurants.length > 0 ? (
              restaurants.map(restaurant => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.restaurantName}
                </option>
              ))
            ) : (
              <option value="">No restaurants available</option>
            )}
          </select>
        </label>
        <button className="add-category-button" type="submit">Add Category</button>
        {successMessage && <p className="success">{successMessage}</p>}
      </form>
    </div>
  );
};

export default AddCategory;
