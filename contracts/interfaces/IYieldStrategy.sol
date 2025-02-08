// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IYieldStrategy {
    // Strategy information
    function name() external view returns (string memory);
    function protocol() external view returns (address);
    function riskLevel() external view returns (uint8);
    function expectedAPY() external view returns (uint256);
    
    // Core functions
    function deposit(uint256 amount) external returns (bool);
    function withdraw(uint256 amount) external returns (uint256);
    function withdrawAll() external returns (uint256);
    function getBalance() external view returns (uint256);
    function getYield() external view returns (uint256);
    
    // Emergency functions
    function emergencyWithdraw() external returns (uint256);
    
    // Events
    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);
    event YieldHarvested(uint256 amount);
    event EmergencyWithdrawn(uint256 amount);
} 