import hre from "hardhat";

async function main() {
  console.log("Deploying ForgeNFT contract...");

  const ForgeNFT = await hre.ethers.getContractFactory("ForgeNFT");
  const forgeNFT = await ForgeNFT.deploy();

  await forgeNFT.waitForDeployment();
  const address = await forgeNFT.getAddress();

  console.log("ForgeNFT deployed to:", address);
  console.log("Transaction hash:", forgeNFT.deploymentTransaction().hash);

  // Save contract address for frontend
  console.log("\nAdd this to your frontend:");
  console.log(`CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });