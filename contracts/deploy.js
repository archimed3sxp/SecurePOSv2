const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SecurePOS contract to Lisk Sepolia...");

  // Get the contract factory
  const SecurePOS = await ethers.getContractFactory("SecurePOS");

  // Deploy the contract
  const securePOS = await SecurePOS.deploy();

  // Wait for deployment to complete
  await securePOS.waitForDeployment();

  const contractAddress = await securePOS.getAddress();
  
  console.log("SecurePOS deployed to:", contractAddress);
  console.log("Transaction hash:", securePOS.deploymentTransaction().hash);
  
  // Verify deployment
  console.log("Verifying deployment...");
  const owner = await securePOS.owner();
  const saleCount = await securePOS.getSaleCount();
  
  console.log("Contract owner:", owner);
  console.log("Initial sale count:", saleCount.toString());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: "lisk-sepolia",
    deploymentHash: securePOS.deploymentTransaction().hash,
    owner: owner,
    deployedAt: new Date().toISOString()
  };
  
  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  return contractAddress;
}

main()
  .then((address) => {
    console.log(`\n✅ Deployment successful!`);
    console.log(`📝 Contract Address: ${address}`);
    console.log(`🔗 View on Lisk Sepolia Explorer: https://sepolia-blockscout.lisk.com/address/${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });