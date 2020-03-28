const Springboard = artifacts.require('Springboard');
const Wallet = artifacts.require('Wallet');
const WalletV2 = artifacts.require('WalletV2');
const ethers = require('ethers');
const utils = ethers.utils;

const initcode = "0x6394198df1600052600060006004601c335afa80601b57600080fd5b3d600060203e6040516060f3";
function calculateAddress(creatorAddress, salt, initCode) {
   const initCodeHash = utils.keccak256(initCode);
   return utils.getAddress(utils.hexDataSlice(utils.keccak256(
            utils.concat([
            "0xff",
            creatorAddress,
            salt,
            initCodeHash])), 12));
}

// Springboard contract is a factory of wallet contracts
contract("Springboard", accounts => {
   let springboard;
   before(async() => {
      springboard = await Springboard.deployed(); 
   });

   it("Upgrade wallet v1 to v2 should work", async () => {
      const runtimeCode = Wallet.deployedBytecode;
      let tx = await springboard.execute(runtimeCode);
      assert.equal(tx.logs.length, 1, "should have 1 event log");
      assert.equal(tx.logs[0].event, "ContractCreated", "different event");

      // the new wallet contract address is logged in the event log
      let walletAddress =  tx.logs[0].args[0];
      const salt = utils.keccak256(accounts[0]);
      const expectedAddress = calculateAddress(springboard.address, salt, initcode);
      assert.equal(expectedAddress, walletAddress, "address mismatch");

      // check the contract version
      const walletV1 = await Wallet.at(walletAddress);
      let version = await walletV1.version();

      console.log(walletAddress, version);
      assert.equal(version, "1.0", "version should be 1.0");
         
      // Write you code here....
      // 1) Upgrade wallet to V2
      // 2) verify wallet version == 2.0 after upgrade
      await walletV1.die();

      const runtimeCode2 = WalletV2.deployedBytecode;
      newTx = await springboard.execute(runtimeCode2);

  
      //  New wallet logged
      let newWalletAddress = newTx.logs[0].args[0];
      const salt2 = utils.keccak256(accounts[0]);

  
      const walletV2 = await WalletV2.at(newWalletAddress);
      let newVersion = await walletV2.version();
      console.log(newWalletAddress, newVersion);
      assert.equal(newVersion, "2.0", "version should be 2.0");
      
   });
});
