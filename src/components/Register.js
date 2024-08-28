import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Import CSS for styling

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    password: '',
    role: 'USER', // Default role
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, phoneNo } = formData;

    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters long.');
      return false;
    }

    if (!email.endsWith('@gmail.com')) {
      setError('Email must end with @gmail.com.');
      return false;
    }

    if (!/^\d{10}$/.test(phoneNo)) {
      setError('Phone number must be a 10-digit number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setError(null);
    setSuccess(null);

    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      // Make the POST request
      const response = await axios.post('http://localhost:8081/user/add', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('User registered successfully:', response.data);
      setSuccess('Registration successful! Please log in.');
      setFormData({
        name: '',
        email: '',
        phoneNo: '',
        password: '',
        role: 'USER',
      });
    } catch (error) {
      // Display detailed error message from server
      console.error('Error registering user:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNo">Phone Number:</label>
          <input
            type="text"
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
