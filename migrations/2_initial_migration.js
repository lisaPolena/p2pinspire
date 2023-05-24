const pinManager = artifacts.require("pinManager");

module.exports = function (deployer) {
    deployer.deploy(pinManager);
};