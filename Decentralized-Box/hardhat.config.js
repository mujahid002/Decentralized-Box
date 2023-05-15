require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork:"sepolia",
  networks:{
    hardhat:{},
    sepolia:{
      url:`https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      accounts:[`0x${process.env.REACT_APP_PRIVATE_KEY}`]
    }
  },
  paths: {
    artifacts: "./user-interface/src/artifacts",
  }
};
