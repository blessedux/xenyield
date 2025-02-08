import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Setting up strategies with account:", deployer.address);

  // Load deployed contracts
  const strategyManager = await ethers.getContractAt(
    "StrategyManager",
    process.env.STRATEGY_MANAGER_ADDRESS!
  );

  const lendingStrategy = await ethers.getContractAt(
    "LendingStrategy",
    process.env.LENDING_STRATEGY_ADDRESS!
  );

  const lpStrategy = await ethers.getContractAt(
    "LPStrategy",
    process.env.LP_STRATEGY_ADDRESS!
  );

  // Add strategies to manager
  console.log("Adding lending strategy...");
  await strategyManager.addStrategy(
    lendingStrategy.address,
    3000, // 30% allocation
    1000, // 10% expected APY
    1     // Conservative risk
  );

  console.log("Adding LP strategy...");
  await strategyManager.addStrategy(
    lpStrategy.address,
    7000, // 70% allocation
    2000, // 20% expected APY
    2     // Balanced risk
  );

  console.log("Strategies setup complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 