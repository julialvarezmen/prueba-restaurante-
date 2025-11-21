import React from 'react';
import { Package, User } from 'lucide-react';

const AdminLayout = ({ children, switchToClient }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={switchToClient}
                className="text-gray-600 hover:text-blue-600 font-semibold"
              >
                Cliente
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Administrador</p>
                <p className="text-xs text-gray-600">admin@restaurante.com</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
