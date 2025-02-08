import { ethers } from "hardhat";
import { verify } from "../helpers/verify";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying strategies with account:", deployer.address);

  const tokenAddress = process.env.TOKEN_ADDRESS;
  if (!tokenAddress) throw new Error("Token address not provided");

  // Deploy LendingStrategy
  const LendingStrategy = await ethers.getContractFactory("LendingStrategy");
  const lendingStrategy = await LendingStrategy.deploy(
    "Mantle Lending Strategy",
    process.env.LENDING_PROTOCOL_ADDRESS!,
    1, // Conservative risk level
    tokenAddress
  );
  await lendingStrategy.deployed();
  console.log("LendingStrategy deployed to:", lendingStrategy.address);

  // Deploy LPStrategy
  const LPStrategy = await ethers.getContractFactory("LPStrategy");
  const lpStrategy = await LPStrategy.deploy(
    "Mantle LP Strategy",
    process.env.LP_PROTOCOL_ADDRESS!,
    2, // Balanced risk level
    tokenAddress
  );
  await lpStrategy.deployed();
  console.log("LPStrategy deployed to:", lpStrategy.address);

  // Verify contracts
  await verify(lendingStrategy.address, [
    "Mantle Lending Strategy",
    process.env.LENDING_PROTOCOL_ADDRESS,
    1,
    tokenAddress
  ]);
  await verify(lpStrategy.address, [
    "Mantle LP Strategy",
    process.env.LP_PROTOCOL_ADDRESS,
    2,
    tokenAddress
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 