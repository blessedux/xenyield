// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract XenYieldPool is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Structs
    struct Session {
        uint256 id;
        uint256 totalStaked;
        uint256 startTime;
        uint256 duration;
        uint8 riskLevel; // 1: Conservative, 2: Balanced, 3: Aggressive
        bool isActive;
        mapping(address => PlayerState) players;
    }

    struct PlayerState {
        uint256 stakedAmount;
        uint256 joinTime;
        bool isAlive;
        bool hasWithdrawn;
    }

    // State variables
    uint256 public sessionCounter;
    mapping(uint256 => Session) public sessions;
    IERC20 public immutable stakingToken; // USDC on Mantle
    uint256 public totalValueLocked;
    
    // Events
    event SessionCreated(uint256 indexed sessionId, uint8 riskLevel, uint256 duration);
    event PlayerJoined(uint256 indexed sessionId, address indexed player, uint256 amount);
    event PlayerKilled(uint256 indexed sessionId, address indexed player);
    event RewardsDistributed(uint256 indexed sessionId, address indexed player, uint256 amount);
    event EmergencyWithdrawn(address indexed player, uint256 amount);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    // Core functions
    function createSession(uint8 _riskLevel, uint256 _duration) external onlyOwner {
        require(_riskLevel >= 1 && _riskLevel <= 3, "Invalid risk level");
        require(_duration >= 20 minutes && _duration <= 50 minutes, "Invalid duration");

        sessionCounter++;
        Session storage newSession = sessions[sessionCounter];
        newSession.id = sessionCounter;
        newSession.riskLevel = _riskLevel;
        newSession.duration = _duration;
        newSession.startTime = block.timestamp;
        newSession.isActive = true;

        emit SessionCreated(sessionCounter, _riskLevel, _duration);
    }

    function joinSession(uint256 _sessionId, uint256 _amount) external nonReentrant whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");
        Session storage session = sessions[_sessionId];
        require(session.isActive, "Session not active");
        require(block.timestamp < session.startTime + session.duration, "Session expired");

        // Transfer tokens from player
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Update state
        session.players[msg.sender].stakedAmount = _amount;
        session.players[msg.sender].joinTime = block.timestamp;
        session.players[msg.sender].isAlive = true;
        session.totalStaked += _amount;
        totalValueLocked += _amount;

        emit PlayerJoined(_sessionId, msg.sender, _amount);
    }

    function killPlayer(uint256 _sessionId, address _player) external onlyOwner {
        Session storage session = sessions[_sessionId];
        require(session.isActive, "Session not active");
        require(session.players[_player].isAlive, "Player not alive or not in session");

        session.players[_player].isAlive = false;
        emit PlayerKilled(_sessionId, _player);
    }

    function distributeRewards(
        uint256 _sessionId, 
        address _player, 
        uint256 _rewardAmount
    ) external onlyOwner {
        Session storage session = sessions[_sessionId];
        require(!session.players[_player].hasWithdrawn, "Already withdrawn");
        require(session.players[_player].isAlive, "Player was killed");
        
        session.players[_player].hasWithdrawn = true;
        stakingToken.safeTransfer(_player, _rewardAmount);
        
        emit RewardsDistributed(_sessionId, _player, _rewardAmount);
    }

    // Emergency functions
    function emergencyWithdraw() external nonReentrant {
        uint256 stakedAmount = 0;
        for (uint256 i = 1; i <= sessionCounter; i++) {
            Session storage session = sessions[i];
            if (session.players[msg.sender].stakedAmount > 0 && !session.players[msg.sender].hasWithdrawn) {
                stakedAmount += session.players[msg.sender].stakedAmount;
                session.players[msg.sender].hasWithdrawn = true;
            }
        }
        
        require(stakedAmount > 0, "No stakes to withdraw");
        stakingToken.safeTransfer(msg.sender, stakedAmount);
        emit EmergencyWithdrawn(msg.sender, stakedAmount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
} 