import React from 'react';
import { Menu, ShoppingCart, User } from 'lucide-react';

const ClientLayout = ({ children, user, cartCount, onLogin, onCartClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Menu className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Restaurante Delicioso</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{user ? user.name : 'Iniciar Sesión'}</span>
              </button>

              {cartCount > 0 && (
                <div className="relative">
                  <button
                    onClick={onCartClick}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  </button>
                </div>
              )}
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

export default ClientLayout;
