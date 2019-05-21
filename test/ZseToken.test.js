// jshint esversion:8
const ZseToken = artifacts.require("../contracts/ZseToken.sol");

let instance;
const numberify = inputBN => web3.utils.toBN(inputBN).toNumber();

contract('ZseToken', accounts => {
  beforeEach( async() => {
    instance = await ZseToken.deployed();
  });

  it('initialises the contract with correct name, symbol and standard', async() => {
    assert.equal(await instance.name(), 'Zse Token');
    assert.equal(await instance.symbol(), 'ZSE');
    assert.equal(await instance.standard(), 'Zse Token v1.0');
  });

  it('sets total supply upon deployment and issues it to msg.sender', async() => {
    assert.equal(
      numberify(await instance.totalSupply()),
      1000000
    );
    assert.equal(
      numberify(await instance.balanceOf(accounts[0])),
      1000000
    );
  });
  it('transfer: transfers ownership of tokens', async() => {
    const initial0 = numberify(await instance.balanceOf(accounts[0]));
    const initial1 = numberify(await instance.balanceOf(accounts[1]));

    await instance.transfer(accounts[1], 100);

    const final0 = numberify(await instance.balanceOf(accounts[0]));
    const final1 = numberify(await instance.balanceOf(accounts[1]));

    assert.equal(initial0 - final0, final1 - initial1);
    assert.equal(initial0 - final0, 100);
  });
  it('transfer: throws an error if insufficient balance', async() => {
    try {
      // await instance.transfer(accounts[2], 100, {from: accounts[1]});
      await instance.transfer.call(accounts[1], 999999999, {from: accounts[0]});
    } catch (err) {
      return assert(err.message.indexOf('revert') >= 0, 'error message must contain revert');
    }
    assert(false);
  });
});
