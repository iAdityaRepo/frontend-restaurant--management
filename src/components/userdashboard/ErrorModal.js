import React from 'react';
import './ErrorModal.css'; // Add any necessary styles for the modal

const ErrorModal = ({ errorMessage, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Error</h3>
        <p>{errorMessage}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default ErrorModal;
