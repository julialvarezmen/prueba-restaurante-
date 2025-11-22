import React, { useState, useEffect } from 'react';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import ToastContainer from './components/common/ToastContainer';
import useToast from './hooks/useToast';

function App() {
  const [currentView, setCurrentView] = useState('client'); // 'client', 'admin', 'admin-login'
  const [adminUser, setAdminUser] = useState(null);
  const toast = useToast();

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
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      {currentView === 'client' ? (
        <ClientPage switchToAdmin={handleSwitchToAdmin} toast={toast} />
      ) : currentView === 'admin-login' ? (
        <AdminLogin onLoginSuccess={handleAdminLoginSuccess} toast={toast} />
      ) : (
        <AdminPage 
          switchToClient={() => setCurrentView('client')}
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          toast={toast}
        />
      )}
    </div>
  );
}

export default App;
                         