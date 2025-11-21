import React, { useState } from 'react';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [currentView, setCurrentView] = useState('client'); // 'client' o 'admin'

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'client' ? (
        <ClientPage switchToAdmin={() => setCurrentView('admin')} />
      ) : (
        <AdminPage switchToClient={() => setCurrentView('client')} />
      )}
    </div>
  );
}

export default App;
                         