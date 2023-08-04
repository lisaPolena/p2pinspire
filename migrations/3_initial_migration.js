const userManager = artifacts.require("userManager");

module.exports = function (deployer) {
    deployer.deploy(userManager);
};