import React, { useState } from 'react';
import { Users, Shield, Eye, AlertCircle } from 'lucide-react';
import WalletConnection from './WalletConnection';
import { useWallet } from '../hooks/useWallet';

interface RoleSelectorProps {
  onRoleSelect: (role: 'manager' | 'auditor' | 'cashier') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const { isConnected } = useWallet();
  const [selectedRole, setSelectedRole] = useState<'manager' | 'auditor' | 'cashier' | null>(null);
  const [showWalletConnection, setShowWalletConnection] = useState(false);

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

  // If wallet gets connected and we have a selected role, proceed with role selection
  React.useEffect(() => {
    if (isConnected && selectedRole) {
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Select Your Role
      </h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You can select any role to explore the interface. Some blockchain operations may require appropriate permissions on the smart contract.
        </p>
      </div>
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