// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LoyaltyPoints {
    address public owner;
    mapping(address => uint256) private balances;
    mapping(bytes32 => bool) public processedOrders;

    event PointsAdded(address indexed user, uint256 amount, bytes32 indexed orderId);
    event Redeemed(address indexed user, uint256 amount, uint256 voucherType);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function balanceOf(address user) external view returns (uint256) {
        return balances[user];
    }

    function addPoints(address user, uint256 amount, bytes32 orderId) external onlyOwner {
        require(user != address(0), "Invalid user");
        require(amount > 0, "Amount must be > 0");
        require(!processedOrders[orderId], "Order already processed");

        processedOrders[orderId] = true;
        balances[user] += amount;

        emit PointsAdded(user, amount, orderId);
    }

    function redeem(address user, uint256 amount, uint256 voucherType) external onlyOwner {
        require(user != address(0), "Invalid user");
        require(amount > 0, "Amount must be > 0");
        require(balances[user] >= amount, "Insufficient points");

        balances[user] -= amount;

        emit Redeemed(user, amount, voucherType);
    }
}