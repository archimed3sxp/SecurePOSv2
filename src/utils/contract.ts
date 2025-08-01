import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS, ROLES } from '../config/networks';
import { securePOSAbi, securePOSAddress } from './config';

export const getContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const recordSaleHash = async (
  signer: ethers.Signer,
  saleHash: string
): Promise<string> => {
  try {
    const contract = getContract(signer);
    
    const hashBytes = '0x' + saleHash;
    
    const tx = await contract.recordSaleHash(hashBytes);
    const receipt = await tx.wait();
    
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error recording sale hash:', error);
    throw new Error('Failed to record sale on blockchain');
  }
};

export const addUser = async (
  signer: ethers.Signer,
  userAddress: string,
  role: 'manager' | 'auditor' | 'cashier',
  name: string = ''
): Promise<string> => {
  try {
    const contract = getContract(signer);
    
    const roleValue = role === 'manager' ? ROLES.MANAGER : 
                     role === 'auditor' ? ROLES.AUDITOR : 
                     ROLES.CASHIER;
    
    // For demo purposes, simulate the transaction
    console.log('Adding user:', userAddress, 'with role:', role);
    
    const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockTxHash;
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add user');
  }
};

export const removeUser = async (
  signer: ethers.Signer,
  userAddress: string
): Promise<string> => {
  try {
    const contract = getContract(signer);
    
    console.log('Removing user:', userAddress);
    
    const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockTxHash;
  } catch (error) {
    console.error('Error removing user:', error);
    throw new Error('Failed to remove user');
  }
};

export const recordAudit = async (
  signer: ethers.Signer,
  merkleRoot: string
): Promise<string> => {
  try {
    const contract = getContract(signer);

    const rootBytes = ethers.utils.hexlify(ethers.utils.zeroPad('0x' + merkleRoot.replace(/^0x/, ''), 32));

    console.log('Recording Merkle Root to blockchain:', rootBytes);

    const tx = await contract.recordAudit(rootBytes);
    const receipt = await tx.wait();

    return receipt.transactionHash;
  } catch (error) {
    console.error('Error recording audit:', error);
    throw new Error('Failed to record audit');
  }
};


export const checkUserRole = async (
  provider: ethers.Provider,
  userAddress: string
): Promise<{
  isManager: boolean;
  isAuditor: boolean;
  isCashier: boolean;
  role: string;
}> => {
  try {
    // For demo purposes, return default permissions
    return {
      isManager: true,
      isAuditor: true,
      isCashier: true,
      role: 'manager'
    };
  } catch (error) {
    console.error('Error checking user role:', error);
    return {
      isManager: false,
      isAuditor: false,
      isCashier: false,
      role: 'none'
    };
  }
};

export const getContractStatistics = async (
  provider: ethers.Provider
): Promise<{
  totalSales: number;
  totalRevenue: string;
  auditCount: number;
  userCount: number;
}> => {
  try {
    // For demo purposes, return mock statistics
    return {
      totalSales: 0,
      totalRevenue: '0.0',
      auditCount: 0,
      userCount: 1
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      totalSales: 0,
      totalRevenue: '0.0',
      auditCount: 0,
      userCount: 0
    };
  }
};

export const getSaleHashes = async (
  provider: ethers.Provider
): Promise<string[]> => {
  try {
    // For demo purposes, return empty array
    return [];
  } catch (error) {
    console.error('Error getting sale hashes:', error);
    return [];
  }
};

export const verifySaleOnChain = async (
  provider: ethers.Provider,
  saleHash: string
): Promise<boolean> => {
  try {
    // For demo purposes, return true
    return true;
  } catch (error) {
    console.error('Error verifying sale:', error);
    return false;
  }
};