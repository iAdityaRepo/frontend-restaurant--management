import React from 'react';
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
import MyOrders from './components/ownerdashboard/MyOrders';
import ViewMenu from './components/home/ViewMenu'; // Import ViewMenu component
import Cart from './components/userdashboard/Cart';
import FilledCart from './components/userdashboard/FilledCart'; // Import FilledCart component
import FoodItemList from './components/userdashboard/FoodItemList';
import { UserProvider } from './UserContext'; // Import UserProvider

import './App.css';

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ownerDashboard" element={<OwnerDashboard />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/addRestaurant" element={<AddRestaurant />} />
          <Route path="/viewAllRestaurants" element={<ViewAllRestaurants />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/viewAllRestaurantCategories" element={<ViewAllRestaurantCategories />} />
          <Route path="/addFoodItem" element={<AddFoodItem />} />
          <Route path="/viewFoodItem" element={<ViewFoodItem />} />
          <Route path="/updateFoodItem" element={<UpdateFoodItem />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/food-and-cart/:restaurantId" element={<FoodItemList />} /> {/* Updated route for FoodItemList */}
          <Route path="/filledCart" element={<FilledCart />} /> {/* Route for FilledCart */}
          <Route path="/myOrder" element={<MyOrders />} /> {/* Route for MyOrders */}
          <Route path="/viewMenu/:restaurantId" element={<ViewMenu />} /> {/* Route for ViewMenu */}
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to home for undefined routes */}
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
