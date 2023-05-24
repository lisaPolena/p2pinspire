const boardManager = artifacts.require("boardManager");

module.exports = function (deployer) {
    deployer.deploy(boardManager);
};