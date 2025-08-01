import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { InventoryItem } from '../types';
import { saveInventoryItem, getInventoryItems, removeInventoryItem } from '../utils/storage';
import { useWallet } from '../hooks/useWallet';

const InventoryManagement: React.FC = () => {
  const { account } = useWallet();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    category: 'general',
    stock: 0
  });

  useEffect(() => {
    setItems(getInventoryItems());
  }, []);

  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0) return;

    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      addedBy: account,
      addedAt: Date.now()
    };

    saveInventoryItem(item);
    setItems(getInventoryItems());
    setNewItem({ name: '', price: 0, category: 'general', stock: 0 });
    setShowAddItem(false);
  };

  const handleEditItem = (item: InventoryItem) => {
    saveInventoryItem(item);
    setItems(getInventoryItems());
    setEditingItem(null);
  };

  const handleRemoveItem = (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      removeInventoryItem(id);
      setItems(getInventoryItems());
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const categories = ['general', 'food', 'electronics', 'clothing', 'books', 'health'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Inventory Management</h3>
              <p className="text-gray-600">Manage items for sale</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {showAddItem && (
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4">Add New Item</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Price"
              step="0.01"
              value={newItem.price || ''}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock"
              min="0"
              value={newItem.stock || ''}
              onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddItem}
                className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button
                onClick={() => setShowAddItem(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No items added yet
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updatedItems = items.map(i => 
                            i.id === item.id ? { ...i, name: e.target.value } : i
                          );
                          setItems(updatedItems);
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => {
                          const updatedItems = items.map(i => 
                            i.id === item.id ? { ...i, price: parseFloat(e.target.value) || 0 } : i
                          );
                          setItems(updatedItems);
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{formatCurrency(item.price)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem === item.id ? (
                      <select
                        value={item.category}
                        onChange={(e) => {
                          const updatedItems = items.map(i => 
                            i.id === item.id ? { ...i, category: e.target.value } : i
                          );
                          setItems(updatedItems);
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        min="0"
                        value={item.stock}
                        onChange={(e) => {
                          const updatedItems = items.map(i => 
                            i.id === item.id ? { ...i, stock: parseInt(e.target.value) || 0 } : i
                          );
                          setItems(updatedItems);
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{item.stock}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.addedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {editingItem === item.id ? (
                        <>
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-blue-800 hover:text-blue-900 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(null);
                              setItems(getInventoryItems()); // Reset changes
                            }}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItem(item.id)}
                            className="text-blue-800 hover:text-blue-900 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;