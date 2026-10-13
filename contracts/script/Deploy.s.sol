// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MemoryRegistry.sol";
import "../src/StreetMuralEpoch.sol";
import "../src/NeighborhoodTreasury.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MemoryRegistry registry = new MemoryRegistry();
        StreetMuralEpoch mural = new StreetMuralEpoch();
        NeighborhoodTreasury treasury = new NeighborhoodTreasury();

        console2.log("MemoryRegistry", address(registry));
        console2.log("StreetMuralEpoch", address(mural));
        console2.log("NeighborhoodTreasury", address(treasury));

        vm.stopBroadcast();
    }
}
