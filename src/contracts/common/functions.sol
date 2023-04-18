// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Functions {
    /**
     * @dev Generate a unique ID for a board
     * @return Unique bytes16 ID
     * Note: This implementation uses a hash of the sender's address, current block timestamp, and previous block's random number as the ID
     */
    function generateId() public view returns (bytes16) {
        bytes32 uuid = keccak256(
            abi.encodePacked(msg.sender, block.timestamp, block.prevrandao)
        );
        bytes16 id;
        assembly {
            id := uuid
        }
        return id;
    }
}
