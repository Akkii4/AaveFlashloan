// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../interfaces/IFlashLoanReceiver.sol";
import "../interfaces/ILendingPoolAddressProvider.sol";
import "../interfaces/ILendingPool.sol";

abstract contract FlashLoanReceiverBase is IFlashLoanReceiver {
    using SafeERC20 for IERC20;
    using SafeMath for uint;

    ILendingPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    ILendingPool public immutable LENDING_POOL;

    receive() external payable {}

    constructor(address provider) {
        ADDRESSES_PROVIDER = ILendingPoolAddressesProvider(provider);
        LENDING_POOL = ILendingPool(ADDRESSES_PROVIDER.getLendingPool());
    }
}
