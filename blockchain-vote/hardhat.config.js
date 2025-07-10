require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // .env dosyasını okuyacak

module.exports = {
  solidity: "0.8.29",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
