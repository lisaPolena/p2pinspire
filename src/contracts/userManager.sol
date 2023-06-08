// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import {User} from "./common/types.sol";

contract UserManager {
    mapping(address => User) public users; // Mapping to store user information by user address
    mapping(string => address) public usernameToUserAddress; // Mapping to store user address by username
    uint public userCount; // Total number of users

    event UserCreated(address userAddress); // Event emitted when a new user is created

    /**
     * @dev Create a new user
     * @param userAddress Address of the user
     * @return address Address of the created user
     */
    function createUser(address userAddress) public returns (address) {
        userCount++;

        // Initialize user properties
        string memory name;
        string memory username;
        string memory profileImageHash;
        string memory bio;
        address[] memory following;
        address[] memory followers;

        // Create user object
        User memory user = User(
            userAddress,
            name,
            username,
            profileImageHash,
            bio,
            following,
            followers
        );

        // Store user in the mapping
        users[userAddress] = user;

        // Emit event for user creation
        emit UserCreated(userAddress);

        return userAddress;
    }

    /**
     * @dev Get user information by user address
     * @param userAddress Address of the user
     * @return User struct containing user information
     */
    function getUser(address userAddress) public view returns (User memory) {
        return users[userAddress];
    }
}
