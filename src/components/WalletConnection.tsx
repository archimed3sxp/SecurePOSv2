import React from 'react';
import { Wallet, LogOut, Shield, AlertCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { DEFAULT_NETWORK, CONTRACT_ADDRESS } from '../config/networks';

const WalletConnection: React.FC = () => {
  const { 
    account, 
    isConnected, 
    isConnecting, 
    chainId, 
    connectWallet, 
    disconnectWallet,
    switchNetwork 
  } = useWallet();

  const isCorrectNetwork = chainId === DEFAULT_NETWORK.chainId;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Wallet Connected</h3>
              <p className="text-sm text-gray-600">{formatAddress(account)}</p>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {chainId && !isCorrectNetwork && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Wrong Network
                </p>
                <p className="text-sm text-yellow-600">
                  Please switch to {DEFAULT_NETWORK.name}
                </p>
              </div>
            </div>
            <button
              onClick={switchNetwork}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors"
            >
              Switch Network
            </button>
          </div>
        )}

        <div className="text-sm text-gray-500">
          <p>Network: <span className="font-medium">{DEFAULT_NETWORK.name}</span></p>
          <p>Chain ID: <span className="font-medium">{chainId || 'Unknown'}</span></p>
          <p className="text-xs mt-2 text-green-600">
            ✅ Demo Mode: Sales will be processed locally
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 mb-6">
          Connect your Web3 wallet to access SecurePOS
        </p>
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-900 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
        <div className="mt-4 text-xs text-gray-500">
          <p>Secure connection - No automatic transfers</p>
          <p>Your funds remain safe in your wallet</p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;