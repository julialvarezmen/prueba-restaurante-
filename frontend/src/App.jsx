import React, { useState, useEffect } from 'react';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [currentView, setCurrentView] = useState('client'); // 'client', 'admin', 'admin-login'
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Verificar si hay un admin autenticado al cargar
    const token = localStorage.getItem('token');
    const savedAdmin = localStorage.getItem('adminUser');
    
    if (token && savedAdmin) {
      try {
        const user = JSON.parse(savedAdmin);
        if (user.role === 'ADMIN') {
          setAdminUser(user);
        }
      } catch (e) {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleAdminLoginSuccess = (user) => {
    setAdminUser(user);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setCurrentView('admin-login');
  };

  const handleSwitchToAdmin = () => {
    if (adminUser) {
      setCurrentView('admin');
    } else {
      setCurrentView('admin-login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'client' ? (
        <ClientPage switchToAdmin={handleSwitchToAdmin} />
      ) : currentView === 'admin-login' ? (
        <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
      ) : (
        <AdminPage 
          switchToClient={() => setCurrentView('client')}
          adminUser={adminUser}
          onLogout={handleAdminLogout}
        />
      )}
    </div>
  );
}

export default App;
                         