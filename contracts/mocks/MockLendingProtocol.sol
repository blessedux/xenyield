// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MockLendingProtocol {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public yields;
    uint256 public mockAPY = 1000; // 10%

    constructor(address _token) {
        token = IERC20(_token);
    }

    function deposit(uint256 amount) external returns (bool) {
        token.safeTransferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] += amount;
        return true;
    }

    function withdraw(uint256 amount) external returns (uint256) {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        deposits[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
        return amount;
    }

    function getBalance(address account) external view returns (uint256) {
        return deposits[account];
    }

    function claimYield() external returns (uint256) {
        uint256 yieldAmount = calculateYield(msg.sender);
        yields[msg.sender] += yieldAmount;
        token.safeTransfer(msg.sender, yieldAmount);
        return yieldAmount;
    }

    // Mock functions
    function setMockAPY(uint256 _apy) external {
        mockAPY = _apy;
    }

    function calculateYield(address account) public view returns (uint256) {
        return (deposits[account] * mockAPY) / 10000;
    }
} 