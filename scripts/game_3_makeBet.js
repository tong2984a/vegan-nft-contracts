const config = require('../config.json')
const game_config = require('../game_config.json')
const hre = require("hardhat")

async function main() {
  console.log("\ngame_3_makeBet starting ...")
  let payByAddress = game_config['game_3_makeBet']['player1Address']
  let payByAccount = await hre.ethers.getSigner(payByAddress)
  console.log('payByAddress: ', payByAddress)
  
  let value = game_config['game_3_makeBet']['value_in_ether']
  const value_in_ether = ethers.utils.parseUnits(value.toString(), 'ether')
  const value_in_wei = ethers.utils.formatUnits(value_in_ether, 0)
  console.log('value_in_wei: ', value_in_wei)
  console.log('value_in_ether: ', Number(ethers.utils.formatEther( value_in_ether )))
  let gameAddress = config['deployed']['gameAddress']
  const Game = await hre.ethers.getContractFactory("Game")
  const gameContract = await Game.attach(gameAddress)  

  let transaction
  let tx
  let event

  transaction = await gameContract.connect(payByAccount).makeBet({value: value_in_ether})
  tx = await transaction.wait()
  event = tx.events[0] //event BetMade
  console.log("player:", event.args['player'])
  console.log("amount:", event.args['amount'])

  let balance = await gameContract.rewards()
  console.log("rewards balance:", balance)

  console.log("\ngame_3_makeBet completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
