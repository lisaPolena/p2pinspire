// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//import "hardhat/console.sol";
import {Board, Pin} from "./common/types.sol";
import {Functions} from "./common/functions.sol";

/**
 * @title BoardManager
 * @dev A smart contract for managing boards
 */
contract BoardManager {
    /**
     * @dev Mapping to store boards by their ID
     */
    mapping(bytes16 => Board) public boards;

    /**
     * @dev Number of boards created
     */
    uint public boardCount;

    /**
     * @dev Create a new board
     * @param boardName Name of the board to create
     * Requirements:
     * - boardName cannot be an empty string
     */
    function createBoard(string memory boardName) public {
        require(bytes(boardName).length != 0, "Board name cannot be empty.");
        bytes16[] memory pins;
        bytes16 id = Functions(new Functions()).generateId();
        Board memory board = Board(id, boardName, msg.sender, pins);
        boards[id] = board;
        boardCount++;
    }

    /**
     * @dev Delete an existing board
     * @param boardId ID of the board to delete
     * Requirements:
     * - Only the board owner can delete the board
     */
    function deleteBoard(bytes16 boardId) public {
        require(
            msg.sender == boards[boardId].owner,
            "Only the board owner can delete the board."
        );
        delete boards[boardId];
    }

    /**
     * @dev Get board information by its ID
     * @param boardId ID of the board to get
     * @return Board struct containing board information
     * Requirements:
     * - Board with the given ID must exist
     */
    function getBoardById(bytes16 boardId) public view returns (Board memory) {
        require(boards[boardId].owner != address(0), "Board does not exist.");
        return boards[boardId];
    }

    /**
     * @dev Get all boards
     * @return Board[] array containing all the boards
     */
    function getAllBoards() public returns (Board[] memory) {
        Board[] memory allBoards = new Board[](boardCount);
        uint index = 0;

        for (uint i = 0; i < boardCount; i++) {
            bytes16 boardId = Functions(new Functions()).uintToBytes16(i);
            if (boards[boardId].owner != address(0)) {
                allBoards[index] = boards[boardId];
                index++;
            }
        }

        // Resize the allBoards array to remove any unused elements
        assembly {
            mstore(allBoards, index)
        }

        return allBoards;
    }

    /**
     * @dev Edit board information
     * @param boardId ID of the board to edit
     * @param newName New name for the board
     * Requirements:
     * - Only the board owner can edit the board
     * - Board with the given ID must exist
     */
    function editBoard(bytes16 boardId, string memory newName) public {
        require(
            msg.sender == boards[boardId].owner,
            "Only the board owner can edit the board."
        );
        require(bytes(newName).length != 0, "New board name cannot be empty.");

        boards[boardId].name = newName;
    }
}
