import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add your CSS styling here

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
