const { getNamedAccounts, ethers } = require('hardhat')
const { getWeth, AMOUNT } = require('./getWeth')
// Aave treats everything like an ERC 230 token

async function main() {
  await getWeth()
  const { deployer } = await getNamedAccounts()
  // abi address

  // Lending pool address provider: 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
  // Lending Pool: ^
  const lendingPool = await getLendingPool(deployer)
  console.log(`LendingPool address ${lendingPool.address}`)

  // deposit
  const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

  // approve
  await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
  console.log('Depositing')
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
  console.log('Deposited!')
  let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
    lendingPool,
    deployer
  )
  const daiPrice = await getDaiPrice()
  const amountDaiToBorrow =
    availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
  console.log(`You can borrow ${amountDaiToBorrow} DAI`)
  const amountDaiToBorrowWei = ethers.utils.parseEther(
    amountDaiToBorrow.toString()
  )

  // Borrowing
  // how much we have borrowed, how much we have in collateral, how much we can borrow
  const daiTokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'
  await borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer)
  await getBorrowUserData(lendingPool, deployer)
  await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
  await getBorrowUserData(lendingPool, deployer)
}

async function repay(amount, daiAddress, lendingPool, account) {
  await approveErc20(daiAddress, lendingPool.address, amount, account)
  const repayTx = await lendingPool.repay(daiAddress, amount, 1, account)
  await repayTx.wait(1)
  console.log('Repaid')
}

async function borrowDai(
  daiAddress,
  lendingPool,
  amountDaiToBorrowWei,
  account
) {
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountDaiToBorrowWei,
    1,
    0,
    account
  )
  await borrowTx.wait(1)
  console.log("You've borrowed!")
}

async function getDaiPrice() {
  const daiEthPriceFeed = await ethers.getContractAt(
    'AggregatorV3Interface',
    '0x773616E4d11A78F511299002da57A0a94577F1f4'
  )
  const price = (await daiEthPriceFeed.latestRoundData())[1]
  console.log(`The DAI/ETH price is ${price.toString()}`)
  return price
}

async function getBorrowUserData(lendingPool, account) {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account)
  console.log(`You have ${totalCollateralETH} worth of collateral`)
  console.log(`You have ${totalDebtETH} worth of ETH borrowed`)
  console.log(`You have ${availableBorrowsETH} worth of ETH`)
  return { availableBorrowsETH, totalDebtETH }
}

async function getLendingPool(account) {
  const lendingPoolAddressProvider = await ethers.getContractAt(
    'ILendingPoolAddressesProvider',
    '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    account
  )
  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool()
  const lendingPool = await ethers.getContractAt(
    'ILendingPool',
    lendingPoolAddress,
    account
  )
  return lendingPool
}

async function approveErc20(erc20Address, spenderAddress, amount, signer) {
  const erc20Token = await ethers.getContractAt('IERC20', erc20Address, signer)
  const tx = await erc20Token.approve(spenderAddress, amount)
  await tx.wait(1)
  console.log('Approved!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
