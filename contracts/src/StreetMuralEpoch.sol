// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title StreetMuralEpoch
/// @notice Records finalized mural epochs. There are no winning memories.
contract StreetMuralEpoch {
    struct Epoch {
        bytes32 placeId;
        uint64 epochNumber;
        bytes32 seed;
        bytes32 contributionCommitment;
        bytes32 artworkHash;
        bytes32 engineVersion;
        uint64 createdAt;
    }

    address public owner;
    mapping(bytes32 => mapping(uint64 => Epoch)) public epochs;
    mapping(bytes32 => uint64) public latestEpoch;

    event EpochFinalized(
        bytes32 indexed placeId,
        uint64 indexed epochNumber,
        bytes32 seed,
        bytes32 contributionCommitment,
        bytes32 artworkHash,
        bytes32 engineVersion
    );

    error NotOwner();
    error InvalidEpoch();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function finalizeEpoch(
        bytes32 placeId,
        uint64 epochNumber,
        bytes32 seed,
        bytes32 contributionCommitment,
        bytes32 artworkHash,
        bytes32 engineVersion
    ) external onlyOwner {
        if (placeId == bytes32(0) || artworkHash == bytes32(0)) revert InvalidEpoch();
        if (epochNumber == 0 || epochNumber != latestEpoch[placeId] + 1) revert InvalidEpoch();

        epochs[placeId][epochNumber] = Epoch({
            placeId: placeId,
            epochNumber: epochNumber,
            seed: seed,
            contributionCommitment: contributionCommitment,
            artworkHash: artworkHash,
            engineVersion: engineVersion,
            createdAt: uint64(block.timestamp)
        });
        latestEpoch[placeId] = epochNumber;

        emit EpochFinalized(
            placeId,
            epochNumber,
            seed,
            contributionCommitment,
            artworkHash,
            engineVersion
        );
    }
}
