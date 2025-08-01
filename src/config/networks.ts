import { NetworkConfig } from '../types';

export const NETWORKS: Record<string, NetworkConfig> = {
  liskSepolia: {
    chainId: 4202,
    name: 'Lisk Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia-api.lisk.com',
    blockExplorer: 'https://sepolia-blockscout.lisk.com'
  },
  liskMainnet: {
    chainId: 1135,
    name: 'Lisk Mainnet',
    rpcUrl: 'https://rpc.api.lisk.com',
    blockExplorer: 'https://blockscout.lisk.com'
  }
};

export const DEFAULT_NETWORK = NETWORKS.liskSepolia;

// Simple contract ABI for storing hashes
export const CONTRACT_ABI = [
  // Core sale functions
  "function recordSaleHash(bytes32 saleHash, uint256 amount) external",
  "function getSaleHash(uint256 index) external view returns (bytes32)",
  "function getSale(uint256 index) external view returns (tuple(bytes32 saleHash, uint256 timestamp, address recorder, uint256 amount, bool verified))",
  "function getSaleCount() external view returns (uint256)",
  "function verifySaleHash(bytes32 saleHash) external view returns (bool)",
  "function getAllSaleHashes() external view returns (bytes32[])",
  
  // User management functions
  "function addUser(address user, uint8 role, string memory name) external",
  "function removeUser(address user) external",
  "function changeUserRole(address user, uint8 newRole) external",
  "function getUser(address user) external view returns (tuple(uint8 role, bool active, uint256 addedAt, address addedBy, string name))",
  "function hasRole(address user, uint8 role) external view returns (bool)",
  "function isManager(address user) external view returns (bool)",
  "function isAuditor(address user) external view returns (bool)",
  "function isCashier(address user) external view returns (bool)",
  
  // Audit functions
  "function recordAudit(bytes32 merkleRoot) external",
  "function getAuditRecord(uint256 index) external view returns (tuple(uint256 timestamp, address auditor, bytes32 merkleRoot, uint256 salesCount))",
  
  // Statistics
  "function getStatistics() external view returns (uint256, uint256, uint256, uint256)",
  "function totalSales() external view returns (uint256)",
  "function totalRevenue() external view returns (uint256)",
  "function auditCount() external view returns (uint256)",
  
  // Owner functions
  "function owner() external view returns (address)",
  "function transferOwnership(address newOwner) external",
  
  // Events
  "event SaleRecorded(bytes32 indexed saleHash, uint256 timestamp, address indexed recorder, uint256 amount)",
  "event UserAdded(address indexed user, uint8 role, address indexed addedBy)",
  "event UserRemoved(address indexed user, address indexed removedBy)",
  "event RoleChanged(address indexed user, uint8 oldRole, uint8 newRole, address indexed changedBy)",
  "event AuditPerformed(address indexed auditor, uint256 timestamp, bytes32 merkleRoot)"
];

// Contract address - will be updated after deployment
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5245b85800a1e3e79268da58b390ae10b0424956";

// Role enum values (matching the smart contract)
export const ROLES = {
  NONE: 0,
  CASHIER: 1,
  AUDITOR: 2,
  MANAGER: 3
} as const;