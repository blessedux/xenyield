import { ethers } from "hardhat";

async function main() {
  console.log("Verifying deployment...");

  // Load all contracts
  const token = await ethers.getContractAt("XenYieldToken", process.env.TOKEN_ADDRESS!);
  const pool = await ethers.getContractAt("XenYieldPool", process.env.POOL_ADDRESS!);
  const strategyManager = await ethers.getContractAt("StrategyManager", process.env.STRATEGY_MANAGER_ADDRESS!);
  const rewardDistributor = await ethers.getContractAt("RewardDistributor", process.env.REWARD_DISTRIBUTOR_ADDRESS!);

  // Verify basic functionality
  console.log("\nChecking token...");
  const name = await token.name();
  const symbol = await token.symbol();
  console.log(`Token name: ${name}`);
  console.log(`Token symbol: ${symbol}`);

  console.log("\nChecking strategy manager...");
  const strategies = await strategyManager.getActiveStrategies();
  console.log(`Active strategies: ${strategies.length}`);
  const totalAPY = await strategyManager.getTotalExpectedAPY();
  console.log(`Total expected APY: ${totalAPY}bps`);

  console.log("\nChecking reward distributor...");
  const rewardConfig = await rewardDistributor.getRewardConfig();
  console.log(`Base reward: ${ethers.utils.formatEther(rewardConfig.baseReward)} tokens`);
  console.log(`Risk multiplier: ${rewardConfig.riskMultiplier / 100}x`);

  console.log("\nVerification complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 