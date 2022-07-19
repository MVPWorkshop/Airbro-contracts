// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockDai is ERC20 {
    constructor() ERC20("MockDai", "DAI") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
