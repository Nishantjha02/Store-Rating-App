import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storeAPI } from '../services/api';

const StoreDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    password: ''
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await storeAPI.getDashboard();
      setDashboardData(response.data);
      setRatings(response.data.ratings || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      await storeAPI.updatePassword(passwordForm);
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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star empty'}>
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
          <div className="logo">Store Dashboard</div>
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
        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : dashboardData ? (
          <div>
            {/* Store Information */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3>{dashboardData.store?.name || 'Store Name'}</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>Store Details</h4>
                    <p><strong>Email:</strong> {dashboardData.store?.email || 'N/A'}</p>
                    <p><strong>Address:</strong> {dashboardData.store?.address || 'N/A'}</p>
                    <p><strong>Member Since:</strong> 
                      {dashboardData.store?.created_at 
                        ? new Date(dashboardData.store.created_at).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>Rating Overview</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                        {Number(dashboardData.averageRating || 0).toFixed(1)}
                      </span>
                      {renderStars(Math.round(Number(dashboardData.averageRating || 0)))}
                    </div>
                    <p><strong>Total Ratings:</strong> {ratings.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings List */}
            <div className="card">
              <div className="card-header">
                <h3>Customer Ratings & Reviews</h3>
              </div>
              <div className="card-body">
                {ratings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    <h4>No ratings yet</h4>
                    <p>Your store hasn't received any ratings yet. Once customers start rating your store, you'll see them here.</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Rating</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ratings.map((rating, index) => (
                          <tr key={index}>
                            <td><strong>{rating.user_name || 'Anonymous'}</strong></td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {renderStars(Number(rating.rating) || 0)}
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                  ({Number(rating.rating) || 0}/5)
                                </span>
                              </div>
                            </td>
                            <td>
                              {rating.created_at 
                                ? new Date(rating.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Distribution */}
            {ratings.length > 0 && (
              <div className="card" style={{ marginTop: '2rem' }}>
                <div className="card-header">
                  <h3>Rating Distribution</h3>
                </div>
                <div className="card-body">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratings.filter(r => Number(r.rating) === star).length;
                    const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                    
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ minWidth: '60px' }}>{star} Star{star !== 1 ? 's' : ''}</span>
                        <div style={{ 
                          flex: 1, 
                          height: '20px', 
                          backgroundColor: '#e9ecef', 
                          borderRadius: '10px',
                          overflow: 'hidden'
                        }}>
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              backgroundColor: '#ffc107',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                        <span style={{ minWidth: '80px', textAlign: 'right' }}>
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <h3>Store not found</h3>
            <p>Unable to load store information. Please contact support.</p>
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

export default StoreDashboard;
