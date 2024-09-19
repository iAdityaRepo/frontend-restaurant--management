import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../UserContext'; // Correct path to UserContext
import './Navbar.css';
import logo from '../../assets/images/icon.png'; // Ensure this path is correct
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
    const { loggedInUser, logout } = useUser(); // Use loggedInUser and logout from UserContext
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Call the logout function from context
        navigate('/'); // Redirect to home page after logout
    };

    const handleDashboardClick = (e) => {
        e.preventDefault(); // Prevent default link behavior to handle the click manually
        if (!loggedInUser) {
            navigate('/login?alert=please_login'); // Redirect to login with query parameter
        } else if (loggedInUser.role === 'USER') {
            navigate('/userDashboard'); // Redirect to user dashboard if role is USER
        } else if (loggedInUser.role === 'OWNER') {
            navigate('/ownerDashboard'); // Redirect to owner dashboard if role is OWNER
        }
    };

    const handleCartClick = () => {
        if (!loggedInUser) {
            navigate('/login?alert=please_login'); // Redirect to login with query parameter
        } else {
            navigate('/cart'); // Redirect to cart if logged in
        }
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
                <li>
                    {/* Dashboard link handles click to either navigate or show toast */}
                    <Link to="#" className="dashboard-link" onClick={handleDashboardClick}>
                        Dashboard
                    </Link>
                </li>
                {loggedInUser ? (
                    <>
                        {loggedInUser?.role === 'USER' && (
                            <li>
                                <Link to="/cart" className="cart-icon-link">
                                    <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                                </Link>
                            </li>
                        )}
                        <li>
                            <button className="logout-icon" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} size="lg" className="logout-button-icon" />
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <button className="cart-icon-link" onClick={handleCartClick}>
                            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                        </button>
                    </li>
                )}
            </ul>
            <ToastContainer />
        </nav>
    );
};

export default Navbar;
