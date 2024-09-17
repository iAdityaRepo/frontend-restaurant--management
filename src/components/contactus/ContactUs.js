import React, { useState } from 'react';
import axios from 'axios';
import './ContactUs.css'; // Import CSS for styling

const ContactUs = () => {
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const validateForm = () => {
    if (!message || message.trim().length < 10) {
      setValidationError('Message must be at least 10 characters long');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await axios.post('http://localhost:8080/user/send', null, {
        params: {
          text: message
        },
      });
      setResponseMessage('Message sent successfully!');
      setShowCheckmark(true);
      setTimeout(() => {
        setShowCheckmark(false);
      }, 1500);
      setMessage(''); // Clear message field after submission
    } catch (error) {
      setResponseMessage('Error sending message');
      console.error('Error details:', error);
    }
  };

  return (
    <div className="contact-us-page">
      <h1 className="contact-us-page__title">Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-us-page__form">
        <label className="contact-us-page__label">
          Message:
          <textarea
            name="message"
            value={message}
            onChange={handleChange}
            required
            className="contact-us-page__textarea"
          />
          {validationError && (
            <span className="contact-us-page__error">{validationError}</span>
          )}
        </label>
        <button type="submit" className="contact-us-page__button">Send</button>
      </form>
      {responseMessage && (
        <div>
          <p className="contact-us-page__response-message">{responseMessage}</p>
          <div className={`contact-us-page__checkmark ${showCheckmark ? 'contact-us-page__checkmark--show' : ''}`} />
        </div>
      )}
    </div>
  );
};

export default ContactUs;
