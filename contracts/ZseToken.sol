pragma solidity ^0.5.0;

contract ZseToken {
    string public name = "Zse Token";
    string public symbol = "ZSE";
    string public standard = "Zse Token v1.0";

    uint256 public totalSupply;

    mapping (address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        return true;
    }
}
