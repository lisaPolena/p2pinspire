// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//import "hardhat/console.sol";
import {Board, Pin} from "./common/types.sol";

/**
 * @title BoardManager
 * @dev A smart contract for managing boards
 */
contract BoardManager {
    /**
     * @dev Event emitted when a new board is created
     * @param boardId ID of the board created
     * @param boardName Name of the board created
     * @param owner Owner of the board created
     */
    event BoardCreated(
        uint256 boardId,
        string boardName,
        address indexed owner
    );

    /**
     * @dev Event emitted when a board is deleted
     * @param boardId ID of the board deleted
     */
    event BoardDeleted(uint256 boardId);

    /**
     * @dev Event emitted when a board is edited
     * @param boardId ID of the board edited
     * @param newName New name of the board edited
     */
    event BoardEdited(uint256 boardId, string newName);

    /**
     * @dev Event emitted when a pin is saved to a board
     * @param pinId ID of the saved pin
     * @param boardId ID of the board the pin is saved to
     */
    event PinSaved(uint256 pinId, uint256 boardId);

    /**
     * @dev Mapping to store boards by their ID
     */
    mapping(uint256 => Board) public boards;

    /**
     * @dev Number of boards created
     */
    uint256 public currentBoardId;

    /**
     * @dev Create a new board
     * @param boardName Name of the board to create
     * Requirements:
     * - boardName cannot be an empty string
     */
    function createBoard(string memory boardName) public returns (uint256) {
        require(bytes(boardName).length != 0, "Board name cannot be empty.");
        currentBoardId++;
        uint256[] memory pins;
        Board memory board = Board(currentBoardId, boardName, msg.sender, pins);
        boards[currentBoardId] = board;
        emit BoardCreated(currentBoardId, boardName, msg.sender);
        return currentBoardId;
    }

    /**
     * @dev Delete an existing board
     * @param boardId ID of the board to delete
     * Requirements:
     * - Only the board owner can delete the board
     */
    function deleteBoard(uint256 boardId) public {
        require(boardId <= currentBoardId, "Board does not exist.");
        require(
            msg.sender == boards[boardId].owner,
            "Only the board owner can delete the board."
        );
        emit BoardDeleted(boardId);
        delete boards[boardId];
    }

    /**
     * @dev Get board information by its ID
     * @param boardId ID of the board to get
     * @return Board struct containing board information
     * Requirements:
     * - Board with the given ID must exist
     */
    function getBoardById(uint256 boardId) public view returns (Board memory) {
        require(boardId <= currentBoardId, "Board does not exist.");
        require(boards[boardId].owner != address(0), "Board does not exist.");
        return boards[boardId];
    }

    /**
     * @dev Get all boards
     * @return Board[] array containing all the boards
     */
    function getAllBoards() public view returns (Board[] memory) {
        Board[] memory allBoards = new Board[](currentBoardId);
        uint index = 0;

        for (uint i = 1; i <= currentBoardId; i++) {
            if (boards[i].owner != address(0)) {
                allBoards[index] = boards[i];
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
     * @dev Save a new pin to a board
     * @param boardId ID of the board to save the pin to
     * @param pinId ID of the pin to save
     * @return uint256 ID of the saved pin
     * Requirements:
     * - Board with the given ID must exist
     * - Pin ID must be unique within the board
     */
    function savePinToBoard(
        uint256 boardId,
        uint256 pinId
    ) public returns (uint256) {
        require(boardId <= currentBoardId, "Board does not exist.");

        Board storage board = boards[boardId];
        require(pinId > 0, "Pin ID must be greater than zero.");

        board.pins.push(pinId);

        emit PinSaved(pinId, boardId);

        return pinId;
    }
}
