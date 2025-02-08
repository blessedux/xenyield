import { getContractFactory } from "@nomicfoundation/hardhat-ethers/types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { verify } from "../helpers/verify";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy addresses - replace with actual addresses for testnet
  const treasuryAddress = deployer.address; // TODO: Replace with actual treasury
  const teamAddress = deployer.address;     // TODO: Replace with actual team wallet
  const marketingAddress = deployer.address; // TODO: Replace with actual marketing
  const rewardsPoolAddress = deployer.address; // TODO: Replace with actual pool

  // Deploy XenYieldToken
  const XenYieldToken = await getContractFactory("XenYieldToken");
  const token = await XenYieldToken.deploy(
    treasuryAddress,
    teamAddress,
    marketingAddress,
    rewardsPoolAddress
  );
  await token.deployed();

  console.log("XenYieldToken deployed to:", token.address);

  // Verify contract
  await verify(token.address, [
    treasuryAddress,
    teamAddress,
    marketingAddress,
    rewardsPoolAddress
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 