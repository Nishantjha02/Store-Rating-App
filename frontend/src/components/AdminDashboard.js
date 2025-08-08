import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const [userFilters, setUserFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [storeFilters, setStoreFilters] = useState({
    name: '',
    email: '',
    address: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });

  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerEmail: '',
    ownerPassword: ''
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboard();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'stores') {
      loadStores();
    }
  }, [activeTab, userFilters, storeFilters]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers(userFilters);
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getStores(storeFilters);
      setStores(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field, type) => {
    if (type === 'users') {
      setUserFilters(prev => ({
        ...prev,
        sortBy: field,
        sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setStoreFilters(prev => ({
        ...prev,
        sortBy: field,
        sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
      }));
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setErrors([]);
    setSuccess('');
    if (type === 'user') {
      setUserForm({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
      });
    } else {
      setStoreForm({
        name: '',
        email: '',
        address: '',
        ownerEmail: '',
        ownerPassword: ''
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setErrors([]);
    setSuccess('');
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      await adminAPI.createUser(userForm);
      setSuccess('User created successfully!');
      loadUsers();
      setTimeout(closeModal, 2000);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map(err => err.msg));
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Failed to create user. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      await adminAPI.createStore(storeForm);
      setSuccess('Store created successfully!');
      loadStores();
      setTimeout(closeModal, 2000);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map(err => err.msg));
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Failed to create store. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">Admin Panel</div>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button className="btn btn-secondary btn-small" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <nav className="nav">
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
          <button className={`nav-link ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')}>Stores</button>
        </nav>

        {/* Dashboard */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="dashboard-stats">
            <div className="stat-card"><span className="stat-number">{dashboardData.totalUsers}</span><span className="stat-label">Total Users</span></div>
            <div className="stat-card"><span className="stat-number">{dashboardData.totalStores}</span><span className="stat-label">Total Stores</span></div>
            <div className="stat-card"><span className="stat-number">{dashboardData.totalRatings}</span><span className="stat-label">Total Ratings</span></div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <button className="btn btn-primary" onClick={() => openModal('user')}>+ Add User</button>
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name', 'users')}>Name</th>
                  <th onClick={() => handleSort('email', 'users')}>Email</th>
                  <th>Address</th>
                  <th onClick={() => handleSort('role', 'users')}>Role</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td>{u.role}</td>
                    <td>{u.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stores */}
        {activeTab === 'stores' && (
          <div>
            <button className="btn btn-primary" onClick={() => openModal('store')}>+ Add Store</button>
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name', 'stores')}>Name</th>
                  <th onClick={() => handleSort('email', 'stores')}>Email</th>
                  <th>Address</th>
                  <th>Owner Email</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>{s.owner_email}</td>
                    <td>{s.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{modalType === 'user' ? 'Add New User' : 'Add New Store'}</h3>
                <button onClick={closeModal}>×</button>
              </div>

              {success && <div className="alert alert-success">{success}</div>}
              {errors.length > 0 && <ul className="error-list">{errors.map((err, idx) => <li key={idx}>{err}</li>)}</ul>}

              {modalType === 'user' ? (
                <form onSubmit={handleUserSubmit}>
                  <input type="text" placeholder="Name" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required />
                  <input type="email" placeholder="Email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required />
                  <input type="password" placeholder="Password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required />
                  <textarea placeholder="Address" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} required />
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="store_owner">Store Owner</option>
                  </select>
                  <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button>
                </form>
              ) : (
                <form onSubmit={handleStoreSubmit}>
                  <input type="text" placeholder="Store Name" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} required />
                  <input type="email" placeholder="Store Email" value={storeForm.email} onChange={e => setStoreForm({...storeForm, email: e.target.value})} required />
                  <textarea placeholder="Address" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} required />
                  <input type="email" placeholder="Owner Email" value={storeForm.ownerEmail} onChange={e => setStoreForm({...storeForm, ownerEmail: e.target.value})} required />
                  <input type="password" placeholder="Owner Password" value={storeForm.ownerPassword} onChange={e => setStoreForm({...storeForm, ownerPassword: e.target.value})} required />
                  <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Store'}</button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
