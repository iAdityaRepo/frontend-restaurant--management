import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Import CSS for styling

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    let { name, email, phoneNo, password, confirmPassword } = formData;

    // Normalize and trim name
    name = name.trim().replace(/\s+/g, ' '); // This will format the name with single spaces only

    // Name Validation
    if (!name) {
      errors.name = 'Name cannot be blank.';
    } else if (name.length < 3) {
      errors.name = 'Name must be at least 3 characters long.';
    } else if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(name)) {
      errors.name = 'Name can only contain alphabets and single spaces between words.';
    }

    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|nuclesteq\.com)$/;
    if (!email) {
      errors.email = 'Email cannot be blank.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email must end with @gmail.com or @nuclesteq.com.';
    } else {
      const localPart = email.split('@')[0];
      if (/^\d+$/.test(localPart)) {
        errors.email = 'Email local part cannot be just numbers.';
      }
    }

    // Phone Number Validation
    if (!phoneNo) {
      errors.phoneNo = 'Phone number cannot be blank.';
    } else if (!/^[6789]\d{9}$/.test(phoneNo)) {
      errors.phoneNo = 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9.';
    }

    // Password Validation (updated to match backend validation)
    if (!password) {
      errors.password = 'Password cannot be blank.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/.test(password)) {
      errors.password = 'Password must be at least 4 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password cannot be blank.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous success message
    setSuccess(null);

    // Validate form data
    if (!validateForm()) {
      return;
    }

    // Encode the password in Base64
    const encodedPassword = btoa(formData.password);

    // Update form data with the encoded password and formatted name
    const dataToSend = {
      ...formData,
      name: formData.name.trim().replace(/\s+/g, ' '), // Send formatted name
      password: encodedPassword,
    };

    try {
      // Make the POST request
      const response = await axios.post('http://localhost:8080/user/add', dataToSend, {
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
        confirmPassword: '',
        role: 'USER',
      });
      setErrors({});
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);

      // Extract and set backend error messages
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {errors.general && <p className="error">{errors.general}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className='form'>
        <div className="form-group">
          <div className='label'><label htmlFor="name">Name:</label></div>
          <div className='input'>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="email">Email:</label></div>
          <div className='input'>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="phoneNo">Phone Number:</label></div>
          <div className='input'>
            <input
              type="text"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
            />
            {errors.phoneNo && <p className="error">{errors.phoneNo}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="password">Password:</label></div>
          <div className='input'>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="confirmPassword">Confirm Password:</label></div>
          <div className='input'>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
        </div>
        <div className="form-group">
          <div className='label'><label htmlFor="role">Role:</label></div>
          <div className='input'>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
        </div>
        <div className="button-container">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
