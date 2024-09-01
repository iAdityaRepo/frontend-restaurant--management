import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add your CSS styling here

// Import the image
import logo from '../../assets/images/icon.jpg'; // Ensure this path is correct

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logo} alt="Logo" className="navbar-icon" />
                <span className="navbar-title">FoodGram</span>
            </div>
            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
