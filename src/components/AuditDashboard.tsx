import React, { useState, useEffect } from 'react';
import { FileSearch, Shield, Hash, Calendar, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Sale, AuditRecord } from '../types';
import { getSales, getAuditRecords } from '../utils/storage';
import { generateSaleHash, createMerkleTree, verifyMerkleProof } from '../utils/crypto';

const AuditDashboard: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [verification, setVerification] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    setSales(getSales());
    setAuditRecords(getAuditRecords());
  }, []);

  const verifySaleIntegrity = (sale: Sale) => {
    const computedHash = generateSaleHash(sale);
    const isValid = computedHash === sale.hash;
    
    setVerification({
      isValid,
      message: isValid 
        ? 'Sale data integrity verified ✓' 
        : 'Sale data has been tampered with ✗'
    });
    
    setSelectedSale(sale);
  };

  const generateAuditReport = () => {
    const hashes = sales.map(sale => sale.hash!).filter(Boolean);
    const merkleTree = createMerkleTree(hashes);
    
    const report = {
      totalSales: sales.length,
      totalAmount: sales.reduce((sum, sale) => sum + sale.amount, 0),
      merkleRoot: merkleTree.root,
      auditTimestamp: Date.now(),
      salesVerified: sales.filter(sale => generateSaleHash(sale) === sale.hash).length
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${Date.now()}.json`;
    a.click();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileSearch className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Audit Dashboard</h2>
              <p className="text-gray-600">Verify and audit all sales transactions</p>
            </div>
          </div>
          <button
            onClick={generateAuditReport}
            className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-900 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Hash className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(sales.reduce((sum, sale) => sum + sale.amount, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Shield className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {sales.filter(sale => sale.hash).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {sales.filter(sale => 
                  new Date(sale.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Sales History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(sale.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(sale.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.items.length} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sale.hash ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => verifySaleIntegrity(sale)}
                        className="text-blue-800 hover:text-blue-900 transition-colors"
                      >
                        Verify
                      </button>
                      {sale.txHash && (
                        <a
                          href={`https://sepolia-blockscout.lisk.com/tx/${sale.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-800 hover:text-blue-900 transition-colors"
                          title="View on blockchain"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Result */}
      {verification && selectedSale && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg ${
              verification.isValid ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {verification.isValid ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Verification Result
              </h3>
              <p className={`font-medium ${
                verification.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {verification.message}
              </p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><strong>Sale ID:</strong> {selectedSale.id}</p>
                <p><strong>Hash:</strong> {selectedSale.hash}</p>
                {selectedSale.txHash && (
                  <div className="flex items-center space-x-2">
                    <span><strong>Transaction:</strong> {selectedSale.txHash}</span>
                    <a
                      href={`https://sepolia-blockscout.lisk.com/tx/${selectedSale.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
                <p><strong>Items:</strong> {selectedSale.items.length}</p>
                <p><strong>Total:</strong> {formatCurrency(selectedSale.amount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditDashboard;