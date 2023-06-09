// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./Arbitrage.sol";
import "./aave/abstract/FlashLoanReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AaveFlash is FlashLoanReceiverBase, Ownable {
    using SafeMath for uint256;
    event UpdatedArbitrageContract(
        address oldArbitrageContract,
        address newArbitrageContract
    );
    event BorrowedLog(uint256 amount);

    Arbitrage public arbitrageContract;

    constructor(
        ILendingPoolAddressesProvider _provider,
        address _arbitrageContract
    ) FlashLoanReceiverBase(_provider) {
        arbitrageContract = Arbitrage(_arbitrageContract);
    }

    function updateArbitrageContract(
        address _newArbitrageContract
    ) external onlyOwner {
        address _previousArbitrageContract = address(arbitrageContract);
        arbitrageContract = Arbitrage(_newArbitrageContract);
        emit UpdatedArbitrageContract(
            _previousArbitrageContract,
            _newArbitrageContract
        );
    }

    /**
     * @dev This function act as callback function and must be called only be the LENDING_POOL and takes care of repaying
     * active debt positions, migrating collateral and incurring new V2 debt token debt.
     *
     * @param assets The array of flash loaned assets used to repay debts.
     * @param amounts The array of flash loaned asset amounts used to repay debts.
     * @param premiums The array of premiums incurred as additional debts.
     * @param initiator The address that initiated the flash loan, unused.
     * @param params The byte array containing, in this case, the arrays of aTokens and aTokenAmounts.
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        //
        // This contract now has the funds requested.
        // Customised logic here eg. Arbitrage, Self Liquidation, Collateral Swapping.
        //
        arbitrageContract.performArbitrage(assets[0]);
        /**
         *  At the end of logic above, this contract owes
        the flashloaned amounts + premiums.
        Therefore ensure your contract has enough to repay
        these amounts.
         */

        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint i = 0; i < assets.length; i++) {
            emit BorrowedLog(amounts[i]);
            uint amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }
        // repayed
        return true;
    }

    /*
     *  Flash loan wei amount worth of `_asset`
     */
    function flashloan(address _asset, uint256 _amount) public onlyOwner {
        uint256 tokenBalance = IERC20(_asset).balanceOf(address(this));
        require(tokenBalance > _amount, "Insufficient Token Balance");

        //Multiple assets (tokens) to borrow
        address[] memory assets = new address[](1);
        assets[0] = _asset;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _amount;

        address receiverAddress = address(this);

        // Type of Borrowing :
        // 0 = no debt (flash loan),
        // 1 = stable rate borrowing,
        // 2 = variable rate borrowing
        uint[] memory modes = new uint[](1);
        modes[0] = 0;

        // Address which will be recieving the debt if not flash loan i.e mode is 1 or 2
        address onBehalfOf = address(this);
        bytes memory params = ""; // add on data to be passed as abi.encode(...)
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }
}
