import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import your CSS file

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Base64 encode the password
    const encodedPassword = btoa(password);

    try {
      const response = await axios.post('http://localhost:8081/user/login', { email, password: encodedPassword });
      const userOutDto = response.data;
      onLoginSuccess(userOutDto); // Call onLoginSuccess with the received userOutDto
      const { role } = userOutDto;
      if (role === 'USER') {
        navigate('/userDashboard');
      } else if (role === 'OWNER') {
        navigate('/ownerDashboard');
      } else {
        setError('Invalid role received.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Email mismatched.');
      } else if (err.response && err.response.status === 401) {
        setError('Password mismatched.');
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
        <button type="submit">Login</button>
      </form>
      {error && <p className="message">{error}</p>}
    </div>
  );
};

export default Login;
