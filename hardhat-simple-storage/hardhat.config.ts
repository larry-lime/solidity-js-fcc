import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-etherscan"
import "@typechain/hardhat"
import "dotenv/config"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "./tasks/block-number"

/** @type import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL =
  process.env.RINKEBY_RPC_URL || "https://eth-rinkeby/example"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMKTCAP_API_KEY = process.env.COINMKTCAP_API_KEY || "key"

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: "http://128.0.0.1:8545/",
      // accounts auto generates accounts
      chainId: 31338,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMKTCAP_API_KEY,
    // token: 'MATIC'
  },
}
