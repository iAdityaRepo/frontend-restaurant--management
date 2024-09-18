// SuccessModal.js
import React from 'react';
import './SuccessModal.css'; // Optional: Add CSS to style the modal

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default SuccessModal;
