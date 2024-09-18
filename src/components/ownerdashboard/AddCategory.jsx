import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext'; // Correct relative path to UserContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import './AddCategory.css';

const AddCategory = () => {
  const { loggedInUser } = useUser(); // Access loggedInUser from UserContext
  const userId = loggedInUser ? loggedInUser.id : null; // Extract userId from loggedInUser
  const navigate = useNavigate(); // Initialize useNavigate

  const [restaurants, setRestaurants] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [error, setError] = useState('');
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
          toast.error('Failed to fetch restaurants.'); // Display toast for error
        });
    } else {
      setError('User ID is not available.');
      setLoading(false);
      toast.error('User ID is not available.'); // Display toast for error
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
      toast.error('User ID is not available.'); // Display toast for error
      return;
    }

    if (categoryName.trim() === '') {
      setError('Category name cannot be blank.');
      toast.error('Category name cannot be blank.'); // Display toast for error
      return;
    }

    if (categoryName.length < 3) {
      setError('Category name must be at least 3 characters long.');
      toast.error('Category name must be at least 3 characters long.'); // Display toast for error
      return;
    }

    const namePattern = /^[a-zA-Z ]+$/;
    if (!namePattern.test(categoryName)) {
      setError('Category name must contain only alphabets and spaces.');
      toast.error('Category name must contain only alphabets and spaces.'); // Display toast for error
      return;
    }

    const categoryInDto = {
      restaurantId: parseInt(selectedRestaurantId),
      name: categoryName
    };

    axios.post('http://localhost:8081/category/add', categoryInDto)
      .then(response => {
        if (response.status === 201) {
          setCategoryName('');
          setSelectedRestaurantId('');
          setError('');
          toast.success('Category added successfully!'); // Display toast for success
        } else {
          setError('Failed to add category. Response status: ' + response.status);
          toast.error(`Failed to add category. Response status: ${response.status}`); // Display toast for error
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

        toast.error(errorMessage); // Display toast for error
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
      </form>
      <ToastContainer /> {/* Add ToastContainer to render the toasts */}
    </div>
  );
};

export default AddCategory;
