import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext'; // Import useUser hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './MyOrders.css';

const MyOrders = () => {
  const { loggedInUser } = useUser(); // Access logged-in user from context
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      
      axios.get(`http://localhost:8081/restaurant/get/${loggedInUser.id}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setError(null)
            setRestaurants(response.data);
          } else {
            setError('Failed to fetch restaurants: Unexpected data format.');
          }
          setLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch restaurants.');
          setLoading(false);
        });
    } else {
      console.log("Here")
      setError('User ID is not available.');
      setLoading(false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (selectedRestaurantId) {
      setOrdersLoading(true);
      axios.get(`http://localhost:8082/order/restaurant/${selectedRestaurantId}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setOrders(response.data);
          } else {
            setError('Failed to fetch orders: Unexpected data format.');
          }
          setOrdersLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch orders.');
          setOrdersLoading(false);
        });
    }
  }, [selectedRestaurantId]);

  const handleRestaurantSelect = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
  };

  const handleStatusUpdate = (orderId) => {
    axios.put(`http://localhost:8082/order/updateStatus/${orderId}`, {
      orderStatus: 'CONFIRMED'
    })
      .then(response => {
        if (response.status === 200) {
          setOrders(orders.map(order =>
            order.id === orderId ? { ...order, orderStatus: 'CONFIRMED' } : order
          ));
        }
      })
      .catch(error => {
        setError('Failed to update order status.');
      });
  };

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="my-orders">
      <button className="back-button" onClick={() => navigate('/ownerDashboard')}>
        &larr; Back to Dashboard
      </button>
      <h2>My Orders</h2>

      <div className="restaurant-list">
        <h3>Select Restaurant</h3>
        <select onChange={(e) => handleRestaurantSelect(e.target.value)} value={selectedRestaurantId || ''}>
          <option value="">Select a restaurant</option>
          {restaurants.map(restaurant => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.restaurantName || 'No name available'}
            </option>
          ))}
        </select>
      </div>

      {selectedRestaurantId && (
        <div className="order-list">
          <h3>Orders for Selected Restaurant</h3>
          {ordersLoading ? (
            <div className="loading">Loading orders...</div>
          ) : orders.length > 0 ? (
            <div className="order-cards">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <h4>Order ID: {order.id}</h4>
                  <div className="order-details">
                    {order.orderDetails.length > 0 ? (
                      <ul>
                        {order.orderDetails.map((item, index) => (
                          <li key={index}>
                            {item.foodItemName} (x{item.quantity}) - Rs.{item.price}
                          </li>
                        ))}
                      </ul>
                    ) : 'No details available'}
                  </div>
                  <p>Total Amount: Rs.{order.orderDetails.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)}</p>
                  <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                  <p>Status: 
                    <span 
                      className={`status ${order.orderStatus.toLowerCase()}`}
                    >
                      {order.orderStatus === 'CANCELLED' ? 'Cancelled' : 
                        order.orderStatus === 'CONFIRMED' ? 'Confirmed' : 
                        'Pending'
                      }
                    </span>
                  </p>
                  {order.orderStatus === 'PENDING' && (
                    <button className="complete" onClick={() => handleStatusUpdate(order.id)}>Complete</button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No orders available for the selected restaurant.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
