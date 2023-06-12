// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @dev Struct to store board information
 */
struct Board {
    uint256 id; // Unique identifier for board
    string name; // Name of board
    string description; // Description of board
    address owner; // Address of board owner
    uint256[] pins; // Array of pin numbers on the board
    string boardCoverHash; // IPFS hash of the board cover image
}

/**
 * @dev Struct to store pin information
 */
struct Pin {
    uint256 id; // Unique identifier for pin
    string title; //title of the pin
    string description; //description of the pin
    string imageHash; //hash for the image
    address owner; //owner of the pin
    uint256 boardId; //id of the board where the pin is saved
}

/**
 * @dev Struct to store user information
 */
struct User {
    uint256 id; // Unique identifier for user
    address userAddress; //address of the user
    string name; //name of the user
    string username; //username of the user
    string profileImageHash; //hash of the profile image
    string bio; //bio of the user
    uint256[] following; //ids that the user follows
    uint256[] followers; //ids that follow the user
}
