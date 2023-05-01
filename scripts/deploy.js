// Import required packages
const { ethers } = require("hardhat");

async function main() {
  // Deploy the Arbitrage contract first
  const Arbitrage = await ethers.getContractFactory("Arbitrage");
  const arbitrage = await Arbitrage.deploy(1000); // Set the minRequiredFunds to 1000

  console.log("Arbitrage contract address:", arbitrage.address);

  // Deploy the AaveFlash contract, passing in the Arbitrage contract address and Aave provider address
  const AaveFlash = await ethers.getContractFactory("AaveFlash");
  const aaveFlash = await AaveFlash.deploy(
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", // Mainnet Aave provider address
    arbitrage.address
  );

  console.log("AaveFlash contract address:", aaveFlash.address);

  // Verify the contracts on Etherscan
  await hre.run("verify:verify", {
    address: arbitrage.address,
    constructorArguments: [1000], // Pass in the constructor argument
    contract: "contracts/Arbitrage.sol:Arbitrage", // Path to the contract source file
  });

  await hre.run("verify:verify", {
    address: aaveFlash.address,
    constructorArguments: [
      "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", // Mainnet Aave provider address
      arbitrage.address,
    ], // Pass in the constructor arguments
    contract: "contracts/AaveFlash.sol:AaveFlash", // Path to the contract source file
  });
}

main();
