// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Arbitrage is Ownable {
    using SafeERC20 for ERC20;
    event ArbitrageCompleted(address doer, uint doerBalance, uint amountDone);
    event Withdrawn(address indexed _assetAddress, uint amount);
    uint public minRequiredFunds;

    constructor(uint _minRequiredFunds) {
        minRequiredFunds = _minRequiredFunds;
    }

    function performArbitrage(address _tokenAddress) external {
        address operator = msg.sender;
        uint operatorBalance = IERC20(_tokenAddress).balanceOf(
            address(operator)
        );
        require(operatorBalance >= minRequiredFunds, "Not enough funds");
        uint256 _tokenBalance = IERC20(_tokenAddress).balanceOf(address(this));
        SafeERC20.safeTransfer(IERC20(_tokenAddress), operator, _tokenBalance);
        emit ArbitrageCompleted(operator, operatorBalance, _tokenBalance);
    }

    function updateMinRequiredFunds(uint _minRequiredFunds) external onlyOwner {
        minRequiredFunds = _minRequiredFunds;
    }

    /**
     * @dev Withdraw asset.
     * @param _assetAddress Asset to be withdrawn.
     */
    function withdraw(address _assetAddress) public onlyOwner {
        uint assetBalance;
        if (_assetAddress == address(0)) {
            assetBalance = address(this).balance;
            payable(msg.sender).transfer(assetBalance);
        } else {
            assetBalance = IERC20(_assetAddress).balanceOf(address(this));
            SafeERC20.safeTransfer(
                IERC20(_assetAddress),
                msg.sender,
                assetBalance
            );
        }
        emit Withdrawn(_assetAddress, assetBalance);
    }
}
