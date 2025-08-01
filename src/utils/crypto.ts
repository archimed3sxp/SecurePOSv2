import CryptoJS from 'crypto-js';
import { Sale } from '../types';

export const generateSaleHash = (sale: Sale): string => {
  // Create a deterministic string from sale data
  const saleData = {
    timestamp: sale.timestamp,
    amount: sale.amount,
    items: sale.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    paymentMethod: sale.paymentMethod,
    cashierId: sale.cashierId
  };
  
  const dataString = JSON.stringify(saleData, Object.keys(saleData).sort());
  return CryptoJS.SHA256(dataString).toString(CryptoJS.enc.Hex);
};

export const verifyMerkleProof = (
  leaf: string,
  proof: string[],
  root: string
): boolean => {
  let hash = leaf;
  
  for (const sibling of proof) {
    // Sort hashes to ensure consistent ordering
    const combined = [hash, sibling].sort().join('');
    hash = CryptoJS.SHA256(combined).toString(CryptoJS.enc.Hex);
  }
  
  return hash === root;
};

export const createMerkleTree = (leaves: string[]): {
  root: string;
  tree: string[][];
} => {
  if (leaves.length === 0) return { root: '', tree: [] };
  
  const tree: string[][] = [leaves];
  let currentLevel = leaves;
  
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1] || left; // Duplicate if odd number
      
      const combined = [left, right].sort().join('');
      const hash = CryptoJS.SHA256(combined).toString(CryptoJS.enc.Hex);
      nextLevel.push(hash);
    }
    
    tree.push(nextLevel);
    currentLevel = nextLevel;
  }
  
  return {
    root: currentLevel[0],
    tree
  };
};