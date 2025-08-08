import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import StoreDashboard from './components/StoreDashboard';

function AppContent() {
  const { isAuthenticated, isAdmin, isUser, isStoreOwner } = useAuth();

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isUser) {
    return <UserDashboard />;
  }

  if (isStoreOwner) {
    return <StoreDashboard />;
  }

  return null;
}

function AuthContainer() {
  const [showRegister, setShowRegister] = React.useState(false);

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Store Rating System</h1>
        <p style={{ color: '#666' }}>Rate and review stores in your area</p>
      </div>
      
      {showRegister ? (
        <div>
          <Register />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span>Already have an account? </span>
            <button 
              className="btn btn-primary btn-small"
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Login />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span>Don't have an account? </span>
            <button 
              className="btn btn-primary btn-small"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;