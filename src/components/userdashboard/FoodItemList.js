import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import './FoodItemList.css';
import AddressModal from './AddressModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const fetchCartItems = async () => {
      if (userId) {
        setError(null)
        try {
          const response = await axios.get('http://localhost:8082/cart/getAll', {
            params: { restaurantId, userId },
          });
          setCartItems(response.data);

          const initialQuantities = response.data.reduce((acc, item) => {
            acc[item.foodItemId] = item.quantity;
            return acc;
          }, {});
          setQuantities(initialQuantities); // Initialize quantities from cart
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setError('Failed to fetch cart items.');
        }
      } else {
        setError('User not logged in.');
      }
    };

    const fetchFoodItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8081/foodItem/getAll/${restaurantId}`);
        setFoodItems(response.data);

        setQuantities((prevQuantities) =>
          response.data.reduce((acc, item) => {
            acc[item.id] = prevQuantities[item.id] || 0;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching food items:', error);
        setError('Failed to fetch food items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems().then(fetchFoodItems);
  }, [restaurantId, userId]);

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

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

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

  const handleRemoveFromCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8082/cart/${cartId}`);
      setCartItems(cartItems.filter((item) => item.id !== cartId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Failed to remove item from cart.');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('User not logged in.');
      return;
    }

    if (!selectedAddressId) {
      setError('Please select or add an address.');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const cartIds = cartItems.map((item) => item.id);

    try {
      const response = await axios.post('http://localhost:8082/order/create', {
        userId,
        restaurantId,
        addressId: selectedAddressId,
        cartIds,
        totalAmount,
        orderStatus: 'PENDING',
      });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/userDashboard');
      }, 4000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to place order.';
      toast.error(errorMessage);
    }
  };

  const handleAddAddress = async (newAddress) => {
    try {
      await axios.post('http://localhost:8080/address/add', newAddress);
      fetchAddresses();
      setSelectedAddressId(newAddress.addressId);
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add address.');
    } finally {
      setShowAddressModal(false);
    }
  };

  const handleAddressDropdownClick = async () => {
    await fetchAddresses();
  };

  if (loading) return <div className="loading">Loading food items...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="food-item-list-container">
      <div className="food-item-list">
        <h3>Food Items for Selected Restaurant</h3>
        {foodItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Food Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
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
                  <td>Rs. {item.price.toFixed(2)}</td>
                  <td>
                    {item.imageData ? (
                      <img
                        src={`data:image/jpeg;base64,${item.imageData}`}
                        alt={item.foodItemName}
                        className="food-image"
                      />
                    ) : (
                      <div className="no-image">No image available</div>
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
                    <button id="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                      Add to Cart
                    </button>
                    {addSuccess[item.id] && <div className="success-message">{addSuccess[item.id]}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No food items found.</p>
        )}
      </div>

      <div className="cart-item-list">
        <h3>Your Cart</h3>
        {cartItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Food Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.foodItemName || 'No name available'}</td>
                  <td>{item.quantity || 0}</td>
                  <td>Rs. {item.price.toFixed(2)}</td>
                  <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className='cart-remove-btn' onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className="address-selection">
        <h3>Select Address</h3>
        <select
          value={selectedAddressId || ''}
          onChange={(e) => setSelectedAddressId(Number(e.target.value))}
          onClick={handleAddressDropdownClick}
          id='address-select'
        >
          <option value="">Select Address</option>
          {addresses.map((address) => (
            <option key={address.addressId} value={address.addressId}>
              {`${address.street}, ${address.city}, ${address.state}, ${address.pinCode}`}
            </option>
          ))}
        </select>
        <button className='cart-action-btn' onClick={() => setShowAddressModal(true)}>Add New Address</button>
        <button className='cart-action-btn' onClick={handlePlaceOrder}>Place Order</button>
      </div>

      {/* <div className="place-order-button">
      </div> */}

      {showAddressModal && (
        <AddressModal onAddAddress={handleAddAddress} onClose={() => setShowAddressModal(false)} />
      )}

      <ToastContainer />
    </div>
  );
};

export default FoodItemList;
