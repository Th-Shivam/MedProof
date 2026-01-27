// MedProof Deployment Script

const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying MedProof contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  const MedRegistryFactory = await hre.ethers.getContractFactory("MedRegistry");
  const medRegistry = await MedRegistryFactory.deploy();
  
  await medRegistry.deployed();

  console.log("MedRegistry deployed to:", medRegistry.address);
  console.log("Transaction hash:", medRegistry.deployTransaction.hash);

  // Save deployment info
  const deploymentInfo = {
    amoy: {
      MedRegistry: {
        address: medRegistry.address,
        transactionHash: medRegistry.deployTransaction.hash,
        deployer: deployer.address,
        timestamp: new Date().toISOString()
      }
    }
  };
  fs.writeFileSync('./deployments/amoy.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to: ./deployments/amoy.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
