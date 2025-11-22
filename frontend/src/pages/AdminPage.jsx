import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import OrderManagement from '../components/admin/OrderManagement';
import ProductManagement from '../components/admin/ProductManagement';
import CustomerManagement from '../components/admin/CustomerManagement';
import StatsCard from '../components/admin/StatsCard';
import { adminAPI, productsAPI } from '../utils/api';
import { Package2, DollarSign, Edit, User } from 'lucide-react';

const AdminPage = ({ switchToClient, adminUser, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ todayOrders: 0, todayRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('orders'); // 'orders', 'products', 'customers'

  // Load real data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadOrders(), loadCustomers()]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await adminAPI.getAllCustomers();
      const customersList = data.customers || data || [];
      setCustomers(customersList);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data.products || data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await adminAPI.getAllOrders();
      const ordersList = data.orders || data || [];
      setOrders(ordersList);
      calculateStats(ordersList);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  const calculateStats = (ordersList) => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = ordersList.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === today;
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

    setStats({
      todayOrders: todayOrders.length,
      todayRevenue: todayRevenue
    });
  };

  const handleAdminOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      // Recargar pedidos después de actualizar
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    // Nota: La API no tiene endpoint de delete, pero podemos marcarlo como no disponible
    try {
      await adminAPI.updateProduct(productId, { isAvailable: false });
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await adminAPI.createProduct(productData);
      await loadProducts();
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar el producto: ' + (error.response?.data?.detail || error.message));
      return false;
    }
  };

  const handleEditProduct = async (productId, productData) => {
    try {
      await adminAPI.updateProduct(productId, productData);
      await loadProducts();
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto: ' + (error.response?.data?.detail || error.message));
      return false;
    }
  };

  if (loading) {
    return (
      <AdminLayout switchToClient={switchToClient} adminUser={adminUser} onLogout={onLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout switchToClient={switchToClient} adminUser={adminUser} onLogout={onLogout}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Panel de Control</h3>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveView('orders')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  activeView === 'orders'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package2 className="w-4 h-4" />
                <span>Pedidos</span>
              </button>
              <button
                onClick={() => setActiveView('products')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  activeView === 'products'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Edit className="w-4 h-4" />
                <span>Productos</span>
              </button>
              <button
                onClick={() => setActiveView('customers')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  activeView === 'customers'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Clientes</span>
              </button>
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
          {activeView === 'orders' && (
            <OrderManagement
              orders={orders}
              onStatusChange={handleAdminOrderStatus}
            />
          )}

          {activeView === 'products' && (
            <ProductManagement
              products={products}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeView === 'customers' && (
            <CustomerManagement
              customers={customers}
              loading={loading}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
