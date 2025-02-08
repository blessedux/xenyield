// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IYieldStrategy.sol";

abstract contract BaseStrategy is IYieldStrategy, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // State variables
    string public override name;
    address public override protocol;
    uint8 public override riskLevel;
    uint256 public override expectedAPY;
    
    IERC20 public immutable stakingToken;
    uint256 public totalDeposited;
    uint256 public lastHarvestYield;
    uint256 public lastHarvestTimestamp;

    constructor(
        string memory _name,
        address _protocol,
        uint8 _riskLevel,
        address _stakingToken
    ) {
        require(_protocol != address(0), "Invalid protocol address");
        require(_stakingToken != address(0), "Invalid token address");
        require(_riskLevel > 0 && _riskLevel <= 3, "Invalid risk level");
        
        name = _name;
        protocol = _protocol;
        riskLevel = _riskLevel;
        stakingToken = IERC20(_stakingToken);
    }

    // Core functions that must be implemented by specific strategies
    function _depositToProtocol(uint256 amount) internal virtual returns (bool);
    function _withdrawFromProtocol(uint256 amount) internal virtual returns (uint256);
    function _getProtocolBalance() internal virtual view returns (uint256);
    function _harvestYield() internal virtual returns (uint256);

    // Implemented functions
    function deposit(uint256 amount) external override nonReentrant returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        bool success = _depositToProtocol(amount);
        require(success, "Deposit to protocol failed");
        
        totalDeposited += amount;
        emit Deposited(amount);
        return true;
    }

    function withdraw(uint256 amount) external override nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= totalDeposited, "Insufficient balance");
        
        uint256 withdrawn = _withdrawFromProtocol(amount);
        require(withdrawn > 0, "Withdrawal failed");
        
        totalDeposited -= withdrawn;
        stakingToken.safeTransfer(msg.sender, withdrawn);
        
        emit Withdrawn(withdrawn);
        return withdrawn;
    }

    function withdrawAll() external override nonReentrant returns (uint256) {
        uint256 balance = getBalance();
        require(balance > 0, "No balance to withdraw");
        
        uint256 withdrawn = _withdrawFromProtocol(balance);
        require(withdrawn > 0, "Withdrawal failed");
        
        totalDeposited = 0;
        stakingToken.safeTransfer(msg.sender, withdrawn);
        
        emit Withdrawn(withdrawn);
        return withdrawn;
    }

    function getBalance() public view override returns (uint256) {
        return _getProtocolBalance();
    }

    function getYield() external override returns (uint256) {
        uint256 harvestedYield = _harvestYield();
        lastHarvestYield = harvestedYield;
        lastHarvestTimestamp = block.timestamp;
        
        emit YieldHarvested(harvestedYield);
        return harvestedYield;
    }

    function emergencyWithdraw() external override onlyOwner returns (uint256) {
        uint256 balance = getBalance();
        if (balance > 0) {
            uint256 withdrawn = _withdrawFromProtocol(balance);
            totalDeposited = 0;
            stakingToken.safeTransfer(owner(), withdrawn);
            emit EmergencyWithdrawn(withdrawn);
            return withdrawn;
        }
        return 0;
    }

    // Additional utility functions
    function updateExpectedAPY(uint256 _expectedAPY) external onlyOwner {
        expectedAPY = _expectedAPY;
    }
} 