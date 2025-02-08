// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IRewardDistributor {
    struct RewardConfig {
        uint256 baseReward;
        uint256 riskMultiplier;
        uint256 timeMultiplier;
        uint256 survivalBonus;
    }

    struct PlayerReward {
        uint256 baseAmount;
        uint256 bonusAmount;
        uint256 penalties;
        bool claimed;
    }

    // Core distribution functions
    function calculateReward(
        uint256 sessionId,
        address player,
        uint256 stakedAmount,
        uint256 duration,
        uint8 riskLevel,
        bool survived
    ) external view returns (uint256 rewardAmount);

    function distributeReward(
        uint256 sessionId,
        address player
    ) external returns (uint256);

    function batchDistributeRewards(
        uint256 sessionId,
        address[] calldata players
    ) external returns (uint256);

    // Configuration functions
    function setRewardConfig(RewardConfig calldata config) external;
    function setRiskMultiplier(uint8 riskLevel, uint256 multiplier) external;
    function setSurvivalBonus(uint256 bonus) external;

    // View functions
    function getPendingRewards(
        uint256 sessionId,
        address player
    ) external view returns (uint256);

    function getRewardConfig() external view returns (RewardConfig memory);
    function getPlayerReward(
        uint256 sessionId,
        address player
    ) external view returns (PlayerReward memory);

    // Events
    event RewardDistributed(uint256 indexed sessionId, address indexed player, uint256 amount);
    event RewardConfigUpdated(RewardConfig config);
    event RiskMultiplierUpdated(uint8 riskLevel, uint256 multiplier);
    event SurvivalBonusUpdated(uint256 bonus);
} 