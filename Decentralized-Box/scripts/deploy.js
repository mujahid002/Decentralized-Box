const { ethers } = require("hardhat");
const {JsonRpcProvider} =require("ethers")
async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Compile the contract using Hardhat
  const dStorageContract = await ethers.getContractFactory("dStorage");

  // Deploy the contract to the local Hardhat network
  const dStorage = await dStorageContract.deploy();
  await dStorage.deployed();

  console.log("dStorage contract deployed to:", dStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
