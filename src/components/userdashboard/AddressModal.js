import React, { useState } from 'react';
import { useUser } from '../../UserContext'; // Adjust the import path if necessary
import axios from 'axios';
import './AddressModal.css';

const AddressModal = ({ onClose, onSave }) => {
  const { loggedInUser } = useUser();
  const userId = loggedInUser?.id;

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      console.error('User is not logged in.');
      return;
    }

    let formErrors = {};
    if (!street) formErrors.street = 'Street is required';
    if (!city) formErrors.city = 'City is required';
    if (!state) formErrors.state = 'State is required';
    if (!pinCode || pinCode.length !== 6) formErrors.pinCode = 'Pin code must be 6 digits';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const newAddress = {
      userId,
      street,
      city,
      state,
      pinCode,
    };

    try {
      setSaving(true);
      const response = await axios.post('http://localhost:8080/address/add', newAddress);
      if (typeof onSave === 'function') {
        // Assuming the response contains the address with a unique ID
        onSave(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error adding address:', error);
      setErrors({ ...errors, api: 'Failed to add address. Please try again later.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="address-modal">
      <div className="address-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add New Address</h2>
        <div>
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          {errors.street && <div className="error-message">{errors.street}</div>}
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {errors.city && <div className="error-message">{errors.city}</div>}
        </div>
        <div>
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          {errors.state && <div className="error-message">{errors.state}</div>}
        </div>
        <div>
          <label htmlFor="pinCode">Pin Code:</label>
          <input
            type="text"
            id="pinCode"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
          />
          {errors.pinCode && <div className="error-message">{errors.pinCode}</div>}
        </div>
        {errors.api && <div className="error-message">{errors.api}</div>}
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default AddressModal;
