import React from 'react';
import { MapPin, Clock, Package, CheckCircle, X, User, CreditCard, DollarSign } from 'lucide-react';

const OrderManagement = ({ orders, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'CARD': return <CreditCard className="w-4 h-4" />;
      case 'CASH': return <DollarSign className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentColor = (method) => {
    switch (method) {
      case 'CARD': return 'bg-blue-100 text-blue-800';
      case 'CASH': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Pedidos Recientes</h2>
        <div className="flex space-x-2">
          <select className="p-2 border border-gray-300 rounded-lg text-sm">
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>Preparando</option>
            <option>Completado</option>
            <option>Cancelado</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">Pedido #{order.id}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{order.customer}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Tel: {order.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Email: {order.email || 'N/A'}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Fecha: {order.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentColor(order.paymentMethod)}`}>
                  {getPaymentIcon(order.paymentMethod)}
                  <span className="ml-1">{order.paymentMethod === 'CARD' ? 'Tarjeta' : 'Efectivo'}</span>
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Productos:</p>
              <div className="text-sm text-gray-700 space-y-1">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between pl-4">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">Total: ${order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">
                <MapPin className="inline w-4 h-4 mr-1" />
                {order.address}
              </p>
            </div>

            <div className="flex space-x-2 mt-4">
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <>
                  <button
                    onClick={() => onStatusChange(order.id, 'preparing')}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    Preparar
                  </button>
                  <button
                    onClick={() => onStatusChange(order.id, 'completed')}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                  >
                    Completar
                  </button>
                  <button
                    onClick={() => onStatusChange(order.id, 'cancelled')}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
