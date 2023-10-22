import React, { useState } from 'react';
import './ContactUs.css'; 

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      name: name,
      email: email,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/contacts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (response.status === 200) {
        setSubmitted(true);
        setName('');
        setEmail('');
      } else {
        // Handle error responses here.
      }
    } catch (error) {
      // Handle network or other errors here.
    }
  };
  return (
    <div className="contact-form">
      <h2>Contact Us</h2>
      {submitted ? (
        <p>Thank you for contacting us!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}