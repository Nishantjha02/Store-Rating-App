import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const [filters, setFilters] = useState({
    name: '',
    address: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [passwordForm, setPasswordForm] = useState({
    password: ''
  });

  useEffect(() => {
    loadStores();
  }, [filters]);

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getStores(filters);
      setStores(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setSelectedRating(store.user_rating);
    setShowRatingModal(true);
    setErrors([]);
    setSuccess('');
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedStore(null);
    setSelectedRating(0);
    setHoverRating(0);
    setErrors([]);
    setSuccess('');
  };

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) {
      setErrors(['Please select a rating']);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const isUpdate = selectedStore.user_rating > 0;
      if (isUpdate) {
        await userAPI.updateRating({
          storeId: selectedStore.id,
          rating: selectedRating
        });
      } else {
        await userAPI.submitRating({
          storeId: selectedStore.id,
          rating: selectedRating
        });
      }
      
      setSuccess(`Rating ${isUpdate ? 'updated' : 'submitted'} successfully!`);
      loadStores();
      setTimeout(closeRatingModal, 1500);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map(err => err.msg));
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Failed to submit rating. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      await userAPI.updatePassword(passwordForm);
      setSuccess('Password updated successfully!');
      setPasswordForm({ password: '' });
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map(err => err.msg));
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Failed to update password. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, size = 'normal') => {
    const stars = [];
    const currentRating = interactive ? (hoverRating || selectedRating) : rating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= currentRating ? 'filled' : 'empty'} ${size === 'large' ? 'large' : ''}`}
          style={{
            fontSize: size === 'large' ? '2rem' : '1.2rem',
            cursor: interactive ? 'pointer' : 'default'
          }}
          onClick={interactive ? () => setSelectedRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          ★
        </span>
      );
    }
    return <div className="rating-display">{stars}</div>;
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">Store Rating System</div>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button 
              className="btn btn-secondary btn-small"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
            <button className="btn btn-secondary btn-small" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <h2 style={{ marginBottom: '2rem', color: '#667eea' }}>Available Stores</h2>

        {/* Filters */}
        <div className="filters">
          <div className="filter-row">
            <div className="form-group">
              <label>Store Name</label>
              <input
                type="text"
                className="form-control"
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
                placeholder="Search by store name"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                value={filters.address}
                onChange={(e) => setFilters({...filters, address: e.target.value})}
                placeholder="Search by address"
              />
            </div>
          </div>
        </div>

        {/* Stores Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th 
                    className={`sortable ${filters.sortBy === 'name' ? `sort-${filters.sortOrder}` : ''}`}
                    onClick={() => handleSort('name')}
                  >
                    Store Name
                  </th>
                  <th>Address</th>
                  <th>Overall Rating</th>
                  <th>Your Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      No stores found
                    </td>
                  </tr>
                ) : (
                  stores.map(store => (
                    <tr key={store.id}>
                      <td>
                        <strong>{store.name}</strong>
                      </td>
                      <td>{store.address}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {renderStars(Math.round(store.overall_rating))}
                          <span style={{ fontSize: '0.9rem', color: '#666' }}>
                            ({store.total_ratings} ratings)
                          </span>
                        </div>
                      </td>
                      <td>
                        {store.user_rating > 0 ? (
                          renderStars(store.user_rating)
                        ) : (
                          <span style={{ color: '#666', fontStyle: 'italic' }}>Not rated</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => openRatingModal(store)}
                        >
                          {store.user_rating > 0 ? 'Update Rating' : 'Rate Store'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="modal-overlay" onClick={closeRatingModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {selectedStore?.user_rating > 0 ? 'Update Rating' : 'Rate Store'}
                </h3>
                <button className="close-btn" onClick={closeRatingModal}>×</button>
              </div>

              {success && (
                <div className="alert alert-success">{success}</div>
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

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#667eea' }}>
                  {selectedStore?.name}
                </h4>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  Click on the stars to rate this store
                </p>
                
                {renderStars(selectedRating, true, 'large')}
                
                <div style={{ marginTop: '1rem' }}>
                  {selectedRating > 0 && (
                    <p style={{ color: '#667eea', fontWeight: '500' }}>
                      You selected: {selectedRating} star{selectedRating !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
                  onClick={closeRatingModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleRatingSubmit}
                  disabled={loading || selectedRating === 0}
                >
                  {loading ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Change Password</h3>
                <button className="close-btn" onClick={() => setShowPasswordModal(false)}>×</button>
              </div>

              {success && (
                <div className="alert alert-success">{success}</div>
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

              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm({password: e.target.value})}
                    placeholder="8-16 chars, 1 uppercase, 1 special character"
                    required
                  />
                  <small style={{ color: '#666', fontSize: '0.8rem' }}>
                    Must be 8-16 characters with at least one uppercase letter and one special character
                  </small>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPasswordModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;