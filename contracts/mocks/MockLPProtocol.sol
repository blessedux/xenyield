// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MockLPProtocol {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    mapping(address => uint256) public lpTokens;
    mapping(address => uint256) public yields;
    uint256 public mockAPY = 2000; // 20%
    uint256 public constant LP_RATIO = 1e18; // 1:1 ratio for simplicity

    constructor(address _token) {
        token = IERC20(_token);
    }

    function addLiquidity(uint256 amount) external returns (uint256) {
        token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 lpAmount = (amount * LP_RATIO) / 1e18;
        lpTokens[msg.sender] += lpAmount;
        return lpAmount;
    }

    function removeLiquidity(uint256 lpAmount) external returns (uint256) {
        require(lpTokens[msg.sender] >= lpAmount, "Insufficient LP tokens");
        uint256 tokenAmount = (lpAmount * 1e18) / LP_RATIO;
        lpTokens[msg.sender] -= lpAmount;
        token.safeTransfer(msg.sender, tokenAmount);
        return tokenAmount;
    }

    function getBalance(address account) external view returns (uint256) {
        return (lpTokens[account] * 1e18) / LP_RATIO;
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
        uint256 tokenValue = (lpTokens[account] * 1e18) / LP_RATIO;
        return (tokenValue * mockAPY) / 10000;
    }
} 