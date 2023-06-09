// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import {User} from "./common/types.sol";

contract UserManager {
    mapping(address => User) public users; // Mapping to store user information by user address
    mapping(string => address) public usernameToUserAddress; // Mapping to store user address by username
    uint public userCount; // Total number of users

    event UserCreated(address userAddress); // Event emitted when a new user is created
    event UserDeleted(address userAddress); // Event emitted when a user is deleted
    event UserEdited(address userAddress); // Event emitted when a user is edited
    event UserFollowed(address follower, address followee); // Event emitted when a user follows another user
    event UserUnfollowed(address follower, address followee); // Event emitted when a user unfollows another user

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

        return users[userAddress];
    }

    /**
     * @dev Get user information by user address
     * @param userAddress Address of the user
     * @return User struct containing user information
     */
    function getUserByAddress(
        address userAddress
    ) public view returns (User memory) {
        return users[userAddress];
    }

    /**
     * @dev Delete a user
     * @param userAddress Address of the user to delete
     */
    function deleteUser(address userAddress) public {
        require(
            users[userAddress].userAddress != address(0),
            "User does not exist"
        );

        // Remove user from the mapping
        delete users[userAddress];

        // Emit event for user deletion
        emit UserDeleted(userAddress);
    }

    /**
     * @dev Get all users
     * @return User[] Array containing all users
     */
    function getAllUsers() public view returns (User[] memory) {
        User[] memory allUsers = new User[](userCount);
        uint index = 0;

        // Iterate over the users mapping and add each user to the array
        for (uint i = 0; i < userCount; i++) {
            address userAddress = address(uint160(i)); // Convert the index to address
            if (users[userAddress].userAddress != address(0)) {
                allUsers[index] = users[userAddress];
                index++;
            }
        }

        // Resize the array to remove empty slots
        assembly {
            mstore(allUsers, index)
        }

        return allUsers;
    }

    /**
     * @dev Edit user information
     * @param userAddress Address of the user to edit
     * @param name New name of the user
     * @param username New username of the user
     * @param profileImageHash New profile image hash of the user
     * @param bio New bio of the user
     */
    function editUser(
        address userAddress,
        string memory name,
        string memory username,
        string memory profileImageHash,
        string memory bio
    ) public {
        require(
            users[userAddress].userAddress != address(0),
            "User does not exist"
        );

        User storage user = users[userAddress];
        user.name = name;
        user.username = username;
        user.profileImageHash = profileImageHash;
        user.bio = bio;

        // Emit event for user edition
        emit UserEdited(userAddress);
    }

    /**
     * @dev Follow a user
     * @param follower Address of the user who wants to follow
     * @param followee Address of the user to be followed
     */
    function followUser(address follower, address followee) public {
        require(
            users[follower].userAddress != address(0),
            "Follower does not exist"
        );
        require(
            users[followee].userAddress != address(0),
            "Followee does not exist"
        );

        User storage followerUser = users[follower];
        User storage followeeUser = users[followee];

        followerUser.following.push(followee);
        followeeUser.followers.push(follower);

        // Emit event for user following
        emit UserFollowed(follower, followee);
    }

    /**
     * @dev Unfollow a user
     * @param follower Address of the user who wants to unfollow
     * @param followee Address of the user to be unfollowed
     */
    function unfollowUser(address follower, address followee) public {
        require(
            users[follower].userAddress != address(0),
            "Follower does not exist"
        );
        require(
            users[followee].userAddress != address(0),
            "Followee does not exist"
        );

        User storage followerUser = users[follower];
        User storage followeeUser = users[followee];

        uint followerIndex;
        uint followeeIndex;
        bool foundFollower = false;
        bool foundFollowee = false;

        // Find the index of the follower in the followee's followers array
        for (uint i = 0; i < followeeUser.followers.length; i++) {
            if (followeeUser.followers[i] == follower) {
                followerIndex = i;
                foundFollower = true;
                break;
            }
        }

        // Find the index of the followee in the follower's following array
        for (uint i = 0; i < followerUser.following.length; i++) {
            if (followerUser.following[i] == followee) {
                followeeIndex = i;
                foundFollowee = true;
                break;
            }
        }

        require(foundFollower, "Follower does not follow the specified user");
        require(
            foundFollowee,
            "Followee is not followed by the specified user"
        );

        // Remove the follower from the followee's followers array
        delete followeeUser.followers[followerIndex];

        // Remove the followee from the follower's following array
        delete followerUser.following[followeeIndex];

        // Emit event for user unfollowing
        emit UserUnfollowed(follower, followee);
    }
}
