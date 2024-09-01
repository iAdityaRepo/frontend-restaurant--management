import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAllRestaurantCategories.css';

const ViewAllRestaurantCategories = ({ userId }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/restaurant/get/${userId}`)
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
  }, [userId]);

  useEffect(() => {
    if (selectedRestaurantId) {
      setCategoriesLoading(true);
      axios.get(`http://localhost:8080/category/getAll/${selectedRestaurantId}`)
        .then(response => {
          console.log('Categories API Response:', response.data); // Debugging log
          if (Array.isArray(response.data)) {
            setCategories(response.data);
          } else {
            console.error('Unexpected data format:', response.data);
            setError('Failed to fetch categories: Unexpected data format.');
          }
          setCategoriesLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the categories!", error);
          setError('Failed to fetch categories.');
          setCategoriesLoading(false);
        });
    }
  }, [selectedRestaurantId]);

  const handleCategoryUpdate = (categoryId) => {
    const newCategoryName = prompt('Enter new category name:');
    if (newCategoryName) {
      axios.put(`http://localhost:8080/category/update/${categoryId}`, { name: newCategoryName })
        .then(response => {
          if (response.status === 200) {
            setCategories(categories.map(cat =>
              cat.id === categoryId ? { ...cat, name: newCategoryName } : cat
            ));
            alert('Category updated successfully!');
          } else {
            setError('Failed to update category. Response status: ' + response.status);
          }
        })
        .catch(error => {
          console.error("There was an error updating the category!", error);
          setError('Failed to update category.');
        });
    }
  };

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="view-all-restaurant-categories">
      <h2>Restaurants and Categories</h2>

      <div className="restaurant-list">
        <h3>All Restaurants</h3>
        <table>
          <thead>
            <tr>
              <th>Restaurant Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length > 0 ? (
              restaurants.map(restaurant => (
                <tr key={restaurant.id}>
                  <td>{restaurant.restaurantName || 'No name available'}</td>
                  <td>
                    <button onClick={() => setSelectedRestaurantId(restaurant.id)}>
                      View Categories
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No restaurants available</td>
              </tr>
            )}
          </tbody>
        </table>
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
                  <th>Category ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.name || 'No name available'}</td>
                    <td>{category.id || 'No ID available'}</td>
                    <td>
                      <button onClick={() => handleCategoryUpdate(category.id)}>
                        Update Name
                      </button>
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
}

export default ViewAllRestaurantCategories;
