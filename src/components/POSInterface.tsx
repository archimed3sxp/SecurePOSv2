import React, { useState } from 'react';
import { useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, CreditCard, Hash, CheckCircle, ExternalLink } from 'lucide-react';
import { Sale, SaleItem } from '../types';
import { InventoryItem } from '../types';
import { getInventoryItems } from '../utils/storage';
import { generateSaleHash } from '../utils/crypto';
import { saveSale, saveAuditRecord } from '../utils/storage';
import { recordSaleHash } from '../utils/contract';
import { useWallet } from '../hooks/useWallet';

const POSInterface: React.FC = () => {
  const { signer, account } = useWallet();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    price: 0,
    quantity: 1,
    category: 'general'
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  useEffect(() => {
    setInventoryItems(getInventoryItems());
  }, []);

  const addItem = () => {
    if (!currentItem.name || currentItem.price <= 0) return;

    const newItem: SaleItem = {
      id: Date.now().toString(),
      ...currentItem
    };

    setItems([...items, newItem]);
    setCurrentItem({ name: '', price: 0, quantity: 1, category: 'general' });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processSale = async () => {
    if (items.length === 0 || !signer) return;

    setIsProcessing(true);
    try {
      const sale: Sale = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        amount: getTotalAmount(),
        items: [...items],
        paymentMethod,
        cashierId: account || ''
      };

      // Generate hash
      const hash = generateSaleHash(sale);
      sale.hash = hash;

      // Record hash on blockchain
      const txHash = await recordSaleHash(signer, hash, Math.floor(sale.amount * 100)); // Convert to cents
      sale.txHash = txHash;

      // Save to local storage
      saveSale(sale);

      // Save audit record
      saveAuditRecord({
        saleHash: hash,
        timestamp: sale.timestamp,
        blockNumber: 0, // Will be filled by blockchain response
        txHash: txHash
      });

      setLastSale(sale);
      setItems([]);
      
    } catch (error) {
      console.error('Failed to process sale:', error);
      alert(`Failed to process sale: ${(error as any).message || 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ShoppingCart className="w-6 h-6 text-blue-800" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Point of Sale</h2>
      </div>

      {lastSale && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Sale Processed Successfully</span>
          </div>
          <div className="text-sm text-green-700">
            <p>Sale ID: {lastSale.id}</p>
            <p>Amount: ${lastSale.amount.toFixed(2)}</p>
            <p>Hash: {lastSale.hash?.slice(0, 16)}...</p>
            <div className="flex items-center space-x-2">
              <span>Tx: {lastSale.txHash?.slice(0, 16)}...</span>
              {lastSale.txHash && (
                <a
                  href={`https://sepolia-blockscout.lisk.com/tx/${lastSale.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add from Inventory */}
      {inventoryItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Quick Add from Inventory</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {inventoryItems.slice(0, 8).map((invItem) => (
              <button
                key={invItem.id}
                onClick={() => {
                  const newItem: SaleItem = {
                    id: Date.now().toString(),
                    name: invItem.name,
                    price: invItem.price,
                    quantity: 1,
                    category: invItem.category
                  };
                  setItems([...items, newItem]);
                }}
                className="p-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <div className="text-sm font-medium text-blue-900">{invItem.name}</div>
                <div className="text-xs text-blue-600">${invItem.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Item Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Add Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Item name"
            value={currentItem.name}
            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Price"
            step="0.01"
            value={currentItem.price || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) || 0 })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Quantity"
            min="1"
            value={currentItem.quantity}
            onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addItem}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Sale Items</h3>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No items added yet</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="flex space-x-4">
          {['cash', 'card', 'digital'].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                paymentMethod === method
                  ? 'bg-blue-800 text-white border-blue-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Total and Process */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-blue-800">${getTotalAmount().toFixed(2)}</span>
        </div>
        <button
          onClick={processSale}
          disabled={items.length === 0 || isProcessing || !signer}
          className="w-full bg-gradient-to-r from-green-600 to-blue-800 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-blue-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Hash className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Process Sale</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default POSInterface;