import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const ALCHEMY_URL = process.env.ALCHEMY_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";



const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    alchemy: {
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
