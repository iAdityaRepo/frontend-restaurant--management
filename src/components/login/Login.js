import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../UserContext'; // Import useUser hook
import './Login.css'; // Import your CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access query parameters
  const { login } = useUser(); // Access login function from context

  useEffect(() => {
    // Check for alert query parameter and show toast if present
    const params = new URLSearchParams(location.search);
    if (params.get('alert') === 'please_login') {
      toast.warn('Please log in first to access this page.');
    }
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Base64 encode the password
    const encodedPassword = btoa(password);
  
    try {
      const response = await axios.post('http://localhost:8080/user/login', { email, password: encodedPassword });
      const userOutDto = response.data;
      console.log('Login successful:', userOutDto); // Debugging line
      login(userOutDto); // Set the logged-in user in context
      const { role } = userOutDto;
      console.log('User role:', role); // Debugging line

      // Redirect based on user role
      if (role === 'USER') {
        navigate('/userDashboard');
      } else if (role === 'OWNER') {
        navigate('/ownerDashboard');
      } else {
        setError('Invalid role received.');
      }
    } catch (err) {
      console.error('Error during login:', err); // Debugging line
      if (err.response && err.response.status === 404) {
        setError('Invalid Credentials');
      } else if (err.response && err.response.status === 401) {
        setError('Invalid Credentials');
      } else {
        setError('An error occurred.');
      }
    }
  };
  
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit">Login</button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="register-prompt">
        Don't have an account? <a href="/register">Register here</a>
      </p>
      <ToastContainer />
    </div>
  );
};

export default Login;
