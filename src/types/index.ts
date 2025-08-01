export interface Sale {
  id: string;
  timestamp: number;
  amount: number;
  items: SaleItem[];
  paymentMethod: string;
  cashierId: string;
  hash?: string;
  txHash?: string;
}

export interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface AuditRecord {
  saleHash: string;
  timestamp: number;
  blockNumber: number;
  txHash: string;
}

export interface User {
  address: string;
  role: 'manager' | 'auditor' | 'cashier';
  name?: string;
  addedBy?: string;
  addedAt?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  addedBy: string;
  addedAt: number;
}

export interface WhitelistEntry {
  address: string;
  role: 'manager' | 'auditor' | 'cashier';
  name?: string;
  addedBy: string;
  addedAt: number;
}

export type NetworkConfig = {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
};