pragma solidity ^0.5.0;

contract WalletV2 {
    address payable public owner = msg.sender;
    
    function die() public {
        require(owner == msg.sender);
        selfdestruct(owner);
    }
}
