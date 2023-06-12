// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import {User} from "./common/types.sol";

contract UserManager {
    mapping(uint256 => User) public users; // Mapping to store user information by user address
    uint public userCount; // Total number of users

    event UserCreated(uint256 id, address userAddress); // Event emitted when a new user is created
    event UserDeleted(uint256 id, address userAddress); // Event emitted when a user is deleted
    event UserEdited(uint256 id, address userAddress); // Event emitted when a user is edited
    event UserFollowed(uint256 follower, uint256 followee); // Event emitted when a user follows another user
    event UserUnfollowed(uint256 follower, uint256 followee); // Event emitted when a user unfollows another user

    /**
     * @dev Create a new user
     * @param userAddress Address of the user
     * @return address Address of the created user
     */
    function createUser(address userAddress) public returns (User memory) {
        userCount++;

        // Initialize user properties
        string memory name;
        string memory username;
        string memory profileImageHash;
        string memory bio;
        uint256[] memory following;
        uint256[] memory followers;

        // Create user object
        User memory user = User(
            userCount,
            userAddress,
            name,
            username,
            profileImageHash,
            bio,
            following,
            followers
        );

        // Store user in the mapping
        users[userCount] = user;

        // Emit event for user creation
        emit UserCreated(userCount, userAddress);

        return users[userCount];
    }

    /**
     * @dev Get user information by user id
     * @param id Address of the user
     * @return User struct containing user information
     */
    function getUserById(uint256 id) public view returns (User memory) {
        return users[id];
    }

    /**
     * @dev Get user information by user address
     * @param userAddress Address of the user
     * @return User struct containing user information
     */
    function getUserByAddress(
        address userAddress
    ) public view returns (User memory) {
        for (uint256 i = 1; i <= userCount; i++) {
            if (users[i].userAddress == userAddress) {
                return users[i];
            }
        }
        revert("User not found");
    }

    /**
     * @dev Delete a user
     * @param id ID of the user to delete
     */
    function deleteUser(uint256 id) public {
        require(users[id].userAddress != address(0), "User does not exist");

        // Remove user from the mapping
        delete users[id];

        // Emit event for user deletion
        emit UserDeleted(id, users[id].userAddress);
    }

    /**
     * @dev Get all users
     * @return User[] Array containing all users
     */
    function getAllUsers() public view returns (User[] memory) {
        User[] memory allUsers = new User[](userCount);
        uint index = 0;

        for (uint256 i = 1; i <= userCount; i++) {
            if (users[i].userAddress != address(0)) {
                allUsers[index] = users[i];
                index++;
            }
        }

        assembly {
            mstore(allUsers, index)
        }

        return allUsers;
    }

    /**
     * @dev Edit user information
     * @param id ID of the user to edit
     * @param name New name of the user
     * @param username New username of the user
     * @param profileImageHash New profile image hash of the user
     * @param bio New bio of the user
     */
    function editUser(
        uint256 id,
        string memory name,
        string memory username,
        string memory profileImageHash,
        string memory bio
    ) public {
        require(users[id].userAddress != address(0), "User does not exist");

        User storage user = users[id];
        user.name = name;
        user.username = username;
        user.profileImageHash = profileImageHash;
        user.bio = bio;

        // Emit event for user edition
        emit UserEdited(id, user.userAddress);
    }

    /**
     * @dev Follow a user
     * @param followerId ID of the user who wants to follow
     * @param followeeId ID of the user to be followed
     */
    function followUser(uint256 followerId, uint256 followeeId) public {
        require(
            users[followerId].userAddress != address(0),
            "Follower does not exist"
        );
        require(
            users[followeeId].userAddress != address(0),
            "Followee does not exist"
        );

        User storage followerUser = users[followerId];
        User storage followeeUser = users[followeeId];

        followerUser.following.push(followeeId);
        followeeUser.followers.push(followerId);

        // Emit event for user following
        emit UserFollowed(followerId, followeeId);
    }

    /**
     * @dev Unfollow a user
     * @param followerId ID of the user who wants to unfollow
     * @param followeeId ID of the user to be unfollowed
     */
    function unfollowUser(uint256 followerId, uint256 followeeId) public {
        require(
            users[followerId].userAddress != address(0),
            "Follower does not exist"
        );
        require(
            users[followeeId].userAddress != address(0),
            "Followee does not exist"
        );

        User storage followerUser = users[followerId];
        User storage followeeUser = users[followeeId];

        for (uint i = 0; i < followeeUser.followers.length; i++) {
            if (followeeUser.followers[i] == followerId) {
                followeeUser.followers[i] = followeeUser.followers[
                    followeeUser.followers.length - 1
                ];
                followeeUser.followers.pop();
                break;
            }
        }

        for (uint i = 0; i < followerUser.following.length; i++) {
            if (followerUser.following[i] == followerId) {
                followerUser.following[i] = followerUser.following[
                    followerUser.following.length - 1
                ];
                followerUser.following.pop();
                break;
            }
        }

        // Emit event for user unfollowing
        emit UserUnfollowed(followerId, followeeId);
    }
}
