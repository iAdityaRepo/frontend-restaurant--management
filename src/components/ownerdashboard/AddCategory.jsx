import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCategory.css';

const AddCategory = ({ userId }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/restaurant/get/${userId}`)
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
    setCategoryName(e.target.value);
  };

  const handleRestaurantChange = (e) => {
    setSelectedRestaurantId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID is not available.');
      return;
    }

    const categoryInDto = {
      restaurantId: parseInt(selectedRestaurantId),
      name: categoryName
    };

    axios.post('http://localhost:8080/category/add', categoryInDto)
      .then(response => {
        if (response.status === 201) {
          setSuccessMessage('Category added successfully!');
          setCategoryName('');
          setSelectedRestaurantId('');
          setError('');
        } else {
          setError('Failed to add category. Response status: ' + response.status);
          setSuccessMessage('');
        }
      })
      .catch(error => {
        console.error("There was an error adding the category!", error);
        setError('Failed to add category.');
        setSuccessMessage('');
      });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="add-category-container">
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
                  {restaurant.restaurantName} {/* Updated field name */}
                </option>
              ))
            ) : (
              <option value="">No restaurants available</option>
            )}
          </select>
        </label>
        <button type="submit">Add Category</button>
        {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AddCategory;
