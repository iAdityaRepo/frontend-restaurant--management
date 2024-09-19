import React, { useState } from 'react';
import axios from 'axios';
import './ContactUsPage.css'; // Import CSS for styling

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [showCheckmark, setShowCheckmark] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const validateForm = () => {
    const errors = {};
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    // Subject validation
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Exit if validation fails
    }
    try {
      await axios.post('http://localhost:8080/user/contactus', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResponseMessage('Message sent successfully!');
      setShowCheckmark(true);
      setTimeout(() => {
        setShowCheckmark(false); // Hide checkmark after 1.5 seconds
      }, 1500);
      setFormData({ name: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      setResponseMessage('Error sending message');
      console.error('Error details:', error);
    }
  };
  return (
    <div className="contact-us-page">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className='form'>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {validationErrors.name && (
            <span className="error">{validationErrors.name}</span>
          )}
        </label>
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          {validationErrors.subject && (
            <span className="error">{validationErrors.subject}</span>
          )}
        </label>
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          {validationErrors.message && (
            <span className="error">{validationErrors.message}</span>
          )}
        </label>
        <button type="submit">Send</button>
      </form>
      {responseMessage && (
        <div>
          <p className="response-message">{responseMessage}</p>
          <div className={`checkmark ${showCheckmark ? 'show' : ''}`} />
        </div>
      )}
    </div>
  );
};
export default ContactUsPage;