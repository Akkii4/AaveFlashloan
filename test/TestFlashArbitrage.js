const { expect } = require("chai");
const { ethers } = require("hardhat");

it("should perform arbitrage", async function () {
  // Perform a mock arbitrage by transferring tokens to the contract, then calling performArbitrage
  const tokenAddress = "0x0000000000000000000000000000000000000000"; // Replace with the address of your test token
  const token = await ethers.getContractAt("IERC20", tokenAddress);
  const operator = await ethers.getSigner(0);
  const initialBalance = await token.balanceOf(operator.getAddress());
  await token.transfer(arbitrage.address, 1000);
  await arbitrage.performArbitrage(tokenAddress);
  const finalBalance = await token.balanceOf(operator.getAddress());
  expect(finalBalance).to.equal(initialBalance.add(1000));
});

describe("AaveFlash", function () {
  let aaveFlash;
  let arbitrage;

  beforeEach(async () => {
    // Deploy the Arbitrage contract first
    const Arbitrage = await ethers.getContractFactory("Arbitrage");
    arbitrage = await Arbitrage.deploy(1000);

    // Deploy the AaveFlash contract, passing in the Arbitrage contract address and Aave provider address
    const AaveFlash = await ethers.getContractFactory("AaveFlash");
    aaveFlash = await AaveFlash.deploy(
      "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", // Mainnet Aave provider address
      arbitrage.address
    );
    await aaveFlash.deployed();
  });

  it("should update minRequiredFunds in Arbitrage contract", async function () {
    // Update the minRequiredFunds and ensure it was set correctly
    await arbitrage.updateMinRequiredFunds(2000);
    const newMinRequiredFunds = await arbitrage.minRequiredFunds();
    expect(newMinRequiredFunds).to.equal(2000);
  });

  it("should update arbitrage contract", async function () {
    // Update the Arbitrage contract and ensure it was set correctly
    const Arbitrage = await ethers.getContractFactory("Arbitrage");
    const newArbitrage = await Arbitrage.deploy(2000);
    await newArbitrage.deployed();
    await aaveFlash.updateArbitrageContract(newArbitrage.address);
    const currentArbitrage = await aaveFlash.arbitrageContract();
    expect(currentArbitrage).to.equal(newArbitrage.address);
  });

  it("should perform flash loan", async function () {
    // Perform a mock flash loan by transferring tokens to the AaveFlash contract, then calling flashloan
    const daiTokenAddress = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
    const token = await ethers.getContractAt("IERC20", daiTokenAddress);
    const operator = await ethers.getSigner(0);
    const initialBalance = await token.balanceOf(operator.getAddress());
    await token.transfer(aaveFlash.address, 1000);
    await aaveFlash.flashloan(daiTokenAddress, 1000);
    const finalBalance = await token.balanceOf(operator.getAddress());
    expect(finalBalance).to.equal(initialBalance.add(1000));
  });
});
