// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract XenYieldToken is ERC20, ERC20Burnable, ERC20Snapshot, Ownable, Pausable {
    // Token distribution
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    uint256 public constant GAMEPLAY_REWARDS = 40_000_000 * 10**18; // 40%
    uint256 public constant STAKING_REWARDS = 25_000_000 * 10**18; // 25%
    uint256 public constant TREASURY = 15_000_000 * 10**18;        // 15%
    uint256 public constant TEAM = 10_000_000 * 10**18;           // 10%
    uint256 public constant MARKETING = 10_000_000 * 10**18;      // 10%

    // Addresses
    address public treasuryAddress;
    address public teamAddress;
    address public marketingAddress;
    address public rewardsPool;

    constructor(
        address _treasury,
        address _team,
        address _marketing,
        address _rewardsPool
    ) ERC20("XenYield", "XYLD") {
        require(_treasury != address(0), "Invalid treasury address");
        require(_team != address(0), "Invalid team address");
        require(_marketing != address(0), "Invalid marketing address");
        require(_rewardsPool != address(0), "Invalid rewards pool address");

        treasuryAddress = _treasury;
        teamAddress = _team;
        marketingAddress = _marketing;
        rewardsPool = _rewardsPool;

        // Mint initial distribution
        _mint(rewardsPool, GAMEPLAY_REWARDS + STAKING_REWARDS);
        _mint(treasuryAddress, TREASURY);
        _mint(teamAddress, TEAM);
        _mint(marketingAddress, MARKETING);
    }

    // Snapshot functionality
    function snapshot() external onlyOwner {
        _snapshot();
    }

    // Pause functionality
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Override required functions
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
} 