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
    const { name, email, phoneNo, password, confirmPassword } = formData;

    // Normalize and trim name
    const normalizedName = name.trim().replace(/\s+/g, ' ');

    // Name Validation
    if (!normalizedName) {
      errors.name = 'Name cannot be blank.';
    } else if (normalizedName.length < 3) {
      errors.name = 'Name must be at least 3 characters long.';
    } else if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(normalizedName)) {
      errors.name = 'Name can only contain alphabets and single spaces between words.';
    }

    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|nuclesteq\.com)$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Email must end with @gmail.com or @nuclesteq.com.';
    } else {
      const localPart = email.split('@')[0];
      if (/^\d+$/.test(localPart)) {
        errors.email = 'Email local part cannot be just numbers.';
      }
    }

    // Phone Number Validation
    if (!/^[6789]\d{9}$/.test(phoneNo)) {
      errors.phoneNo = 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9.';
    }

    // Password Validation
    if (password !== confirmPassword) {
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

    // Update form data with the encoded password
    const dataToSend = {
      ...formData,
      password: encodedPassword,
    };

    try {
      // Make the POST request
      const response = await axios.post('http://localhost:8081/user/add', dataToSend, {
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
      setErrors({ general: error.response?.data?.message || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="register-container">
  <h1>Register</h1>
  {errors.general && <p className="error">{errors.general}</p>}
  {success && <p className="success">{success}</p>}
  <form onSubmit={handleSubmit} className='form'>
    <div className="form-group">
      <div className='label'><label htmlFor="name" >Name:</label></div>
      <div  className='input'><input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
       
      />
      {errors.name && <p className="error">{errors.name}</p>}
      </div>
    </div>
    <div className="form-group">
    <div className='label'> <label htmlFor="email">Email:</label></div>
    <div  className='input'> 
       <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {errors.email && <p className="error">{errors.email}</p>}
      </div>
    </div>
    <div className="form-group">
      <label htmlFor="phoneNo">Phone Number:</label>
      <div  className='input'><input
        type="text"
        id="phoneNo"
        name="phoneNo"
        value={formData.phoneNo}
        onChange={handleChange}
        required
      />
      {errors.phoneNo && <p className="error">{errors.phoneNo}</p>}
      </div>
    </div>
    <div className="form-group">
      <div className='label'><label htmlFor="password">Password:</label></div>
      <div  className='input'> <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      </div>
    </div>
    <div className="form-group">
      <label htmlFor="confirmPassword">Confirm Password:</label>
      <div  className='input'> <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
      </div>
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
