
require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ No PRIVATE_KEY found in .env file");
    return;
  }

  try {
    const wallet = new ethers.Wallet(privateKey);
    console.log("\n🔍 Wallet Verification:");
    console.log("-----------------------------------------");
    console.log(`Address in .env:  ${wallet.address}`);
    console.log("-----------------------------------------");
    console.log("Please check if this address matches the one in your MetaMask.");
  } catch (error) {
    console.error("❌ Invalid Private Key:", error.message);
  }
}

main();
