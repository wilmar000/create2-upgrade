const Springboard = artifacts.require('Springboard');
const Wallet = artifacts.require('Wallet');
const WalletV2 = artifacts.require('WalletV2');

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
      const walletV1 = await Wallet.at(walletAddress);
      let version = await walletV1.version();

      console.log(walletAddress, version);
      assert.equal(version, "1.0", "version should be 1.0");
         
      // Write you code here....
      // 1) Upgrade wallet to V2
      // 2) verify wallet version == 2.0 after upgrade
      
   });
});
