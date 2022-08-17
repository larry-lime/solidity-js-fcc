// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ManualToken {
    // Check the github repo
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // transfer tokens
    // subtract from address amount and add to address
    function transfer(
        address from,
        address to,
        uint256 amount
    ) public {
        balanceOf[from] = balanceOf[from] - amount;
        balanceOf[to] += amount;
    }

    // The rest you should add from the Github repo
}
