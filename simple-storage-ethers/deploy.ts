import {ethers} from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

async function main() {
  // Create a transaction
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8")
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  )

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying contract...")
  const contract = await contractFactory.deploy()
  await contract.deployTransaction.wait(1)
  console.log(`Contract Address: ${contract.address}`)

  // Interact with contract -> Get Number
  const currentFavoriteNumber = await contract.retrieve()
  console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`)
  const txnResponse = await contract.store("7")
  const txnReceipt = await txnResponse.wait(1)
  const updatedFavoriteNumber = await contract.retrieve()
  console.log(`Updated favorite number: ${updatedFavoriteNumber.toString()}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
