// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract payAll {
    event Transations(address indexed from,address to, uint amount,string symbol);
    event SaveName(string name, address to);

    function Transfer(address payable _to, string memory _symbol) public payable  {
        _to.transfer(msg.value);
        emit Transations(msg.sender, _to, msg.value, _symbol);
    }
    
    function saveTx(address _owner,address _to, string memory _symbol, uint _amount) public {
        emit Transations(_owner, _to, _amount, _symbol);
    }

    function addRecipient(address _to, string memory _name) public {
        emit SaveName(_name, _to);
    }
}




// deploy at 