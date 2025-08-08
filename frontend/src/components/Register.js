import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors([]);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccess(false);

    try {
      await authAPI.register(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        address: ''
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map(err => err.msg));
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Registration failed. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#667eea' }}>
        Register
      </h2>

      {success && (
        <div className="alert alert-success">
          Registration successful! You can now login with your credentials.
        </div>
      )}

      {errors.length > 0 && (
        <div className="error-list">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            placeholder="Minimum 20 characters, Maximum 60 characters"
            required
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            {formData.name.length}/60 characters (min: 20)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            placeholder="8-16 chars, 1 uppercase, 1 special character"
            required
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            Must be 8-16 characters with at least one uppercase letter and one special character
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="Maximum 400 characters"
            style={{ resize: 'vertical' }}
            required
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            {formData.address.length}/400 characters
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;