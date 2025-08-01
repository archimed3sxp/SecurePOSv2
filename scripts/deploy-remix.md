# Remix IDE Deployment Guide

## 🌐 Deploy SecurePOS using Remix IDE (Browser-Based)

### **Step 1: Open Remix IDE**
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Accept the terms and close any welcome modals

### **Step 2: Create Contract File**
1. In the File Explorer, click "Create New File"
2. Name it: `SecurePOS.sol`
3. Copy the entire contract code from your `contracts/SecurePOS.sol` file

### **Step 3: Compile Contract**
1. Go to the "Solidity Compiler" tab (second icon)
2. Select compiler version: `0.8.19`
3. Click "Compile SecurePOS.sol"
4. Ensure no errors appear

### **Step 4: Configure MetaMask for Lisk Sepolia**
1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter these details:
   - **Network Name**: Lisk Sepolia Testnet
   - **New RPC URL**: https://rpc.sepolia-api.lisk.com
   - **Chain ID**: 4202
   - **Currency Symbol**: ETH
   - **Block Explorer URL**: https://sepolia-blockscout.lisk.com

### **Step 5: Get Testnet ETH**
1. Visit [Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com/)
2. Enter your wallet address
3. Request testnet ETH (you'll need ~0.01 ETH)

### **Step 6: Deploy Contract**
1. Go to "Deploy & Run Transactions" tab (third icon)
2. Set Environment to: "Injected Provider - MetaMask"
3. Confirm MetaMask connection
4. Select contract: "SecurePOS"
5. Click "Deploy"
6. Confirm transaction in MetaMask

### **Step 7: Verify Deployment**
1. Copy the contract address from Remix
2. Visit [Lisk Sepolia Explorer](https://sepolia-blockscout.lisk.com)
3. Search for your contract address
4. Verify the contract was deployed successfully

### **Step 8: Test Contract Functions**
In Remix, you can test the deployed contract:
1. Expand your deployed contract
2. Test functions like:
   - `owner()` - Should return your address
   - `getSaleCount()` - Should return 0 initially
   - `getStatistics()` - Should return initial stats

### **Step 9: Update Frontend**
1. Copy your contract address
2. Update your `.env` file:
   ```
   VITE_CONTRACT_ADDRESS=your_contract_address_here
   ```

### **🎉 Success!**
Your SecurePOS contract is now deployed on Lisk Sepolia and ready to use!

### **Troubleshooting**
- **Gas estimation failed**: Increase gas limit manually
- **Transaction failed**: Check you have enough testnet ETH
- **Network issues**: Verify Lisk Sepolia RPC URL is correct
- **MetaMask issues**: Try refreshing and reconnecting