// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IYieldStrategy.sol";
import "./interfaces/IAIOracle.sol";

contract StrategyManager is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Strategy {
        address protocol;
        uint256 allocation;
        uint256 expectedAPY;
        uint8 risk;
        bool active;
    }

    // State variables
    mapping(address => Strategy) public strategies;
    address[] public activeStrategies;
    address public aiOracle;
    uint256 public totalAllocated;
    IERC20 public immutable stakingToken;
    uint256 public constant MAX_STRATEGIES = 10;
    uint256 public constant ALLOCATION_DENOMINATOR = 10000; // 100% = 10000

    // Events
    event StrategyAdded(address protocol, uint256 allocation, uint256 expectedAPY);
    event StrategyUpdated(address protocol, uint256 newAllocation);
    event RebalanceExecuted(uint256 timestamp);
    event AIOracleUpdated(address newOracle);
    event YieldHarvested(address strategy, uint256 amount);
    event EmergencyWithdraw(address strategy, uint256 amount);

    constructor(address _aiOracle, address _stakingToken) {
        require(_aiOracle != address(0), "Invalid AI oracle address");
        require(_stakingToken != address(0), "Invalid staking token address");
        aiOracle = _aiOracle;
        stakingToken = IERC20(_stakingToken);
    }

    // Strategy management functions
    function addStrategy(
        address _protocol,
        uint256 _allocation,
        uint256 _expectedAPY,
        uint8 _risk
    ) external onlyOwner {
        require(_protocol != address(0), "Invalid protocol address");
        require(_risk >= 1 && _risk <= 3, "Invalid risk level");
        require(activeStrategies.length < MAX_STRATEGIES, "Max strategies reached");
        require(!strategies[_protocol].active, "Strategy already exists");

        strategies[_protocol] = Strategy({
            protocol: _protocol,
            allocation: _allocation,
            expectedAPY: _expectedAPY,
            risk: _risk,
            active: true
        });
        activeStrategies.push(_protocol);
        totalAllocated += _allocation;
        require(totalAllocated <= ALLOCATION_DENOMINATOR, "Total allocation exceeds 100%");

        emit StrategyAdded(_protocol, _allocation, _expectedAPY);
    }

    function updateAllocation(address _protocol, uint256 _newAllocation) external onlyOwner {
        require(strategies[_protocol].active, "Strategy not active");
        
        uint256 oldAllocation = strategies[_protocol].allocation;
        totalAllocated = totalAllocated - oldAllocation + _newAllocation;
        require(totalAllocated <= ALLOCATION_DENOMINATOR, "Total allocation exceeds 100%");
        
        strategies[_protocol].allocation = _newAllocation;
        emit StrategyUpdated(_protocol, _newAllocation);
    }

    function rebalanceStrategies() external nonReentrant {
        require(msg.sender == aiOracle, "Only AI Oracle can rebalance");
        
        uint256 totalFunds = stakingToken.balanceOf(address(this));
        require(totalFunds > 0, "No funds to allocate");

        for (uint256 i = 0; i < activeStrategies.length; i++) {
            address protocol = activeStrategies[i];
            Strategy memory strategy = strategies[protocol];
            if (!strategy.active) continue;

            uint256 targetAmount = (totalFunds * strategy.allocation) / ALLOCATION_DENOMINATOR;
            IYieldStrategy yieldStrategy = IYieldStrategy(protocol);
            
            uint256 currentBalance = yieldStrategy.getBalance();
            if (currentBalance < targetAmount) {
                uint256 depositAmount = targetAmount - currentBalance;
                stakingToken.safeApprove(protocol, depositAmount);
                yieldStrategy.deposit(depositAmount);
            } else if (currentBalance > targetAmount) {
                yieldStrategy.withdraw(currentBalance - targetAmount);
            }
        }

        emit RebalanceExecuted(block.timestamp);
    }

    function harvestYield(address _protocol) external nonReentrant returns (uint256) {
        require(strategies[_protocol].active, "Strategy not active");
        IYieldStrategy strategy = IYieldStrategy(_protocol);
        uint256 yieldAmount = strategy.getYield();
        require(yieldAmount > 0, "No yield to harvest");

        emit YieldHarvested(_protocol, yieldAmount);
        return yieldAmount;
    }

    function emergencyWithdrawFromStrategy(address _protocol) external onlyOwner {
        require(strategies[_protocol].active, "Strategy not active");
        IYieldStrategy strategy = IYieldStrategy(_protocol);
        uint256 withdrawn = strategy.emergencyWithdraw();
        strategies[_protocol].active = false;
        totalAllocated -= strategies[_protocol].allocation;

        emit EmergencyWithdraw(_protocol, withdrawn);
    }

    function updateAIOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "Invalid oracle address");
        aiOracle = _newOracle;
        emit AIOracleUpdated(_newOracle);
    }

    // View functions
    function getActiveStrategies() external view returns (address[] memory) {
        return activeStrategies;
    }

    function getTotalExpectedAPY() external view returns (uint256) {
        uint256 totalAPY = 0;
        for (uint256 i = 0; i < activeStrategies.length; i++) {
            Strategy memory strategy = strategies[activeStrategies[i]];
            if (strategy.active) {
                totalAPY += (strategy.expectedAPY * strategy.allocation) / ALLOCATION_DENOMINATOR;
            }
        }
        return totalAPY;
    }
} 