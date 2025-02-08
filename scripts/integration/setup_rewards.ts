import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Setting up rewards with account:", deployer.address);

  // Load deployed contracts
  const rewardDistributor = await ethers.getContractAt(
    "RewardDistributor",
    process.env.REWARD_DISTRIBUTOR_ADDRESS!
  );

  // Configure reward parameters
  console.log("Configuring reward parameters...");
  await rewardDistributor.setRewardConfig({
    baseReward: ethers.utils.parseEther("100"),
    riskMultiplier: 150,  // 1.5x
    timeMultiplier: 110,  // 1.1x
    survivalBonus: 200    // 2x
  });

  // Set risk multipliers
  await rewardDistributor.setRiskMultiplier(1, 100);  // Conservative: 1x
  await rewardDistributor.setRiskMultiplier(2, 150);  // Balanced: 1.5x
  await rewardDistributor.setRiskMultiplier(3, 250);  // Aggressive: 2.5x

  console.log("Rewards setup complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 