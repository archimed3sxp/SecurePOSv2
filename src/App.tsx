import React, { useState } from 'react';
import { Shield, BarChart3, ShoppingCart, Users, Package } from 'lucide-react';
import RoleSelector from './components/RoleSelector';
import POSInterface from './components/POSInterface';
import AuditDashboard from './components/AuditDashboard';
import UserManagement from './components/UserManagement';
import InventoryManagement from './components/InventoryManagement';
import { useWallet } from './hooks/useWallet';

function App() {
  const { isConnected } = useWallet();
  const [selectedRole, setSelectedRole] = useState<'manager' | 'auditor' | 'cashier' | null>(null);
  const [currentView, setCurrentView] = useState<'pos' | 'audit' | 'users' | 'inventory'>('pos');

  const renderContent = () => {
    if (!selectedRole) {
      return <RoleSelector onRoleSelect={setSelectedRole} />;
    }

    if (selectedRole === 'auditor') {
      return <AuditDashboard />;
    }

    if (selectedRole === 'manager') {
      return (
        <div className="space-y-6">
          {/* Navigation */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('pos')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'pos'
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>POS</span>
                </button>
                <button
                  onClick={() => setCurrentView('audit')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'audit'
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Audit</span>
                </button>
                <button
                  onClick={() => setCurrentView('users')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'users'
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </button>
                <button
                  onClick={() => setCurrentView('inventory')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'inventory'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Inventory</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {currentView === 'pos' && <POSInterface />}
          {currentView === 'audit' && <AuditDashboard />}
          {currentView === 'users' && <UserManagement />}
          {currentView === 'inventory' && <InventoryManagement />}
        </div>
      );
    }

    // Cashier role
    return <POSInterface />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-800 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SecurePOS</h1>
                <p className="text-sm text-gray-600">Tamper-Proof Audit for Retail Systems</p>
              </div>
            </div>
            
            {isConnected && selectedRole && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Role: <span className="font-medium capitalize">{selectedRole}</span>
                </span>
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setCurrentView('pos');
                  }}
                  className="text-sm text-blue-800 hover:text-blue-900 transition-colors"
                >
                  Switch Role
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">🔒 SecurePOS - Tamper-Proof Audit for Retail Systems</p>
            <p className="text-sm">
              Powered by Lisk Network • Secure • Transparent • Decentralized
            </p>
            <p className="text-xs mt-2 text-gray-500">
              No automatic transfers • Your funds remain secure in your wallet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;