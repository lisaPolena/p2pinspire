// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

library Functions {
    /**
     * @dev Generate a unique ID for a board
     * @return Unique bytes16 ID
     * Note: This implementation uses a hash of the sender's address, current block timestamp, and previous block's random number as the ID
     */
    function generateId() public view returns (bytes16) {
        bytes32 uuid = keccak256(
            abi.encodePacked(msg.sender, block.timestamp, block.difficulty)
        );
        bytes16 id;
        assembly {
            id := uuid
        }
        return id;
    }

    /**
     * @dev Helper function to convert a uint256 to bytes16
     * @param x The uint256 value to convert
     * @return bytes16 representation of the input
     */
    function uintToBytes16(uint256 x) public pure returns (bytes16) {
        bytes16 b;
        assembly {
            b := x
        }
        return b;
    }
}
