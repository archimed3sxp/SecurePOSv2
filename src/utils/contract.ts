import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS, ROLES } from '../config/networks';

export const getContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const recordSaleHash = async (
  signer: ethers.Signer,
  saleHash: string,
  amount: number
): Promise<string> => {
  try {
    const contract = getContract(signer);
    
    // Convert hash to bytes32 format
    const hashBytes = ethers.zeroPadValue('0x' + saleHash, 32);
    
    // Convert amount to wei (assuming amount is in cents, convert to wei)
    const amountWei = ethers.parseUnits(amount.toString(), 'wei');
    
    const tx = await contract.recordSaleHash(hashBytes, amountWei);
    const receipt = await tx.wait();
    
    return receipt.hash;
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
    
    const tx = await contract.addUser(userAddress, roleValue, name);
    const receipt = await tx.wait();
    
    return receipt.hash;
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
    
    const tx = await contract.removeUser(userAddress);
    const receipt = await tx.wait();
    
    return receipt.hash;
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

    const rootBytes = ethers.zeroPadValue('0x' + merkleRoot.replace(/^0x/, ''), 32);

    const tx = await contract.recordAudit(rootBytes);
    const receipt = await tx.wait();

    return receipt.hash;
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
    const contract = getContract(provider);
    
    const [isManager, isAuditor, isCashier] = await Promise.all([
      contract.isManager(userAddress),
      contract.isAuditor(userAddress),
      contract.isCashier(userAddress)
    ]);
    
    let role = 'none';
    if (isManager) role = 'manager';
    else if (isAuditor) role = 'auditor';
    else if (isCashier) role = 'cashier';
    
    return {
      isManager,
      isAuditor,
      isCashier,
      role
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
    const contract = getContract(provider);
    const [totalSales, totalRevenue, auditCount, userCount] = await contract.getStatistics();
    
    return {
      totalSales: Number(totalSales),
      totalRevenue: ethers.formatEther(totalRevenue),
      auditCount: Number(auditCount),
      userCount: Number(userCount)
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
    const contract = getContract(provider);
    const hashes = await contract.getAllSaleHashes();
    return hashes;
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
    const contract = getContract(provider);
    const hashBytes = ethers.zeroPadValue('0x' + saleHash, 32);
    const isVerified = await contract.verifySaleHash(hashBytes);
    return isVerified;
  } catch (error) {
    console.error('Error verifying sale:', error);
    return false;
  }
};