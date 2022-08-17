import {ethers} from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!)
  const encryptJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD!,
    process.env.PRIVATE_KEY!
  )
  console.log(encryptJsonKey)
  fs.writeFileSync("./.encryptKey.json", encryptJsonKey)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
