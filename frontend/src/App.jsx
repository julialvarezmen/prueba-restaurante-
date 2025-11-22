import React, { useState, useEffect } from 'react';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import ToastContainer from './components/common/ToastContainer';
import useToast from './hooks/useToast';

function App() {
  const [currentView, setCurrentView] = useState('client'); // 'client', 'admin', 'admin-login', 'client-admin'
  const [adminUser, setAdminUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Obtener la última vista guardada
    const lastView = localStorage.getItem('lastView') || 'client';
    
    // Verificar tokens de ambas sesiones
    const adminToken = localStorage.getItem('adminToken');
    const clientToken = localStorage.getItem('clientToken');
    const savedAdmin = localStorage.getItem('adminUser');
    
    // PRIORIDAD: Si la última vista era client, SIEMPRE mostrar client
    // Esto previene que un cliente sea redirigido a admin si hay token de admin en localStorage
    if (lastView === 'client') {
      setCurrentView('client');
      return;
    }
    
    // Solo si la última vista era admin o client-admin, verificar token de admin
    if (lastView === 'admin' || lastView === 'client-admin') {
      if (adminToken && savedAdmin) {
        try {
          const user = JSON.parse(savedAdmin);
          if (user.role === 'ADMIN') {
            setAdminUser(user);
            // Restaurar la vista exacta que estaba usando
            setCurrentView(lastView === 'client-admin' ? 'client-admin' : 'admin');
            return;
          }
        } catch (e) {
          // Token inválido, limpiar
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminToken');
        }
      }
      // Si no hay token de admin válido pero la última vista era admin, ir a login
      if (lastView === 'admin') {
        setCurrentView('admin-login');
        return;
      }
    }
    
    // Por defecto, mostrar vista de cliente
    setCurrentView('client');
    localStorage.setItem('lastView', 'client');
  }, []);

  const handleAdminLoginSuccess = (user) => {
    setAdminUser(user);
    setCurrentView('admin');
    localStorage.setItem('lastView', 'admin');
  };

  const handleAdminLogout = () => {
    // Solo remover token y datos de admin, no afectar cliente
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setCurrentView('admin-login');
    // Si había una vista guardada de admin, limpiarla
    const lastView = localStorage.getItem('lastView');
    if (lastView === 'admin' || lastView === 'client-admin') {
      localStorage.setItem('lastView', 'client');
    }
  };

  const handleSwitchToAdmin = () => {
    if (adminUser) {
      setCurrentView('admin');
      localStorage.setItem('lastView', 'admin');
    } else {
      setCurrentView('admin-login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      {currentView === 'client' ? (
        <ClientPage 
          switchToAdmin={handleSwitchToAdmin} 
          toast={toast}
          adminUser={null}
          isAdminView={false}
        />
      ) : currentView === 'client-admin' ? (
        <ClientPage 
          switchToAdmin={handleSwitchToAdmin} 
          toast={toast}
          adminUser={adminUser}
          isAdminView={true}
        />
      ) : currentView === 'admin-login' ? (
        <AdminLogin onLoginSuccess={handleAdminLoginSuccess} toast={toast} />
      ) : (
        <AdminPage 
          switchToClient={() => {
            // Cuando se cambia a vista cliente desde admin, mantener la sesión del admin
            setCurrentView('client-admin');
            localStorage.setItem('lastView', 'client-admin');
          }}
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          toast={toast}
        />
      )}
    </div>
  );
}

export default App;
                         