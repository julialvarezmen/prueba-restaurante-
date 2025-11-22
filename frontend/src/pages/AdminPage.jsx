import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import OrderManagement from '../components/admin/OrderManagement';
import ProductManagement from '../components/admin/ProductManagement';
import StatsCard from '../components/admin/StatsCard';
import { Package2, DollarSign, Edit, User } from 'lucide-react';


const AdminPage = ({ switchToClient }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ todayOrders: 0, todayRevenue: 0 });

  // Mock data initialization
  useEffect(() => {
    setProducts([
      { id: '1', name: 'Hamburguesa Gourmet', description: 'Carne premium, queso cheddar, lechuga, tomate', price: 12.99, image: 'https://placehold.co/300x200/FF6B6B/FFFFFF?text=Hamburguesa', category: 'Principal', isAvailable: true },
      { id: '2', name: 'Pizza Margarita', description: 'Mozzarella, albahaca fresca, salsa de tomate', price: 10.99, image: 'https://placehold.co/300x200/4ECDC4/FFFFFF?text=Pizza', category: 'Principal', isAvailable: true },
      { id: '3', name: 'Ensalada César', description: 'Lechuga romana, pollo a la parrilla, crutones', price: 8.99, image: 'https://placehold.co/300x200/45B7D1/FFFFFF?text=Ensalada', category: 'Entrante', isAvailable: true },
      { id: '4', name: 'Tiramisú', description: 'Postre italiano con café y mascarpone', price: 6.99, image: 'https://placehold.co/300x200/F7DC6F/FFFFFF?text=Tiramisu', category: 'Postre', isAvailable: true },
      { id: '5', name: 'Sopa de Tomate', description: 'Sopa casera con hierbas frescas', price: 5.99, image: 'https://placehold.co/300x200/FF8A65/FFFFFF?text=Sopa', category: 'Entrante', isAvailable: true },
      { id: '6', name: 'Pasta Carbonara', description: 'Pasta fresca con beicon y queso parmesano', price: 11.99, image: 'https://placehold.co/300x200/BA68C8/FFFFFF?text=Pasta', category: 'Principal', isAvailable: true }
    ]);

    setOrders([
      { id: 'ORD-001', items: [{ productId: '1', name: 'Hamburguesa Gourmet', quantity: 2, price: 12.99 }], total: 25.98, status: 'completed', date: '2025-11-20', customer: 'Juan Pérez', phone: '123456789', email: 'juan@example.com', address: 'Calle Principal 123, Madrid', paymentMethod: 'CARD' },
      { id: 'ORD-002', items: [{ productId: '2', name: 'Pizza Margarita', quantity: 1, price: 10.99 }], total: 10.99, status: 'pending', date: '2025-11-21', customer: 'María García', phone: '987654321', email: 'maria@example.com', address: 'Avenida Secundaria 456, Barcelona', paymentMethod: 'CASH' },
      { id: 'ORD-003', items: [{ productId: '3', name: 'Ensalada César', quantity: 1, price: 8.99 }], total: 8.99, status: 'preparing', date: '2025-11-22', customer: 'Carlos López', phone: '456789123', email: 'carlos@example.com', address: 'Calle Tercera 789, Valencia', paymentMethod: 'CARD' }
    ]);

    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => order.date === today);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    setStats({
      todayOrders: todayOrders.length,
      todayRevenue: todayRevenue
    });
  }, []);

  const handleAdminOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleAddProduct = () => {
    alert('Funcionalidad de agregar producto');
  };

  const handleEditProduct = (product) => {
    alert(`Editar producto: ${product.name}`);
  };

  return (
    <AdminLayout switchToClient={switchToClient}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Panel de Control</h3>
            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-2 p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Package2 className="w-4 h-4" />
                <span>Pedidos</span>
              </a>
              <a href="#" className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <DollarSign className="w-4 h-4" />
                <span>Finanzas</span>
              </a>
              <a href="#" className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Edit className="w-4 h-4" />
                <span>Productos</span>
              </a>
              <a href="#" className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <User className="w-4 h-4" />
                <span>Clientes</span>
              </a>
            </nav>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 space-y-4">
            <StatsCard
              title="Pedidos Hoy"
              value={stats.todayOrders}
              icon={Package2}
              color="bg-blue-100"
            />
            <StatsCard
              title="Ingresos Hoy"
              value={`$${stats.todayRevenue.toFixed(2)}`}
              icon={DollarSign}
              color="bg-green-100"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <OrderManagement
            orders={orders}
            onStatusChange={handleAdminOrderStatus}
          />

          <div className="mt-8">
            <ProductManagement
              products={products}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
        </div>
      </div>
      
      {/* Botón flotante para cambiar a vista cliente */}
      <button
        onClick={switchToClient}
        className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        Ir a Vista Cliente
      </button>
    </AdminLayout>
  );
};

export default AdminPage;
