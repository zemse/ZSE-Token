// jshint esversion:8
const ZseToken = artifacts.require("../contracts/ZseToken.sol");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

contract('ZseToken', accounts => {
  it('sets total supply upon deployment', async () => {
    const instance = await ZseToken.deployed();
    assert.equal(web3.utils.toBN(await instance.totalSupply()).toString(), '1000000'); // this is in BN, need to parse it as a number or string.
  });
});
