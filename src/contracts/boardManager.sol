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
     * @param boardDescription Description of the board created
     * @param owner Owner of the board created
     */
    event BoardCreated(
        uint256 boardId,
        string boardName,
        string boardDescription,
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
     * @param newDescription New description of the board edited
     * @param owner Owner of the board edited
     * @param pins Array of pin IDs saved to the board
     * @param boardCoverHash New IPFS hash of the board cover image
     */
    event BoardEdited(
        uint256 boardId,
        string newName,
        string newDescription,
        address indexed owner,
        uint256[] pins,
        string boardCoverHash
    );

    /**
     * @dev Event emitted when a pin is saved to a board
     * @param pinId ID of the saved pin
     * @param title Title of the pin saved
     * @param description Description of the pin saved
     * @param imageHash IPFS hash of the pin's image
     * @param boardId ID of the board the pin is saved to
     * @param owner Owner of the pin saved
     */
    event PinSaved(
        uint256 pinId,
        string title,
        string description,
        string imageHash,
        uint256 boardId,
        string owner
    );

    /**
     * @dev Event emitted when a saved pin is edited
     * @param pinId ID of the pin edited
     * @param oldBoardId ID of the old board
     * @param newBoardId ID of the new board
     */
    event SavedPinEdited(uint256 pinId, uint256 oldBoardId, uint256 newBoardId);

    /**
     * @dev Event emitted when a saved pin is deleted
     * @param pinId ID of the pin edited
     * @param boardId ID of the board
     */
    event SavedPinDeleted(uint256 pinId, uint256 boardId);

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
     * @param boardDescription Description of the board to create
     * Requirements:
     * - boardName cannot be an empty string
     */
    function createBoard(
        string memory boardName,
        string memory boardDescription
    ) public returns (uint256) {
        require(bytes(boardName).length != 0, "Board name cannot be empty.");
        currentBoardId++;
        uint256[] memory pins;
        string memory boardCoverHash;
        Board memory board = Board(
            currentBoardId,
            boardName,
            boardDescription,
            msg.sender,
            pins,
            boardCoverHash
        );
        boards[currentBoardId] = board;
        emit BoardCreated(
            currentBoardId,
            boardName,
            boardDescription,
            msg.sender
        );
        return currentBoardId;
    }

    /**
     * @dev Edit board information
     * @param boardId ID of the board to edit
     * @param newName New name for the board
     * @param newDescription New description for the board
     * @param boardCoverHash New IPFS hash of the board cover image
     * Requirements:
     * - Only the board owner can edit the board
     * - Board with the given ID must exist
     */
    function editBoard(
        uint256 boardId,
        string memory newName,
        string memory newDescription,
        string memory boardCoverHash
    ) public {
        require(
            msg.sender == boards[boardId].owner,
            "Only the board owner can edit the board."
        );
        require(bytes(newName).length != 0, "New board name cannot be empty.");

        boards[boardId].name = newName;
        boards[boardId].description = newDescription;
        boards[boardId].boardCoverHash = boardCoverHash;

        emit BoardEdited(
            boardId,
            newName,
            newDescription,
            boards[boardId].owner,
            boards[boardId].pins,
            boardCoverHash
        );
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
     * @dev Delete all boards from a user
     * Requirements:
     * - Only the board owner can delete the boards
     */
    function deleteAllBoardsFromUser() public {
        for (uint256 i = 1; i <= currentBoardId; i++) {
            if (boards[i].owner == msg.sender) {
                delete boards[i];
            }
        }
    }

    /**
     * @dev Get board information by its ID
     * @param boardId ID of the board to get
     * @return Board struct containing board information
     * Requirements:
     * - Board ID cannot be zero
     * - Board with the given ID must exist
     */
    function getBoardById(uint256 boardId) public view returns (Board memory) {
        require(boardId != 0, "Board ID cannot be zero.");
        require(boardId <= currentBoardId, "Board does not exist.");
        require(boards[boardId].owner != address(0), "Board does not exist.");
        return boards[boardId];
    }

    /**
     * @dev Get boards owned by a specific address
     * @param owner Address of the board owner
     * @return Board[] array containing the boards owned by the specified address
     */
    function getBoardsByOwner(
        address owner
    ) public view returns (Board[] memory) {
        uint256 count = 0;

        // Count the number of boards owned by the specified address
        for (uint256 i = 1; i <= currentBoardId; i++) {
            if (boards[i].owner == owner) {
                count++;
            }
        }

        // Create an array with the count of boards
        Board[] memory ownerBoards = new Board[](count);
        uint256 index = 0;

        // Retrieve the boards owned by the specified address
        for (uint256 i = 1; i <= currentBoardId; i++) {
            if (boards[i].owner == owner) {
                ownerBoards[index] = boards[i];
                index++;
            }
        }

        // Resize the ownerBoards array to remove any unused elements
        assembly {
            mstore(ownerBoards, index)
        }

        return ownerBoards;
    }

    /* @dev Save a new pin to a board
     * @param boardId ID of the board to save the pin to
     * @param pinId ID of the pin to save
     * @param pinTitle Title of the pin to save
     * @param pinDescription Description of the pin to save
     * @param pinImageHash IPFS hash of the pin's image
     * @param pinOwner Owner of the pin to save
     * Requirements:
     * - Board with the given ID must exist
     * - Pin ID must be unique within the board
     */
    function savePinToBoard(
        uint256 boardId,
        uint256 pinId,
        string memory pinTitle,
        string memory pinDescription,
        string memory pinImageHash,
        string memory pinOwner
    ) public {
        require(boardId <= currentBoardId, "Board does not exist.");
        require(pinId > 0, "Pin ID must be greater than zero.");

        Board storage board = boards[boardId];
        board.pins.push(pinId);

        emit PinSaved(
            pinId,
            pinTitle,
            pinDescription,
            pinImageHash,
            boardId,
            pinOwner
        );
    }

    /**
     * @dev Edit a saved pin
     * @param pinId ID of the pin to edit
     * @param boardId ID of the board the pin is saved to
     * @param newBoardId ID of the new board to save the pin to
     * Requirements:
     * - Board with the given ID must exist
     * - Pin ID must be unique within the board
     */
    function editSavedPin(
        uint256 pinId,
        uint256 boardId,
        uint256 newBoardId
    ) public {
        require(newBoardId <= currentBoardId, "New Board does not exist.");
        require(boardId <= currentBoardId, "Old Board does not exist.");

        Board storage oldBoard = boards[boardId];
        Board storage newBoard = boards[newBoardId];
        require(pinId > 0, "Pin ID must be greater than zero.");

        // Delete pin from the old board
        uint256[] storage oldBoardPins = oldBoard.pins;
        for (uint256 i = 0; i < oldBoardPins.length; i++) {
            if (oldBoardPins[i] == pinId) {
                // Move the last element to the deleted position
                oldBoardPins[i] = oldBoardPins[oldBoardPins.length - 1];
                // Decrease the length of the array by 1
                oldBoardPins.pop();
                break;
            }
        }

        // Save pin to the new board
        newBoard.pins.push(pinId);

        emit SavedPinEdited(pinId, boardId, newBoardId);
    }

    /**
     * @dev Delete a saved pin
     * @param pinId ID of the pin to delete
     * @param boardId ID of the board the pin is saved to
     * Requirements:
     * - Board with the given ID must exist
     * - Pin with the given ID must exist in the board's pins array
     */
    function deleteSavedPin(uint256 pinId, uint256 boardId) public {
        require(boardId <= currentBoardId, "Board does not exist.");

        Board storage board = boards[boardId];
        uint256[] storage pins = board.pins;

        for (uint256 i = 0; i < pins.length; i++) {
            if (pins[i] == pinId) {
                // Move the last element to the deleted position
                pins[i] = pins[pins.length - 1];
                // Decrease the length of the array by 1
                pins.pop();
                break;
            }
        }

        emit SavedPinDeleted(pinId, boardId);
    }
}
