const config = require('../config.json')
const game_config = require('../game_config.json')
const hre = require("hardhat")

async function main() {
  let accounts = await ethers.getSigners()
  let ownerAccount = accounts[0]
  let ownerAddressDisplay = [ownerAccount.address.substr(0, 4), ownerAccount.address.substr(38, 4)].join('...')

  let payByAddress = game_config['game_1_check_wallet']['hostAddress']
  let payByName = game_config['game_1_check_wallet']['hostName']
  let payByAccount = await ethers.getSigner(payByAddress)
  let payByAddressDisplay = [payByAddress.substr(0, 4), payByAddress.substr(38, 4)].join('...')

  let payTo1Address = game_config['game_1_check_wallet']['player1Address']
  let payTo1Name = game_config['game_1_check_wallet']['player1Name']
  let payTo1Account = await ethers.getSigner(payTo1Address)
  let payTo1AddressDisplay = [payTo1Address.substr(0, 4), payTo1Address.substr(38, 4)].join('...')


  let payTo2Address = game_config['game_1_check_wallet']['player2Address']
  let payTo2Name = game_config['game_1_check_wallet']['player2Name']
  let payTo2Account = await ethers.getSigner(payTo2Address)
  let payTo2AddressDisplay = [payTo2Address.substr(0, 4), payTo2Address.substr(38, 4)].join('...')

  let balance
  balance = await ownerAccount.getBalance()
  console.log(`owner: Hardhat#0 ${ownerAddressDisplay} balance(ETH): ${parseInt(balance) / 10**18}`)

  balance = await payByAccount.getBalance()
  console.log(`host: ${payByName} ${payByAddressDisplay} balance(ETH): ${parseInt(balance) / 10**18}`)

  balance = await payTo1Account.getBalance()
  console.log(`player1: ${payTo1Name} ${payTo1AddressDisplay} balance(ETH): ${parseInt(balance) / 10**18}`)

  balance = await payTo2Account.getBalance()
  console.log(`player2: ${payTo2Name} ${payTo2AddressDisplay} balance(ETH): ${parseInt(balance) / 10**18}`)

  console.log("\ngame_1_check_wallets completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
