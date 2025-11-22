import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/client/ClientLayout';
import ProductCard from '../components/client/ProductCard';
import Cart from '../components/client/Cart';
import OrderForm from '../components/client/OrderForm';
import { authAPI, productsAPI, ordersAPI, addressesAPI } from '../utils/api';

const ClientPage = ({ switchToAdmin }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderForm, setOrderForm] = useState({
    notes: '',
    addressId: '',
    paymentMethod: 'CASH'
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '', phone: '' });
  const [categories, setCategories] = useState(['Todos', 'Principal', 'Entrante', 'Postre']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Load real data from API
  useEffect(() => {
    loadProducts();
    loadAddresses();
    loadOrders();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await authAPI.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
        localStorage.removeItem('token');
      }
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      // API returns {products: [...]} so we need to extract the array
      setProducts(data.products || data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]); // Set empty array on error
    }
  };

  const loadAddresses = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Skip if not authenticated
    
    try {
      const data = await addressesAPI.getAll();
      // API returns {addresses: [...]} so we need to extract the array
      const addressesList = data.addresses || data || [];
      setAddresses(addressesList);
      
      // Set default address if none selected and addresses exist
      if (orderForm.addressId === '' && addressesList.length > 0) {
        const defaultAddress = addressesList.find(addr => addr.isDefault) || addressesList[0];
        if (defaultAddress) {
          setOrderForm(prev => ({
            ...prev,
            addressId: defaultAddress.id
          }));
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]); // Set empty array on error
    }
  };
  
  const handleAddressAdded = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
    // Optionally set the new address as selected
    setOrderForm(prev => ({
      ...prev,
      addressId: newAddress.id
    }));
  };

  const loadOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Skip if not authenticated
    
    try {
      const data = await ordersAPI.getAll();
      // API might return {orders: [...]} so we need to extract the array
      setOrders(data.orders || data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]); // Set empty array on error
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!user) {
      alert('Debes iniciar sesión para realizar un pedido');
      return;
    }

    if (!orderForm.addressId) {
      alert('Debes seleccionar una dirección de entrega');
      return;
    }

    try {
      // Calcular el total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price  // Incluir el precio
        })),
        addressId: orderForm.addressId,
        paymentMethod: orderForm.paymentMethod,
        notes: orderForm.notes || null,
        total: total  // Incluir el total calculado
      };

      await ordersAPI.create(orderData);
      setCart([]);
      setOrderForm({ notes: '', addressId: '', paymentMethod: 'CASH' });
      alert('¡Pedido realizado con éxito!');
      loadOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido';
      alert(`Error al crear el pedido: ${errorMessage}`);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await authAPI.login(loginData);
      setUser(response.user);
      setShowLogin(false);
      setLoginData({ email: '', password: '' });
      loadAddresses();
      loadOrders();
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleRegister = async () => {
    try {
      await authAPI.register(registerData);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setShowRegister(false);
      setShowLogin(true);
      setRegisterData({ email: '', password: '', name: '', phone: '' });
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error al registrarse. El email puede estar en uso.');
    }
  };

  const filteredProducts = selectedCategory === 'Todos'
    ? products.filter(p => p.isAvailable)
    : products.filter(p => p.category === selectedCategory && p.isAvailable);

  return (
    <>
      <ClientLayout
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onLogin={() => setShowLogin(true)}
        onCartClick={() => {}}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestro Menú</h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cart and Order Form Section */}
          <div className="lg:col-span-1 space-y-6">
            <Cart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              totalPrice={getTotalPrice()}
            />

            <OrderForm
              addresses={addresses}
              orderForm={orderForm}
              onAddressChange={(e) => setOrderForm({...orderForm, addressId: e.target.value})}
              onNotesChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
              onPaymentMethodChange={(method) => setOrderForm({...orderForm, paymentMethod: method})}
              onPlaceOrder={handlePlaceOrder}
              onAddressAdded={handleAddressAdded}
              disabled={cart.length === 0 || !user}
            />
          </div>
        </div>
      </ClientLayout>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Iniciar Sesión</h3>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleLogin}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {setShowLogin(false); setShowRegister(true);}}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Registrarse
              </button>
            </div>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      
      {/* Botón flotante para ir a vista admin */}
      <button
        onClick={switchToAdmin}
        className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        Ir a Vista Admin
      </button>

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Registrarse</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={registerData.phone}
                onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleRegister}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Registrarse
              </button>
              <button
                onClick={() => {setShowRegister(false); setShowLogin(true);}}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancelar
            </button>
            
          </div>
        </div>
      )}
    </>
  );
};

export default ClientPage;
