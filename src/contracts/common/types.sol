// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @dev Struct to store board information
 */
struct Board {
    bytes16 id; // Unique identifier for board
    string name; // Name of board
    address owner; // Address of board owner
    bytes16[] pins; // Array of pin numbers on the board
}

/**
 * @dev Struct to store pin information
 */
struct Pin {
    bytes16 id; // Unique identifier for pin
    string imageHash; //hash for the image
    string title; //title of the pin
    string description; //description of the pin
    address owner; //owner of the pin
    bytes16 boardId; //id of the board where the pin is saved
}

/**
 * @dev Struct to store user information
 */
struct User {
    bytes32 id;
    string username;
    bytes32 passwordHash;
}
