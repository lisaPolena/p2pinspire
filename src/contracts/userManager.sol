// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//import "hardhat/console.sol";

contract UserManager {
    struct User {
        uint id;
        string username;
        bytes32 passwordHash;
    }

    mapping(uint => User) public users;
    mapping(string => uint) public usernameToUserId;
    uint public userCount;

    function registerUser(
        string memory _username,
        bytes32 _passwordHash
    ) public {
        require(usernameToUserId[_username] == 0, "Username already exists.");
        User memory user = User(userCount + 1, _username, _passwordHash);
        users[user.id] = user;
        usernameToUserId[_username] = user.id;
        userCount++;
    }

    function authenticateUser(
        string memory _username,
        bytes32 _passwordHash
    ) public view returns (bool) {
        uint userId = usernameToUserId[_username];
        if (userId == 0) {
            return false;
        }
        return users[userId].passwordHash == _passwordHash;
    }

    function getUser(uint _id) public view returns (User memory) {
        return users[_id];
    }
}
