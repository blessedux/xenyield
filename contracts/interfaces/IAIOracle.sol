// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IAIOracle {
    struct YieldPrediction {
        address protocol;
        uint256 expectedAPY;
        uint256 confidence;
        uint256 timestamp;
    }

    struct AllocationSuggestion {
        address protocol;
        uint256 allocation;
        uint8 risk;
    }

    // Core functions
    function getOptimalAllocations(
        uint256 totalFunds,
        uint8 riskLevel
    ) external view returns (AllocationSuggestion[] memory);

    function predictYield(
        address protocol
    ) external view returns (YieldPrediction memory);

    function validateStrategy(
        address protocol,
        uint256 allocation,
        uint8 risk
    ) external view returns (bool isValid, string memory reason);

    // Update functions
    function updateYieldData(address protocol) external returns (bool);
    function refreshAllocations() external returns (bool);

    // Events
    event YieldPredictionUpdated(address protocol, uint256 expectedAPY);
    event AllocationSuggestionGenerated(uint256 timestamp);
    event RiskAssessmentUpdated(address protocol, uint8 newRiskLevel);
} 