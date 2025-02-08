import { ethers } from "hardhat";
import { verify } from "../helpers/verify";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying core contracts with account:", deployer.address);

  // Get token address from previous deployment
  const tokenAddress = process.env.TOKEN_ADDRESS;
  if (!tokenAddress) throw new Error("Token address not provided");

  // Deploy RewardDistributor
  const RewardDistributor = await ethers.getContractFactory("RewardDistributor");
  const rewardDistributor = await RewardDistributor.deploy(tokenAddress);
  await rewardDistributor.deployed();
  console.log("RewardDistributor deployed to:", rewardDistributor.address);

  // Deploy AI Oracle (mock for testnet)
  const MockAIOracle = await ethers.getContractFactory("MockAIOracle");
  const aiOracle = await MockAIOracle.deploy();
  await aiOracle.deployed();
  console.log("MockAIOracle deployed to:", aiOracle.address);

  // Deploy StrategyManager
  const StrategyManager = await ethers.getContractFactory("StrategyManager");
  const strategyManager = await StrategyManager.deploy(aiOracle.address, tokenAddress);
  await strategyManager.deployed();
  console.log("StrategyManager deployed to:", strategyManager.address);

  // Deploy XenYieldPool
  const XenYieldPool = await ethers.getContractFactory("XenYieldPool");
  const xenYieldPool = await XenYieldPool.deploy(tokenAddress);
  await xenYieldPool.deployed();
  console.log("XenYieldPool deployed to:", xenYieldPool.address);

  // Verify contracts
  await verify(rewardDistributor.address, [tokenAddress]);
  await verify(aiOracle.address, []);
  await verify(strategyManager.address, [aiOracle.address, tokenAddress]);
  await verify(xenYieldPool.address, [tokenAddress]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 