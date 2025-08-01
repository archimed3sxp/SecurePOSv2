# 🚀 SecurePOS Deployment to Lisk Sepolia

## Prerequisites ✅

1. **Node.js** installed
2. **MetaMask** or Web3 wallet
3. **Lisk Sepolia ETH** from faucet

## Step-by-Step Deployment 📋

### 1. Get Testnet ETH
Visit the Lisk Sepolia faucet and get testnet ETH:
🔗 **https://sepolia-faucet.lisk.com/**

### 2. Add Your Private Key
Open the `.env` file and add your private key:
```
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

⚠️ **IMPORTANT**: Never commit your private key to git!

### 3. Deploy Contract
Run the deployment command:
```bash
npm run deploy:lisk-sepolia
```

### 4. Update Contract Address
After successful deployment:
1. Copy the contract address from the deployment output
2. Update `.env` file:
```
CONTRACT_ADDRESS=your_deployed_contract_address
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

### 5. Restart Development Server
```bash
npm run dev
```

## Network Configuration 🌐

Your MetaMask should be configured with:
- **Network Name**: Lisk Sepolia Testnet
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Chain ID**: 4202
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia-blockscout.lisk.com

## Verification 🔍

After deployment, verify your contract on:
🔗 **https://sepolia-blockscout.lisk.com**

## Troubleshooting 🛠️

- **"Insufficient funds"**: Get more ETH from faucet
- **"Invalid private key"**: Ensure no 0x prefix
- **"Network error"**: Check RPC URL and internet connection
- **"Gas estimation failed"**: Try increasing gas limit

## Ready to Deploy! 🎉

Everything is configured. Just add your private key and run:
```bash
npm run deploy:lisk-sepolia
```