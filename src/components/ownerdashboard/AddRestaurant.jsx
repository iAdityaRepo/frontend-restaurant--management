import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddRestaurant.css';

const AddRestaurant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user; // Retrieve user object from state
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!user || !user.id) {
      setError('User ID is not available.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('restaurantName', restaurantName);
    formData.append('address', address);
    formData.append('contactNumber', contactNumber);
    formData.append('description', description);
    
    if (imageFile) {
      formData.append('multipartFile', imageFile);
    } else {
      // Append a default image
      const defaultImage = new File([''], 'defaultRestroImage.jpg', { type: 'image/jpeg' });
      formData.append('multipartFile', defaultImage);
    }

    axios.post('http://localhost:8080/restaurant/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      if (response.status === 201) {
        console.log('Restaurant added:', response.data);
        setSuccess('Restaurant successfully created.');
        setError(''); // Clear any previous error messages
        navigate('/ownerDashboard');
      } else {
        setError('Failed to add restaurant. Response status: ' + response.status);
        setSuccess(''); // Clear any previous success messages
      }
    })
    .catch(error => {
      console.error('There was an error adding the restaurant:', error);
      setError('Failed to add restaurant.');
      setSuccess(''); // Clear any previous success messages
    });
  };

  return (
    <div className="add-restaurant-container">
      <h2>Add Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Restaurant Name:</span>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Address:</span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Contact Number:</span>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
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
          <span>Upload Image:</span>
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <button type="submit">Add Restaurant</button>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AddRestaurant;
