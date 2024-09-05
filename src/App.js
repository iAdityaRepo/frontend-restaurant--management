import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register'; 
import OwnerDashboard from './components/ownerdashboard/OwnerDashboard';
import UserDashboard from './components/userdashboard/UserDashboard';
import AddRestaurant from './components/ownerdashboard/AddRestaurant';
import ViewAllRestaurants from './components/ownerdashboard/ViewAllRestaurants';
import AddCategory from './components/ownerdashboard/AddCategory';
import ViewAllRestaurantCategories from './components/ownerdashboard/ViewAllRestaurantCategories';
import AddFoodItem from './components/ownerdashboard/AddFoodItem';
import ViewFoodItem from './components/ownerdashboard/ViewFoodItem';
import UpdateFoodItem from './components/ownerdashboard/UpdateFoodItem'; 

import './App.css';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLoginSuccess = (userOutDto) => {
    console.log('Login successful:', userOutDto);
    setLoggedInUser(userOutDto);
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/ownerDashboard" 
          element={loggedInUser && loggedInUser.role === 'OWNER' ? <OwnerDashboard user={loggedInUser} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/userDashboard" 
          element={loggedInUser && loggedInUser.role === 'USER' ? <UserDashboard user={loggedInUser} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/addRestaurant" 
          element={loggedInUser && loggedInUser.role === 'OWNER' ? <AddRestaurant userId={loggedInUser.id} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/viewAllRestaurants" 
          element={loggedInUser ? <ViewAllRestaurants userId={loggedInUser.id} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/addCategory" 
          element={loggedInUser && loggedInUser.role === 'OWNER' ? <AddCategory userId={loggedInUser.id} /> : <Navigate to="/login" />}
        />
        <Route
          path="/viewAllRestaurantCategories"
          element={loggedInUser ? <ViewAllRestaurantCategories userId={loggedInUser.id} /> : <Navigate to="/login" />}
        />
        <Route
          path="/addFoodItem"
          element={loggedInUser && loggedInUser.role === 'OWNER' ? <AddFoodItem userId={loggedInUser.id} /> : <Navigate to="/login" />}
        />
        <Route
          path="/viewFoodItem"
          element={loggedInUser ? <ViewFoodItem userId={loggedInUser.id} /> : <Navigate to="/login" />}
        />
        <Route
          path="/updateFoodItem"
          element={loggedInUser && loggedInUser.role === 'OWNER' ? <UpdateFoodItem userId={loggedInUser.id} /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
