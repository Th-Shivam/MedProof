// MedProof Deployment Script

const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Starting deployment script...");

  try {
    const [deployer] = await hre.ethers.getSigners();
    if (!deployer) {
      throw new Error("No deployer account found!");
    }

    console.log("Deploying MedProof contracts with account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", balance.toString());

    const MedRegistryFactory = await hre.ethers.getContractFactory("MedRegistry");
    console.log("Deploying MedRegistry...");

    const medRegistry = await MedRegistryFactory.deploy();
    console.log("Deployment transaction sent:", medRegistry.deployTransaction.hash);

    await medRegistry.deployed();
    console.log("MedRegistry deployed to:", medRegistry.address);

    // Save deployment info
    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

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

    const deploymentPath = path.join(deploymentsDir, 'amoy.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("Deployment info saved to:", deploymentPath);

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
