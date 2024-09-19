import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import './FoodItemList.css';
import AddressModal from './AddressModal';  // Import the new component

const FoodItemList = () => {
  const { restaurantId } = useParams();
  const { loggedInUser } = useUser();
  const userId = loggedInUser?.id;
  const [foodItems, setFoodItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [addError, setAddError] = useState({});
  const [addSuccess, setAddSuccess] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8081/foodItem/getAll/${restaurantId}`);
        setFoodItems(response.data);

        const initialQuantities = response.data.reduce((acc, item) => {
          acc[item.id] = 0;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching food items:', error);
        setError('Failed to fetch food items.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCartItems = async () => {
      if (userId) {
        try {
          const response = await axios.get('http://localhost:8082/cart/getAll', {
            params: { restaurantId, userId },
          });
          setCartItems(response.data);
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setError('Failed to fetch cart items.');
        }
      } else {
        setError('User not logged in.');
      }
    };

    const fetchAddresses = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8080/address/get/${userId}`);
          setAddresses(response.data);
        } catch (error) {
          console.error('Error fetching addresses:', error);
          setError('Failed to fetch addresses.');
        }
      }
    };

    fetchFoodItems();
    fetchCartItems();
    fetchAddresses();
  }, [restaurantId, userId]);

  const handleQuantityChange = (id, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max(0, value),
    }));
  };

  const handleAddToCart = async (item) => {
    const quantity = quantities[item.id] || 0;

    if (quantity > 0) {
      const cartInDto = {
        userId,
        restaurantId,
        foodItemId: item.id,
        quantity,
        price: item.price,
      };

      try {
        await axios.post('http://localhost:8082/cart/addCart', cartInDto);
        setAddSuccess((prevSuccess) => ({ ...prevSuccess, [item.id]: 'Added to cart successfully!' }));
        setAddError((prevError) => ({ ...prevError, [item.id]: null }));

        // Fetch updated cart items after adding
        const response = await axios.get('http://localhost:8082/cart/getAll', {
          params: { restaurantId, userId },
        });
        setCartItems(response.data);

        setTimeout(() => {
          setAddSuccess((prevSuccess) => ({ ...prevSuccess, [item.id]: null }));
        }, 3000);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        setAddError((prevError) => ({ ...prevError, [item.id]: 'Failed to add item to cart.' }));
        setAddSuccess((prevSuccess) => ({ ...prevSuccess, [item.id]: null }));
      }
    } else {
      setAddError((prevError) => ({ ...prevError, [item.id]: 'Quantity must be greater than 0' }));
      setAddSuccess((prevSuccess) => ({ ...prevSuccess, [item.id]: null }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      setError('User not logged in.');
      return;
    }

    if (!selectedAddressId) {
      setError('Please select or add an address.');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Collect cart IDs
    const cartIds = cartItems.map(item => item.id);

    try {
      await axios.post('http://localhost:8082/order/create', {
        userId,
        restaurantId,
        addressId: selectedAddressId,
        cartIds,
        totalAmount,
        orderStatus: 'PENDING',
      });
      navigate('/order-confirmation'); // Redirect to order confirmation page
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order.');
    }
  };

  const handleAddAddress = (newAddress) => {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    setShowAddressModal(false);
    setSelectedAddressId(newAddress.addressId);
  };

  if (loading) return <div className="loading">Loading food items...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="food-item-list-container">
      <div className="food-item-list">
        <h3>Food Items for Selected Restaurant</h3>
        {foodItems.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {foodItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.foodName || 'No name available'}</td>
                    <td>{item.description || 'No description available'}</td>
                    <td>{item.categoryName || 'No category available'}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.available ? 'Available' : 'Not Available'}</td>
                    <td>
                      {item.imageData && (
                        <img
                          src={`data:image/jpeg;base64,${item.imageData}`}
                          alt={item.foodName}
                          className="food-image"
                        />
                      )}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={quantities[item.id]}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                      />
                      {addError[item.id] && <div className="error-message">{addError[item.id]}</div>}
                    </td>
                    <td>
                      <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                      {addSuccess[item.id] && (
                        <div className="success-message">{addSuccess[item.id]}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No food items found.</p>
        )}
      </div>

      <div className="cart-item-list">
        <h3>Your Cart</h3>
        {cartItems.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.foodItemId}>
                    <td>{item.foodName || 'No name available'}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="choose-address">
              <label htmlFor="address">Choose Address:</label>
              <select
                id="address"
                value={selectedAddressId || ''}
                onChange={(e) => setSelectedAddressId(Number(e.target.value))}
              >
                <option value="">Select an address</option>
                {addresses.map((address) => (
                  <option key={address.addressId} value={address.addressId}>
                    {address.street}, {address.city}, {address.state}, {address.pinCode}
                  </option>
                ))}
              </select>
              <button onClick={() => setShowAddressModal(true)}>Add New Address</button>
            </div>
            <button onClick={handlePlaceOrder}>Place Order</button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onSave={handleAddAddress}
        />
      )}
    </div>
  );
};

export default FoodItemList;
