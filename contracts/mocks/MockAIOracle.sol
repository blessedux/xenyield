// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IAIOracle.sol";

contract MockAIOracle is IAIOracle {
    mapping(address => YieldPrediction) public predictions;
    mapping(uint8 => AllocationSuggestion[]) public riskAllocations;

    function getOptimalAllocations(
        uint256 totalFunds,
        uint8 riskLevel
    ) external view override returns (AllocationSuggestion[] memory) {
        return riskAllocations[riskLevel];
    }

    function predictYield(
        address protocol
    ) external view override returns (YieldPrediction memory) {
        return predictions[protocol];
    }

    function validateStrategy(
        address protocol,
        uint256 allocation,
        uint8 risk
    ) external pure override returns (bool isValid, string memory reason) {
        return (true, "Mock validation passed");
    }

    function updateYieldData(address protocol) external override returns (bool) {
        predictions[protocol] = YieldPrediction({
            protocol: protocol,
            expectedAPY: 1000, // 10%
            confidence: 8500,  // 85%
            timestamp: block.timestamp
        });
        emit YieldPredictionUpdated(protocol, 1000);
        return true;
    }

    function refreshAllocations() external override returns (bool) {
        emit AllocationSuggestionGenerated(block.timestamp);
        return true;
    }

    // Mock data setup functions
    function setMockPrediction(
        address protocol,
        uint256 expectedAPY,
        uint256 confidence
    ) external {
        predictions[protocol] = YieldPrediction({
            protocol: protocol,
            expectedAPY: expectedAPY,
            confidence: confidence,
            timestamp: block.timestamp
        });
        emit YieldPredictionUpdated(protocol, expectedAPY);
    }

    function setMockAllocations(
        uint8 riskLevel,
        AllocationSuggestion[] calldata allocations
    ) external {
        delete riskAllocations[riskLevel];
        for (uint i = 0; i < allocations.length; i++) {
            riskAllocations[riskLevel].push(allocations[i]);
        }
        emit AllocationSuggestionGenerated(block.timestamp);
    }
} 