import React from 'react';

const OrderForm = ({ addresses, orderForm, onAddressChange, onNotesChange, onPaymentMethodChange, onPlaceOrder, disabled }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Formulario de Pedido</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección de entrega</label>
          <select
            value={orderForm.addressId}
            onChange={onAddressChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Seleccionar dirección</option>
            {(addresses || []).map(addr => (
              <option key={addr.id} value={addr.id}>
                {addr.street}, {addr.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onPaymentMethodChange('CASH')}
              className={`p-3 border rounded-lg flex items-center justify-center ${
                orderForm.paymentMethod === 'CASH'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Efectivo
            </button>
            <button
              type="button"
              onClick={() => onPaymentMethodChange('CARD')}
              className={`p-3 border rounded-lg flex items-center justify-center ${
                orderForm.paymentMethod === 'CARD'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tarjeta
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notas especiales</label>
          <textarea
            value={orderForm.notes}
            onChange={onNotesChange}
            placeholder="Instrucciones especiales para la entrega..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows="3"
          />
        </div>

        <button
          onClick={onPlaceOrder}
          disabled={disabled}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
        >
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
