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
  it('transfers ownership of tokens', async() => {
    const initial0 = numberify(await instance.balanceOf(accounts[0]));
    const initial1 = numberify(await instance.balanceOf(accounts[1]));

    await instance.transfer(accounts[1], 100);

    const final0 = numberify(await instance.balanceOf(accounts[0]));
    const final1 = numberify(await instance.balanceOf(accounts[1]));

    assert.equal(initial0 - final0, final1 - initial1);
    assert.equal(initial0 - final0, 100);
  });
  it('transfer fires an event', async() => {
    const receipt = await instance.transfer(accounts[1], 100);
    assert.equal(receipt.logs.length, 1, 'triggers an event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Transfer event');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the sender');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the receiver');
    assert.equal(receipt.logs[0].args._value, 100, 'logs the value');
  });
  it('throws revert error if insufficient balance during transfer', async() => {
    try {
      // await instance.transfer(accounts[2], 100, {from: accounts[1]});
      await instance.transfer.call(accounts[1], 999999999, {from: accounts[0]});
    } catch (err) {
      return assert(err.message.indexOf('revert') >= 0, 'error message must contain revert');
    }
    assert(false);
  });
  it('approves token for delegate transfer', async() => {
    const success = await instance.approve.call(accounts[1], 100);
    assert.equal(success, true, 'it returns true');
    const receipt = await instance.approve(accounts[1], 100);
    assert.equal(receipt.logs.length, 1, 'triggers an event');
    assert.equal(receipt.logs[0].event, 'Approval', 'should be the Approval event');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the owner');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the spender');
    assert.equal(receipt.logs[0].args._value, 100, 'logs the value');
    const allowance = numberify(await instance.allowance(accounts[0], accounts[1]));
    assert.equal(allowance, 100, 'sets allowance properly');
  });
  it('handles delegate token transfer', async() => {
    const [ fromAccount, toAccount, spendingAccount ] = [ accounts[2], accounts[3], accounts[4] ];

    await instance.transfer(fromAccount, 100);

    const fromBalance = numberify(await instance.balanceOf(fromAccount));
    const toBalance = numberify(await instance.balanceOf(toAccount));

    await instance.approve(spendingAccount, 10, {from: fromAccount});
    await instance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});

    assert.equal(
      fromBalance - numberify(await instance.balanceOf(fromAccount)),
      10,
      'deducts the amount from fromAccount'
    );
    assert.equal(

    );
    assert.equal(
      numberify(await instance.balanceOf(toAccount)) - toAccount,
      10,
      'adds the amount to the toAccount'
    );
  });

});
