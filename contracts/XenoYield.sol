// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract XenoYield is Ownable, ReentrancyGuard {
    struct Player {
        uint256 stake;
        uint8 lives;
        bool isAlive;
        uint256 exoplanetId;
    }

    struct Session {
        uint256 id;
        address[] players;
        uint256 startTime;
        uint256 duration;
        uint256 totalStake;
        mapping(address => Player) playerInfo;
        bool isActive;
    }

    struct Exoplanet {
        string name;
        uint8 difficulty;
        uint256 baseReward;
    }

    mapping(uint256 => Session) public sessions;
    mapping(uint256 => Exoplanet) public exoplanets;
    uint256 public nextSessionId;
    uint256 public exoplanetCount;

    event SessionCreated(uint256 sessionId, uint256 startTime, uint256 duration);
    event PlayerJoined(uint256 sessionId, address player, uint256 stake, uint256 exoplanetId);
    event RewardDistributed(uint256 sessionId, address player, uint256 reward);
    event PlayerLivesReduced(uint256 sessionId, address player, uint8 livesRemaining);
    event ExoplanetAdded(uint256 exoplanetId, string name, uint8 difficulty, uint256 baseReward);

    modifier onlyActiveSession(uint256 _sessionId) {
        require(sessions[_sessionId].isActive, "Session is not active");
        _;
    }

    modifier onlySessionPlayer(uint256 _sessionId) {
        require(sessions[_sessionId].playerInfo[msg.sender].stake > 0, "Not a session player");
        _;
    }

    function createSession(uint256 _duration) external onlyOwner {
        uint256 sessionId = nextSessionId++;
        Session storage newSession = sessions[sessionId];
        newSession.id = sessionId;
        newSession.startTime = block.timestamp;
        newSession.duration = _duration;
        newSession.isActive = true;

        emit SessionCreated(sessionId, newSession.startTime, _duration);
    }

    function addExoplanet(string memory _name, uint8 _difficulty, uint256 _baseReward) external onlyOwner {
        exoplanetCount++;
        exoplanets[exoplanetCount] = Exoplanet(_name, _difficulty, _baseReward);
        emit ExoplanetAdded(exoplanetCount, _name, _difficulty, _baseReward);
    }

    function joinSession(uint256 _sessionId, uint256 _exoplanetId) external payable onlyActiveSession(_sessionId) {
        Session storage session = sessions[_sessionId];
        Exoplanet storage exoplanet = exoplanets[_exoplanetId];
        
        require(block.timestamp < session.startTime + session.duration, "Session has ended");
        require(session.players.length < 10, "Session is full");
        require(_exoplanetId > 0 && _exoplanetId <= exoplanetCount, "Invalid exoplanet");

        uint256 requiredStake = exoplanet.baseReward / 2;
        require(msg.value >= requiredStake, "Insufficient stake");

        session.players.push(msg.sender);
        session.playerInfo[msg.sender] = Player({
            stake: msg.value,
            lives: 3,
            isAlive: true,
            exoplanetId: _exoplanetId
        });
        session.totalStake += msg.value;

        emit PlayerJoined(_sessionId, msg.sender, msg.value, _exoplanetId);
    }

    function reducePlayerLives(uint256 _sessionId, address _player) external onlyOwner onlyActiveSession(_sessionId) {
        Session storage session = sessions[_sessionId];
        Player storage player = session.playerInfo[_player];
        
        require(player.isAlive, "Player is not alive");
        
        if (player.lives > 1) {
            player.lives--;
        } else {
            player.isAlive = false;
        }

        emit PlayerLivesReduced(_sessionId, _player, player.lives);
    }

    function distributeRewards(uint256 _sessionId) external onlyOwner onlyActiveSession(_sessionId) nonReentrant {
        Session storage session = sessions[_sessionId];
        require(block.timestamp >= session.startTime + session.duration, "Session is still active");

        uint256 totalReward = session.totalStake;
        uint256 aliveCount = 0;

        for (uint256 i = 0; i < session.players.length; i++) {
            if (session.playerInfo[session.players[i]].isAlive) {
                aliveCount++;
            }
        }

        require(aliveCount > 0, "No players alive");

        uint256 rewardPerPlayer = totalReward / aliveCount;

        for (uint256 i = 0; i < session.players.length; i++) {
            address player = session.players[i];
            if (session.playerInfo[player].isAlive) {
                payable(player).transfer(rewardPerPlayer);
                emit RewardDistributed(_sessionId, player, rewardPerPlayer);
            }
        }

        session.isActive = false;
    }

    function getSessionInfo(uint256 _sessionId) external view returns (
        uint256 id,
        uint256 startTime,
        uint256 duration,
        uint256 totalStake,
        uint256 playerCount,
        bool isActive
    ) {
        Session storage session = sessions[_sessionId];
        return (
            session.id,
            session.startTime,
            session.duration,
            session.totalStake,
            session.players.length,
            session.isActive
        );
    }

    function getPlayerInfo(uint256 _sessionId, address _player) external view returns (
        uint256 stake,
        uint8 lives,
        bool isAlive,
        uint256 exoplanetId
    ) {
        Player storage player = sessions[_sessionId].playerInfo[_player];
        return (player.stake, player.lives, player.isAlive, player.exoplanetId);
    }
}

