// SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.18;

// Define a contract called "dStorage"
contract dStorage {

    // Define a struct called "Access" to represent the access control information of a user
    struct Access {
        address user; // Address of the user
        bool access; // Access status of the user (true or false)
    }

    // Define private mappings to store the data, ownership information, accessing control in _authorizedList and prior data for each user
    mapping(address => string[]) private _data; // Stores the data of each user
    mapping(address => mapping(address => bool)) private _ownership; // Stores ownership information
    mapping(address => Access[]) private _authorizedList; // Stores the access control list of each user
    mapping(address => mapping(address => bool)) private _priorData; // Stores prior access control information

    // Define a function to add a new value to the user's storage
    function add(address user, string memory url) external {
        // Check if the URL is not empty and its length is not greater than 256 bytes
        require(bytes(url).length <= 256, "URL is too long");
        require(bytes(url).length > 0, "URL cannot be empty");

        // Push the value to the user's storage
        _data[user].push(url);
    }

    // Define a function to allow access to another user
    function allowUser(address user) external {
        // Check that the caller is not the same as the user being granted access
        require(msg.sender != user, "Cannot grant access to yourself");

        // Set the ownership status of the user to true
        _ownership[msg.sender][user] = true;

        // If the user had access before, update their access status
        if (_priorData[msg.sender][user]) {
            for (uint256 i = 0; i < _authorizedList[msg.sender].length; i++) {
                if (_authorizedList[msg.sender][i].user == user) {
                    _authorizedList[msg.sender][i].access = true;
                    break;
                }
            }
        } else {
            // If the user did not have access before, add them to the access control list
            _authorizedList[msg.sender].push(Access(user, true));
            _priorData[msg.sender][user] = true;
        }
    }

    // Define a function to remove access from all users
    function disallowAll() external {
        // Iterate over the access control list and set all access to false
        for (uint256 i = 0; i < _authorizedList[msg.sender].length; i++) {
            _authorizedList[msg.sender][i].access = false;
        }
    }

    // Define a function to display the values of a user
function displayData(address user) external view returns (string[] memory) {
    // Check if the caller has access to the user's data
    bool hasAccess = (user == msg.sender) || _ownership[user][msg.sender];
    
    // If the caller has access, return the user's data
    if (hasAccess) {
        return _data[user];
    } else {
        // If the caller doesn't have access, revert with an error message
        revert("You don't have access to the data");
    }
}
    // Define a function to get the access control list of the caller
    function shareAccess() external view returns (Access[] memory) {
        return _authorizedList[msg.sender];
    }
}
// 0x996eFcF698c4a15C7CA48b55d280D0849C658Da2   