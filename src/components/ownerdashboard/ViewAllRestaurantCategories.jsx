import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext';
import './ViewAllRestaurantCategories.css';

const ViewAllRestaurantCategories = () => {
  const { loggedInUser } = useUser();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      axios.get(`http://localhost:8081/restaurant/get/${loggedInUser.id}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setRestaurants(response.data);
          } else {
            setFormError('Failed to fetch restaurants: Unexpected data format.');
          }
          setLoading(false);
        })
        .catch(error => {
          setFormError('Failed to fetch restaurants.');
          setLoading(false);
        });
    } else {
      setFormError('User ID is not available.');
      setLoading(false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (selectedRestaurantId) {
      setCategoriesLoading(true);
      axios.get(`http://localhost:8081/category/getAll/${selectedRestaurantId}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setCategories(response.data);
          } else {
            setFormError('Failed to fetch categories: Unexpected data format.');
          }
          setCategoriesLoading(false);
        })
        .catch(error => {
          setFormError('Failed to fetch categories.');
          setCategoriesLoading(false);
        });
    }
  }, [selectedRestaurantId]);

  const handleCategoryEdit = (categoryId, currentName) => {
    setEditingCategoryId(categoryId);
    setEditedCategoryName(currentName);
  };

  const handleCategoryNameChange = (e) => {
    setEditedCategoryName(e.target.value);
  };

  const handleCategoryUpdate = (categoryId) => {
    if (editedCategoryName.trim() === '') {
      setFormError('Category name cannot be empty.');
      return;
    }

    axios.put(`http://localhost:8081/category/update/${categoryId}`, { name: editedCategoryName })
      .then(response => {
        if (response.status === 200) {
          setCategories(categories.map(cat =>
            cat.id === categoryId ? { ...cat, name: editedCategoryName } : cat
          ));
          setEditingCategoryId(null);
          setFormError('');
          setSuccessMessage('Category updated successfully!');
        } else {
          setFormError('Failed to update category. Response status: ' + response.status);
        }
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || 'Failed to update category.';
        setFormError(errorMessage);
      });
  };

  useEffect(() => {
    if (formError) {
      alert(formError);
      setFormError('');
    }
  }, [formError]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      setSuccessMessage('');
    }
  }, [successMessage]);

  if (loading) return <div className="loading">Loading restaurants...</div>;

  return (
    <div className="view-all-restaurant-categories">
      <h2>Restaurants and Categories</h2>

      <div className="restaurant-dropdown">
        <label htmlFor="restaurant-select">Select Restaurant:</label>
        <select
          id="restaurant-select"
          value={selectedRestaurantId || ''}
          onChange={(e) => setSelectedRestaurantId(e.target.value)}
        >
          <option value="">Select a restaurant</option>
          {restaurants.length > 0 ? (
            restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.restaurantName || 'No name available'}
              </option>
            ))
          ) : (
            <option value="">No restaurants available</option>
          )}
        </select>
      </div>

      {selectedRestaurantId && (
        <div className="category-list">
          <h3>Categories for Selected Restaurant</h3>
          {categoriesLoading ? (
            <div className="loading">Loading categories...</div>
          ) : categories.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>
                      {editingCategoryId === category.id ? (
                        <input
                          type="text"
                          value={editedCategoryName}
                          onChange={handleCategoryNameChange}
                        />
                      ) : (
                        category.name || 'No name available'
                      )}
                    </td>
                    <td>
                      {editingCategoryId === category.id ? (
                        <button onClick={() => handleCategoryUpdate(category.id)}>
                          Save
                        </button>
                      ) : (
                        <button onClick={() => handleCategoryEdit(category.id, category.name)}>
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No categories available for the selected restaurant.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAllRestaurantCategories;
