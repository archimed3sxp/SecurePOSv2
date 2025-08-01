import React, { useState } from 'react';
import { Users, Shield, Eye, AlertCircle } from 'lucide-react';
import WalletConnection from './WalletConnection';
import { useWallet } from '../hooks/useWallet';
import { isWhitelisted } from '../utils/storage';

interface RoleSelectorProps {
  onRoleSelect: (role: 'manager' | 'auditor' | 'cashier') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const { isConnected } = useWallet();
  const [selectedRole, setSelectedRole] = useState<'manager' | 'auditor' | 'cashier' | null>(null);
  const [showWalletConnection, setShowWalletConnection] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  const roles = [
    {
      id: 'manager' as const,
      title: 'Manager',
      description: 'Full access to POS and audit functions',
      icon: Shield,
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-600'
    },
    {
      id: 'auditor' as const,
      title: 'Auditor',
      description: 'View and verify sales records',
      icon: Eye,
      color: 'from-purple-600 to-blue-600',
      bgColor: 'bg-purple-600'
    },
    {
      id: 'cashier' as const,
      title: 'Cashier',
      description: 'Process sales transactions',
      icon: Users,
      color: 'from-green-600 to-blue-600',
      bgColor: 'bg-green-600'
    }
  ];

  const handleRoleClick = (role: 'manager' | 'auditor' | 'cashier') => {
    setSelectedRole(role);
    if (!isConnected) {
      setShowWalletConnection(true);
    } else {
      onRoleSelect(role);
    }
  };

  // If wallet gets connected and we have a selected role, proceed
  React.useEffect(() => {
    if (isConnected && selectedRole) {
      // For demo purposes, allow all roles without whitelist check
      setAccessDenied(null);
      onRoleSelect(selectedRole);
    }
  }, [isConnected, selectedRole, onRoleSelect]);

  if (showWalletConnection && !isConnected) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Connect Wallet for {selectedRole?.charAt(0).toUpperCase()}{selectedRole?.slice(1)} Role
            </h2>
            <p className="text-gray-600 mt-2">
              You need to connect your wallet to access the {selectedRole} dashboard
            </p>
          </div>
          <button
            onClick={() => setShowWalletConnection(false)}
            className="mb-4 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to role selection
          </button>
        </div>
        <WalletConnection />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-red-600 mb-6">{accessDenied}</p>
            <button
              onClick={() => {
                setAccessDenied(null);
                setSelectedRole(null);
              }}
              className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors"
            >
              Back to Role Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Select Your Role
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                selectedRole === role.id
                  ? 'border-blue-800 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${role.color} rounded-full flex items-center justify-center`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {role.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;