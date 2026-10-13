// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title NeighborhoodTreasury
/// @notice Optional preservation pool. MUST NOT affect story ranking.
contract NeighborhoodTreasury {
    address public owner;
    mapping(bytes32 => uint256) public placeBalances;
    uint256 public totalBalance;

    event Contribution(
        bytes32 indexed placeId,
        address indexed donor,
        uint256 amount,
        string purpose
    );

    error NotOwner();
    error ZeroAmount();
    error InvalidPurpose();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function contribute(bytes32 placeId, string calldata purpose) external payable {
        if (msg.value == 0) revert ZeroAmount();
        if (bytes(purpose).length == 0) revert InvalidPurpose();

        placeBalances[placeId] += msg.value;
        totalBalance += msg.value;
        emit Contribution(placeId, msg.sender, msg.value, purpose);
    }
}
