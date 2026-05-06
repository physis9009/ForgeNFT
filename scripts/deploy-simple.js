const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  // Read contract ABI
  const contractPath = "./artifacts/contracts/ForgeNFT.sol/ForgeNFT.json";

  if (!fs.existsSync(contractPath)) {
    console.log("Please compile the contract first using Remix IDE");
    console.log("1. Go to https://remix.ethereum.org/");
    console.log("2. Create ForgeNFT.sol with the contract code");
    console.log("3. Compile it");
    console.log("4. Download the ABI JSON file");
    console.log("5. Save it as ./artifacts/contracts/ForgeNFT.sol/ForgeNFT.json");
    return;
  }

  const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  const abi = contractJson.abi;
  const bytecode = contractJson.bytecode;

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying from address:", wallet.address);
  console.log("Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");

  // Deploy contract
  console.log("Deploying ForgeNFT contract...");
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();

  console.log("Transaction hash:", contract.deploymentTransaction().hash);
  console.log("Waiting for confirmation...");

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n✅ ForgeNFT deployed to:", address);
  console.log("Save this address for frontend integration");

  // Save to .env.local
  const envPath = ".env.local";
  let envContent = fs.readFileSync(envPath, "utf8");
  if (!envContent.includes("CONTRACT_ADDRESS=")) {
    envContent += `\nCONTRACT_ADDRESS=${address}`;
    fs.writeFileSync(envPath, envContent);
    console.log("Contract address added to .env.local");
  }
}

main().catch(console.error);