import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateCategory.css';

const UpdateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [restaurantId, setRestaurantId] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchRestaurants();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/category/getAll/1'); // Replace with actual restaurantId
      setCategories(response.data);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restaurant/getAll');
      setRestaurants(response.data);
    } catch (error) {
      console.error('There was an error fetching the restaurants!', error);
    }
  };

  const handleCategoryUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/category/update/${selectedCategory}`, { name: categoryName });
      alert('Category updated successfully!');
      fetchCategories();
    } catch (error) {
      console.error('There was an error updating the category!', error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    const category = categories.find(cat => cat.id === parseInt(e.target.value));
    if (category) {
      setCategoryName(category.name);
    }
  };

  return (
    <div className="container">
      <h1>Update Category</h1>
      <form onSubmit={handleCategoryUpdate}>
        <div>
          <label htmlFor="category">Select Category:</label>
          <select id="category" value={selectedCategory || ''} onChange={handleCategoryChange}>
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <>
            <div>
              <label htmlFor="categoryName">Category Name:</label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <button type="submit">Update Category</button>
          </>
        )}
      </form>
      <hr />
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map(restaurant => (
          <li key={restaurant.id}>
            {restaurant.name} - {restaurant.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateCategory;
