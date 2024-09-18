import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import './ViewAllRestaurantCategories.css';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

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
      setFormError(null);
      setLoading(true);
      axios.get(`http://localhost:8081/restaurant/get/${loggedInUser.id}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setRestaurants(response.data);
          } else {
            const message = 'Failed to fetch restaurants: Unexpected data format.';
            setFormError(message);
          }
          setLoading(false);
        })
        .catch(error => {
          const message = 'Failed to fetch restaurants.';
          setFormError(message);
          setLoading(false);
        });
    } else {
      const message = 'User ID is not available.';
      setFormError(message);
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
            const message = 'Failed to fetch categories: Unexpected data format.';
            setFormError(message);
          }
          setCategoriesLoading(false);
        })
        .catch(error => {
          const message = 'Failed to fetch categories.';
          setFormError(message);
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
      const message = 'Category name cannot be empty.';
      setFormError(message);
      return;
    }

    axios.put(`http://localhost:8081/category/update/${categoryId}`, { name: editedCategoryName })
      .then(response => {
        if (response.status === 200) {
          setCategories(categories.map(cat =>
            cat.id === categoryId ? { ...cat, name: editedCategoryName } : cat
          ));
          setEditingCategoryId(null);
          const message = 'Category updated successfully!';
          setSuccessMessage(message);
        } else {
          const message = 'Failed to update category. Response status: ' + response.status;
          setFormError(message);
        }
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || 'Failed to update category.';
        setFormError(errorMessage);
      });
  };

  useEffect(() => {
    if (formError) {
      toast.error(formError); // Display toast for error
      setFormError(''); // Clear error message after displaying
    }
  }, [formError]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage); // Display toast for success
      setSuccessMessage(''); // Clear success message after displaying
    }
  }, [successMessage]);

  if (loading) return <div className="loading">Loading restaurants...</div>;

  return (
    <>
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
      <ToastContainer /> 
    </>
  );
};

export default ViewAllRestaurantCategories;
