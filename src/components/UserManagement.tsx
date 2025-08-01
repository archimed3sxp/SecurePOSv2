import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, UserCheck, UserX, Shield } from 'lucide-react';
import { WhitelistEntry } from '../types';
import { addUser, removeUser } from '../utils/contract';
import { useWallet } from '../hooks/useWallet';

const UserManagement: React.FC = () => {
  const { account, signer } = useWallet();
  const [users, setUsers] = useState<WhitelistEntry[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newUser, setNewUser] = useState({
    address: '',
    role: 'cashier' as 'manager' | 'auditor' | 'cashier',
    name: ''
  });

  useEffect(() => {
    // Load users from local storage for display
    // In a full implementation, you'd fetch from the contract
    const savedUsers = localStorage.getItem('contract_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const handleAddUser = async () => {
    if (!newUser.address || !newUser.role || !signer) return;

    setIsProcessing(true);
    try {
      let txHash = '';
      
      try {
        txHash = await addUser(signer, newUser.address, newUser.role, newUser.name);
      } catch (contractError) {
        console.warn('Failed to add user to contract, adding locally:', contractError);
        // Continue with local storage even if blockchain fails
      }
      
      const entry: WhitelistEntry = {
        address: newUser.address,
        role: newUser.role,
        name: newUser.name || undefined,
        addedBy: account || '',
        addedAt: Date.now()
      };

      const updatedUsers = [...users, entry];
      setUsers(updatedUsers);
      localStorage.setItem('contract_users', JSON.stringify(updatedUsers));
      
      setNewUser({ address: '', role: 'cashier', name: '' });
      setShowAddUser(false);
      
      if (txHash) {
        alert(`User added successfully! Transaction: ${txHash.slice(0, 10)}...`);
      } else {
        alert('User added locally. Blockchain transaction failed but user is saved.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert(`Failed to add user: ${(error as any).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveUser = async (address: string) => {
    if (!signer || !confirm('Are you sure you want to remove this user?')) return;
    
    setIsProcessing(true);
    try {
      let txHash = '';
      
      try {
        txHash = await removeUser(signer, address);
      } catch (contractError) {
        console.warn('Failed to remove user from contract, removing locally:', contractError);
        // Continue with local storage even if blockchain fails
      }
      
      const updatedUsers = users.filter(user => user.address !== address);
      setUsers(updatedUsers);
      localStorage.setItem('contract_users', JSON.stringify(updatedUsers));
      
      if (txHash) {
        alert(`User removed successfully! Transaction: ${txHash.slice(0, 10)}...`);
      } else {
        alert('User removed locally. Blockchain transaction failed but user is removed from local storage.');
      }
    } catch (error) {
      console.error('Error removing user:', error);
      alert(`Failed to remove user: ${(error as any).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-blue-600 text-white';
      case 'auditor':
        return 'bg-purple-600 text-white';
      case 'cashier':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Whitelist Management</h3>
              <p className="text-gray-600">Manage authorized wallet addresses and roles</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {showAddUser && (
        <div className="p-6 border-b border-gray-100 bg-blue-50">
          <h4 className="font-semibold text-gray-900 mb-4">Add User to Whitelist</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Wallet Address"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'manager' | 'auditor' | 'cashier' })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            >
              <option value="cashier">Cashier</option>
              <option value="auditor">Auditor</option>
              <option value="manager">Manager</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleAddUser}
                disabled={isProcessing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isProcessing ? 'Adding...' : 'Add'}</span>
              </button>
              <button
                onClick={() => setShowAddUser(false)}
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
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
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
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No users added yet
                </td>
              </tr>
            ) : (
              users.map((entry) => (
                <tr key={entry.address} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-800" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.name || 'Unnamed User'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatAddress(entry.address)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(entry.role)}`}>
                      {entry.role.charAt(0).toUpperCase() + entry.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.addedAt ? formatDate(entry.addedAt) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleRemoveUser(entry.address)}
                      disabled={isProcessing}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Remove user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default UserManagement;