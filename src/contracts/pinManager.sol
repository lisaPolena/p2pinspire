// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import {Pin} from "./common/types.sol";

/**
 * @title PinManager
 * @dev A smart contract for managing pins
 */
contract PinManager {
    /**
     * @dev Event emitted when a new pin is created
     * @param pinId ID of the pin created
     * @param title Title of the pin created
     * @param description Description of the pin created
     * @param imageHash IPFS hash of the pin's image
     * @param boardId of the board the pin belongs to
     * @param owner Owner of the pin created
     */
    event PinCreated(
        uint256 pinId,
        string title,
        string description,
        string imageHash,
        uint256 indexed boardId,
        address indexed owner
    );

    /**
     * @dev Event emitted when a pin is deleted
     * @param pinId ID of the pin deleted
     * @param boardId ID of the board the pin belonged to
     */
    event PinDeleted(uint256 pinId, uint256 boardId);

    /**
     * @dev Event emitted when a created pin is edited
     * @param pinId ID of the pin edited
     * @param newTitle New title of the pin edited
     * @param newDescription New description of the pin edited
     * @param imageHash IPFS hash of the pin's image
     * @param newBoardId ID of the new board
     * @param oldBoardId ID of the old board
     * @param owner Owner of the pin edited
     */
    event CreatedPinEdited(
        uint256 pinId,
        string newTitle,
        string newDescription,
        string imageHash,
        uint256 newBoardId,
        uint256 oldBoardId,
        address owner
    );

    /**
     * @dev Mapping to store pins by their ID
     */
    mapping(uint256 => Pin) public pins;

    /**
     * @dev Number of pins created
     */
    uint256 public currentPinId;

    /**
     * @dev Create a new pin
     * @param title Title of the pin
     * @param description Description of the pin
     * @param imageHash IPFS hash of the pin's image
     * @param boardId ID of the board the pin belongs to
     * @return uint256 ID of the created pin
     */
    function createPin(
        string memory title,
        string memory description,
        string memory imageHash,
        uint256 boardId
    ) public returns (uint256) {
        currentPinId++;
        Pin memory pin = Pin(
            currentPinId,
            title,
            description,
            imageHash,
            msg.sender,
            boardId
        );
        pins[currentPinId] = pin;
        emit PinCreated(
            currentPinId,
            title,
            description,
            imageHash,
            boardId,
            msg.sender
        );
        return currentPinId;
    }

    /**
     * @dev Delete an existing pin
     * @param pinId ID of the pin to delete
     * Requirements:
     * - Only the pin owner can delete the pin
     */
    function deletePin(uint256 pinId) public {
        require(pinId <= currentPinId, "Pin does not exist.");
        require(
            msg.sender == pins[pinId].owner,
            "Only the pin owner can delete the pin."
        );
        emit PinDeleted(pinId, pins[pinId].boardId);
        delete pins[pinId];
    }

    /**
     * @dev Delete all pins from a user
     * Requirements:
     * - Only the pin owner can delete the pins
     */
    function deleteAllPinsFromUser() public {
        for (uint256 i = 1; i <= currentPinId; i++) {
            if (pins[i].owner == msg.sender) {
                delete pins[i];
            }
        }
    }

    /**
     * @dev Get pin information by its ID
     * @param pinId ID of the pin to get
     * @return Pin struct containing pin information
     * Requirements:
     * - Pin ID must be greater than 0
     * - Pin with the given ID must exist
     */
    function getPinById(uint256 pinId) public view returns (Pin memory) {
        require(pinId != 0, "Pin ID must be greater than 0.");
        require(pinId <= currentPinId, "Pin does not exist.");
        require(pins[pinId].owner != address(0), "Pin does not exist.");
        return pins[pinId];
    }

    /**
     * @dev Edit created pin information
     * @param pinId ID of the pin to edit
     * @param newTitle New title for the pin
     * @param newDescription New description for the pin
     * @param newBoardId New Id of the board
     * Requirements:
     * - Only the pin owner can edit the pin
     * - Pin with the given ID must exist
     */
    function editCreatedPin(
        uint256 pinId,
        string memory newTitle,
        string memory newDescription,
        uint256 newBoardId
    ) public {
        require(pinId <= currentPinId, "Pin does not exist.");
        require(
            msg.sender == pins[pinId].owner,
            "Only the pin owner can edit the pin."
        );
        uint256 oldBoardId = pins[pinId].boardId;
        pins[pinId].title = newTitle;
        pins[pinId].description = newDescription;
        pins[pinId].boardId = newBoardId;
        emit CreatedPinEdited(
            pinId,
            newTitle,
            newDescription,
            pins[pinId].imageHash,
            newBoardId,
            oldBoardId,
            pins[pinId].owner
        );
    }

    /**
     * @dev Get all pins from a specific board
     * @param boardId ID of the board
     * @return Pin[] array containing all the pins from the board
     */
    function getPinsByBoardId(
        uint256 boardId
    ) public view returns (Pin[] memory) {
        uint256 count = 0;

        // Count the number of pins in the board
        for (uint256 i = 1; i <= currentPinId; i++) {
            if (pins[i].boardId == boardId) {
                count++;
            }
        }

        // Create an array with the count of pins
        Pin[] memory boardPins = new Pin[](count);
        uint256 index = 0;

        // Retrieve the pins from the board
        for (uint256 i = 1; i <= currentPinId; i++) {
            if (pins[i].boardId == boardId) {
                boardPins[index] = pins[i];
                index++;
            }
        }

        return boardPins;
    }

    /**
     * @dev Get all pins
     * @return Pin[] array containing all the pins
     */
    function getAllPins() public view returns (Pin[] memory) {
        Pin[] memory allPins = new Pin[](currentPinId);
        uint256 index = 0;

        for (uint256 i = 1; i <= currentPinId; i++) {
            if (pins[i].owner != address(0)) {
                allPins[index] = pins[i];
                index++;
            }
        }

        // Resize the allPins array to remove any unused elements
        assembly {
            mstore(allPins, index)
        }

        return allPins;
    }
}
