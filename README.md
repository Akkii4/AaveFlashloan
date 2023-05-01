# Aave Flash Arbitrage Hardhat Project

This is a Hardhat project that implements a flash arbitrage strategy on the Aave protocol.

## Requirements

- Node.js v14 or later
- Hardhat

## Installation

Clone this repository and install the required dependencies:

```
git clone https://github.com/Akkii4/AaveFlashloan.git
cd AaveFlashloan
npm install
```

## Usage

To compile the contracts:

```
npx hardhat compile
```

To run the tests:

```
npx hardhat test
```

To deploy the contracts on ETH Mainnet Fork:

```
npm run deploy
```

## Contracts

### AaveFlash

This contract is the entry point for the flash arbitrage strategy. It receives flash loans from the Aave protocol and calls the `performArbitrage` function in the `Arbitrage` contract to execute the arbitrage logic.

### Arbitrage

This contract performs the actual arbitrage logic. It checks if the balance of the specified token is sufficient to perform the arbitrage and transfers the token balance to the caller. The `minRequiredFunds` variable can be set by the owner to specify the minimum required balance to perform the arbitrage.

## License

This project is licensed under the [MIT License](LICENSE).
