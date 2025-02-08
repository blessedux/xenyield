// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IRewardDistributor.sol";

contract RewardDistributor is IRewardDistributor, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // State variables
    IERC20 public immutable rewardToken;
    mapping(uint256 => mapping(address => PlayerReward)) public playerRewards;
    mapping(uint8 => uint256) public riskMultipliers;
    RewardConfig public rewardConfig;
    
    // Constants
    uint256 private constant MULTIPLIER_DENOMINATOR = 10000;
    uint256 private constant MAX_RISK_LEVEL = 3;

    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
        
        // Initialize default reward config
        rewardConfig = RewardConfig({
            baseReward: 100 * 10**18,  // 100 tokens base reward
            riskMultiplier: 150,       // 1.5x multiplier
            timeMultiplier: 110,       // 1.1x per 10 minutes
            survivalBonus: 200         // 2x bonus for survival
        });

        // Initialize risk multipliers
        riskMultipliers[1] = 100;  // Conservative: 1x
        riskMultipliers[2] = 150;  // Balanced: 1.5x
        riskMultipliers[3] = 250;  // Aggressive: 2.5x
    }

    function calculateReward(
        uint256 sessionId,
        address player,
        uint256 stakedAmount,
        uint256 duration,
        uint8 riskLevel,
        bool survived
    ) public view override returns (uint256 rewardAmount) {
        require(riskLevel > 0 && riskLevel <= MAX_RISK_LEVEL, "Invalid risk level");
        
        // Base calculation
        rewardAmount = (stakedAmount * rewardConfig.baseReward) / MULTIPLIER_DENOMINATOR;
        
        // Apply risk multiplier
        rewardAmount = (rewardAmount * riskMultipliers[riskLevel]) / MULTIPLIER_DENOMINATOR;
        
        // Apply time multiplier (every 10 minutes)
        uint256 timeMultiplier = ((duration / 600) * rewardConfig.timeMultiplier);
        rewardAmount = (rewardAmount * timeMultiplier) / MULTIPLIER_DENOMINATOR;
        
        // Apply survival bonus if applicable
        if (survived) {
            rewardAmount = (rewardAmount * rewardConfig.survivalBonus) / MULTIPLIER_DENOMINATOR;
        }
    }

    function distributeReward(
        uint256 sessionId,
        address player
    ) external override nonReentrant returns (uint256) {
        PlayerReward storage reward = playerRewards[sessionId][player];
        require(!reward.claimed, "Rewards already claimed");
        
        uint256 totalReward = reward.baseAmount + reward.bonusAmount - reward.penalties;
        require(totalReward > 0, "No rewards to claim");
        
        reward.claimed = true;
        rewardToken.safeTransfer(player, totalReward);
        
        emit RewardDistributed(sessionId, player, totalReward);
        return totalReward;
    }

    function batchDistributeRewards(
        uint256 sessionId,
        address[] calldata players
    ) external override nonReentrant returns (uint256) {
        uint256 totalDistributed = 0;
        
        for (uint256 i = 0; i < players.length; i++) {
            PlayerReward storage reward = playerRewards[sessionId][players[i]];
            if (!reward.claimed && (reward.baseAmount + reward.bonusAmount > reward.penalties)) {
                uint256 amount = reward.baseAmount + reward.bonusAmount - reward.penalties;
                reward.claimed = true;
                rewardToken.safeTransfer(players[i], amount);
                totalDistributed += amount;
                
                emit RewardDistributed(sessionId, players[i], amount);
            }
        }
        
        return totalDistributed;
    }

    // Configuration functions
    function setRewardConfig(RewardConfig calldata config) external override onlyOwner {
        rewardConfig = config;
        emit RewardConfigUpdated(config);
    }

    function setRiskMultiplier(uint8 riskLevel, uint256 multiplier) external override onlyOwner {
        require(riskLevel > 0 && riskLevel <= MAX_RISK_LEVEL, "Invalid risk level");
        riskMultipliers[riskLevel] = multiplier;
        emit RiskMultiplierUpdated(riskLevel, multiplier);
    }

    function setSurvivalBonus(uint256 bonus) external override onlyOwner {
        rewardConfig.survivalBonus = bonus;
        emit SurvivalBonusUpdated(bonus);
    }

    // View functions
    function getPendingRewards(
        uint256 sessionId,
        address player
    ) external view override returns (uint256) {
        PlayerReward storage reward = playerRewards[sessionId][player];
        if (reward.claimed) return 0;
        return reward.baseAmount + reward.bonusAmount - reward.penalties;
    }

    function getRewardConfig() external view override returns (RewardConfig memory) {
        return rewardConfig;
    }

    function getPlayerReward(
        uint256 sessionId,
        address player
    ) external view override returns (PlayerReward memory) {
        return playerRewards[sessionId][player];
    }
} 