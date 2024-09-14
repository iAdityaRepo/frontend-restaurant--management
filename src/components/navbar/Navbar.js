import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../UserContext'; // Correct path to UserContext
import './Navbar.css';
import logo from '../../assets/images/icon.png'; // Ensure this path is correct

const Navbar = () => {
    const { loggedInUser, logout } = useUser(); // Use loggedInUser and logout from UserContext
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Call the logout function from context
        navigate('/'); // Redirect to home page after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logo} alt="Logo" className="navbar-icon" />
                <span className="navbar-title">FoodGram</span>
            </div>

            {/* Right-aligned menu */}
            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>
                {!loggedInUser && (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
                <li><Link to="/contact">Contact Us</Link></li>
                {loggedInUser ? (
                    <>
                        <li>
                            <Link to="/cart" className="cart-icon-link">
                                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                            </Link>
                        </li>
                        <li>
                            <button className="logout-icon" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} size="lg" className="logout-button-icon" />
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link to="/cart" className="cart-icon-link">
                            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
