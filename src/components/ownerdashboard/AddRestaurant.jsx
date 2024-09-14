import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext'; // Import useUser hook
import './AddRestaurant.css';

const AddRestaurant = () => {
  const { loggedInUser } = useUser(); // Access logged-in user from context
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = {};

    if (!loggedInUser || !loggedInUser.id) {
      validationErrors.general = 'User ID is not available.';
    }

    // Validate restaurantName
    if (!restaurantName.trim()) {
      validationErrors.restaurantName = 'Restaurant name cannot be blank.';
    } else if (restaurantName.length < 3) {
      validationErrors.restaurantName = 'Restaurant name must be at least 3 characters long.';
    } else if (!/^[a-zA-Z ]+$/.test(restaurantName)) {
      validationErrors.restaurantName = 'Restaurant name must contain only alphabets and spaces.';
    }

    // Validate address
    if (!address.trim()) {
      validationErrors.address = 'Address cannot be blank.';
    }

    // Validate contactNumber
    if (!/^[7896]\d{9}$/.test(contactNumber)) {
      validationErrors.contactNumber = 'Number needs 10 digits starting with 7, 8, 9, or 6.';
    }

    // Validate description
    if (!description.trim()) {
      validationErrors.description = 'Description cannot be blank.';
    } else if (!/^[a-zA-Z ]+$/.test(description)) {
      validationErrors.description = 'Description must contain only alphabets and spaces.';
    }

    // Update state with all validation errors
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('userId', loggedInUser.id); // Use user ID from context
    formData.append('restaurantName', restaurantName);
    formData.append('address', address);
    formData.append('contactNumber', contactNumber);
    formData.append('description', description);

    if (imageFile) {
      formData.append('multipartFile', imageFile);
    } else {
      const defaultImage = new File([''], 'defaultRestroImage.jpg', { type: 'image/jpeg' });
      formData.append('multipartFile', defaultImage);
    }

    try {
      const response = await axios.post('http://localhost:8081/restaurant/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setSuccess('Restaurant successfully created.');
        setError({});
        setRestaurantName('');
        setAddress('');
        setContactNumber('');
        setDescription('');
        setImageFile(null);
        setTimeout(() => navigate('/ownerDashboard'), 2000);
      } else {
        setError({ general: `Failed to add restaurant. Response status: ${response.status}` });
      }
    } catch (error) {
      setError({ general: 'Failed to add restaurant.' });
    }
  };

  if (!loggedInUser) {
    return <p>Please log in to access this page.</p>; // Handle case when user is not logged in
  }

  return (
    <div className="add-restaurant-container">
      <h2>Add Restaurant</h2>
      {error.general && <p className="error">{error.general}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <div className='label'><label htmlFor="restaurantName">Restaurant Name:</label></div>
          <div className='input'>
            <input
              type="text"
              id="restaurantName"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
            {error.restaurantName && <p className="error">{error.restaurantName}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="address">Address:</label></div>
          <div className='input'>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {error.address && <p className="error">{error.address}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="contactNumber">Contact Number:</label></div>
          <div className='input'>
            <input
              type="text"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            {error.contactNumber && <p className="error">{error.contactNumber}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="description">Description:</label></div>
          <div className='input'>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error.description && <p className="error">{error.description}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="imageFile">Upload Image:</label></div>
          <div className='input'>
            <input
              type="file"
              id="imageFile"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {error.imageFile && <p className="error">{error.imageFile}</p>}
          </div>
        </div>
        <button type="submit">Add Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurant;
