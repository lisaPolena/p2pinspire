// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import {Board, Pin} from "./common/types.sol";
import {Functions} from "./common/functions.sol";

/**
 * @title PinManager
 * @dev A smart contract for managing pins
 */
contract PinManager {
    /**
     * @dev Mapping to store pins by their ID
     */
    mapping(bytes16 => Pin) public pins;
    mapping(bytes16 => Board) public boards;

    /**
     * @dev Number of pins created
     */
    uint public pinCount;

    /**
     * @dev Create a new pin
     * @param imageHash Hash for the image of the pin
     * @param title Title of the pin
     * @param description Description of the pin
     * @param boardId ID of the board where the pin will be saved
     * Requirements:
     * - imageHash, title, and description cannot be empty strings
     * - Board with the given ID must exist
     */
    function createPin(
        string memory imageHash,
        string memory title,
        string memory description,
        bytes16 boardId
    ) public {
        require(bytes(imageHash).length != 0, "Image hash cannot be empty.");
        require(bytes(title).length != 0, "Title cannot be empty.");
        require(bytes(description).length != 0, "Description cannot be empty.");
        require(boards[boardId].owner != address(0), "Board does not exist.");
        bytes16 id = Functions(new Functions()).generateId();
        Pin memory pin = Pin(
            id,
            imageHash,
            title,
            description,
            msg.sender,
            boardId
        );
        pins[id] = pin;
        pinCount++;
    }

    /**
     * @dev Delete an existing pin
     * @param pinId ID of the pin to delete
     * Requirements:
     * - Only the pin owner can delete the pin
     */
    function deletePin(bytes16 pinId) public {
        require(
            msg.sender == pins[pinId].owner,
            "Only the pin owner can delete the pin."
        );
        delete pins[pinId];
    }

    /**
     * @dev Get pin information by its ID
     * @param pinId ID of the pin to get
     * @return Pin struct containing pin information
     * Requirements:
     * - Pin with the given ID must exist
     */
    function getPin(bytes16 pinId) public view returns (Pin memory) {
        require(pins[pinId].owner != address(0), "Pin does not exist.");
        return pins[pinId];
    }

    /**
     * @dev Save a pin to a board
     * @param pinId ID of the pin to save
     * @param boardId ID of the board to save the pin to
     * Requirements:
     * - Pin with the given ID must exist
     * - Board with the given ID must exist
     * - Only the pin owner can save the pin to the board
     */
    function savePinToBoard(bytes16 pinId, bytes16 boardId) public {
        require(
            pins[pinId].owner == msg.sender,
            "Only the pin owner can save the pin to a board."
        );
        require(boards[boardId].owner != address(0), "Board does not exist.");
        pins[pinId].boardId = boardId;
        boards[boardId].pins.push(pinId);
    }

    /**
     * @dev Remove a pin from a board
     * @param boardId ID of the board from which to remove the pin
     * @param pinId ID of the pin to remove
     * Requirements:
     * - Only the board owner can remove pins from the board
     * - Board and pin with the given IDs must exist
     */
    function removePinFromBoard(bytes16 boardId, bytes16 pinId) public {
        Board storage board = boards[boardId];
        require(
            board.owner == msg.sender,
            "Only the board owner can remove pins from the board."
        );
        require(
            pins[pinId].owner != address(0),
            "Pin with the given ID does not exist."
        );
        require(
            pins[pinId].boardId == boardId,
            "Pin with the given ID is not on the specified board."
        );
        uint indexToDelete;
        for (uint i = 0; i < board.pins.length; i++) {
            if (board.pins[i] == pinId) {
                indexToDelete = i;
                break;
            }
        }
        for (uint i = indexToDelete; i < board.pins.length - 1; i++) {
            board.pins[i] = board.pins[i + 1];
        }
        board.pins.pop();
        pins[pinId].boardId = 0;
    }
}
