# Setup
### In a first terminal
    $ git clone git@github.com:tong2984a/vegan-nft-contracts.git vegan-nft-contracts

    $ cd vegan-nft-contracts

    $ node --version
    > v16.10.0

    $ yarn --version
    > 1.22.0

    $ yarn

    $ npx hardhat node

### In a second terminal
    $ cd vegan-nft-contracts

    $ npx hardhat run scripts/deploy.js --network localhost

    update your cli_config.json before running the followings (see Configuration below)

    $ npx hardhat run scripts/cli_1a_create_nft.js --network localhost

    $ npx hardhat run scripts/cli_1b_put_nft_on_market.js --network localhost

    $ npx hardhat run scripts/cli_2_fetch_nft.js --network localhost

    $ npx hardhat run scripts/cli_3a_take_nft_off_market.js --network localhost

    $ npx hardhat run scripts/cli_3b_burn_nft.js --network localhost

### Configuration
-  :exclamation: :point_right: save your private key file in a '.secret' file and put it at the vegan-nft-contracts folder.

-  :exclamation: :point_right: use the cli_config.json to control how you manage your nfts by using the cli scripts.

# Setup -- TestNet
Here are some differences when compared to Setup -- localhost
- hardhat.config.js now includes rinkeby network settings
- you will need to register for an infura.io account, and include your project id in a '.infuraid' file and put that at the vegan-nft-contracts folder
- You can close the first terminal because we will be using the TestNet instead.
- Repeat steps under the above "In a second terminal" by using rinkeby instead of localhost.
- Remember to give yourself (i.e. your .secret account) some eth from online faucets.

Refer to the above "In a second terminal"
    $ cd vegan-nft-contracts

    $ npx hardhat run scripts/deploy.js --network rinkeby

    $ npx hardhat run scripts/cli_1a_create_nft.js --network rinkeby

    $ npx hardhat run scripts/cli_1b_put_nft_on_market.js --network rinkeby

    $ npx hardhat run scripts/cli_2_fetch_nft.js --network rinkeby

    $ npx hardhat run scripts/cli_3a_take_nft_off_market.js --network rinkeby

    $ npx hardhat run scripts/cli_3b_burn_nft.js --network rinkeby
