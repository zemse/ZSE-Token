const ZseToken = artifacts.require("ZseToken");

module.exports = function(deployer) {
  deployer.deploy(ZseToken, 1000000);
};
