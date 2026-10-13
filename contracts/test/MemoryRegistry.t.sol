// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MemoryRegistry.sol";

contract MemoryRegistryTest is Test {
    MemoryRegistry registry;

    function setUp() public {
        registry = new MemoryRegistry();
    }

    function testRegisterMemoryEmitsAndStores() public {
        bytes32 memoryId = keccak256("mem_1");
        bytes32 contentHash = keccak256("story");
        bytes32 placeId = keccak256("place_tea");
        bytes32 layerId = keccak256("NOW");

        vm.expectEmit(true, true, true, true);
        emit MemoryRegistry.MemoryRegistered(memoryId, contentHash, placeId, layerId, address(this));

        registry.registerMemory(memoryId, contentHash, placeId, layerId);

        MemoryRegistry.Registration memory reg = registry.getMemory(memoryId);
        assertEq(reg.contentHash, contentHash);
        assertTrue(registry.registered(memoryId));
    }

    function testCannotRegisterTwice() public {
        bytes32 memoryId = keccak256("mem_1");
        registry.registerMemory(memoryId, keccak256("a"), keccak256("p"), keccak256("NOW"));
        vm.expectRevert(MemoryRegistry.AlreadyRegistered.selector);
        registry.registerMemory(memoryId, keccak256("b"), keccak256("p"), keccak256("NOW"));
    }
}
