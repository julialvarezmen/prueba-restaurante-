import React from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';

const ProductManagement = ({ products, onAddProduct, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Productos</h2>
        <button
          onClick={onAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Producto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border border-gray-200 rounded-lg p-4">
            <img
              src={product.image || 'https://placehold.co/300x200/FF6B6B/FFFFFF?text=Producto'}
              alt={product.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-blue-600">${product.price}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEditProduct(product)}
                  className="p-1 text-blue-500 hover:text-blue-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.isAvailable ? 'Disponible' : 'No Disponible'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
