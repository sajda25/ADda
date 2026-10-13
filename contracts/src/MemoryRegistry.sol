// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MemoryRegistry
/// @notice Registers memory content commitments. Does NOT store story text
///         or prove that a memory is historically true.
contract MemoryRegistry {
    struct Registration {
        bytes32 contentHash;
        bytes32 placeId;
        bytes32 layerId;
        address author;
        uint64 registeredAt;
    }

    address public owner;
    mapping(bytes32 => Registration) public memories;
    mapping(bytes32 => bool) public registered;

    event MemoryRegistered(
        bytes32 indexed memoryId,
        bytes32 indexed contentHash,
        bytes32 placeId,
        bytes32 layerId,
        address indexed author
    );

    error AlreadyRegistered();
    error ZeroHash();
    error NotOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerMemory(
        bytes32 memoryId,
        bytes32 contentHash,
        bytes32 placeId,
        bytes32 layerId
    ) external {
        if (contentHash == bytes32(0) || memoryId == bytes32(0)) revert ZeroHash();
        if (registered[memoryId]) revert AlreadyRegistered();

        memories[memoryId] = Registration({
            contentHash: contentHash,
            placeId: placeId,
            layerId: layerId,
            author: msg.sender,
            registeredAt: uint64(block.timestamp)
        });
        registered[memoryId] = true;

        emit MemoryRegistered(memoryId, contentHash, placeId, layerId, msg.sender);
    }

    function getMemory(bytes32 memoryId) external view returns (Registration memory) {
        return memories[memoryId];
    }
}
