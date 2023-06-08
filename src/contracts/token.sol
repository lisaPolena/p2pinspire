// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Web3PinterestToken is ERC20 {
    constructor() ERC20("Web3 Pinterest Token", "WPT") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}
