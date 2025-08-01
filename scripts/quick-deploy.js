#!/usr/bin/env node

/**
 * Quick Deploy Script for SecurePOS
 * Alternative to Hardhat for simple deployment
 */

const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config();

// Contract bytecode and ABI (you'll need to compile first)
const contractSource = fs.readFileSync('./contracts/SecurePOS.sol', 'utf8');

async function quickDeploy() {
  console.log('🚀 Quick Deploy Script for SecurePOS');
  console.log('=====================================');

  // Check environment
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY not found in .env file');
    process.exit(1);
  }

  try {
    // Connect to Lisk Sepolia
    const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log('📡 Connected to Lisk Sepolia');
    console.log('👤 Deployer address:', wallet.address);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');
    
    if (balance < ethers.parseEther('0.001')) {
      console.error('❌ Insufficient balance. Get testnet ETH from: https://sepolia-faucet.lisk.com/');
      process.exit(1);
    }

    // Note: You'll need to compile the contract first to get bytecode
    console.log('⚠️  To use this script:');
    console.log('1. Compile contract with: npm run compile');
    console.log('2. Extract bytecode from artifacts/');
    console.log('3. Update this script with bytecode and ABI');
    console.log('');
    console.log('💡 Recommended: Use "npm run deploy:lisk-sepolia" instead');
    console.log('   This uses the pre-configured Hardhat deployment');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  quickDeploy();
}

module.exports = { quickDeploy };