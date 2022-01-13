# Setup
### In a first terminal
     $ git clone git@github.com:tong2984a/cadence.git SlashFIRE

     $ cd SlashFIRE

     $ node --version
     > v16.10.0

     $ yarn --version
     > 1.22.0

     $ yarn

     $ npx hardhat node

### In a second terminal
     $ cd SlashFIRE

     $ npx hardhat run scripts/deploy.js --network localhost

     $ npx hardhat run scripts/cli1_create_nft.js --network localhost

     $ npx hardhat run scripts/cli2_fetch_nft.js --network localhost

     $ npx hardhat run scripts/cli3_burn_nft.js --network localhost

     $ npx hardhat run scripts/cli4_check_wallets.js --network localhost

### Configuration
-  :exclamation: :point_right: save your private key file in a '.secret' file and put it at the SlashFIRE folder

# Setup -- TestNet
Here are some differences when compared to Setup -- localhost
- hardhat.config.js now includes rinkeby network settings
- you will need to register for an infura.io account, and include your project id in a '.infuraid' file and put that at the SlashFIRE folder
- You can close the first terminal because we will be using the TestNet instead.
- Repeat steps under the above "In a second terminal" by using rinkeby instead of localhost.
- Remember to give yourself (i.e. your .secret account) some eth from online faucets.

Refer to the above "In a second terminal"
     $ cd SlashFIRE

     $ npx hardhat run scripts/deploy.js --network rinkeby

     $ npx hardhat run scripts/cli1_create_nft.js --network rinkeby

     $ npx hardhat run scripts/cli2_fetch_nft.js --network rinkeby

     $ npx hardhat run scripts/cli3_burn_nft.js --network rinkeby

     $ npx hardhat run scripts/cli4_check_wallets.js --network rinkeby
