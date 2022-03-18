import chai, { expect, should } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import {
  deployVault,
  deployZapGettersLibrary,
  deployZapLibrary,
  deployZapMaster,
  deployZapStake,
  deployZap,
  deployZapDispute,
  deployZapToken,
} from "../src/deploy";

import {
  zapTokenAddresses,
  zapGettersLibraryAddresses,
  zapLibraryAddresses,
  zapMasterAddresses,
  zapStakeAddresses,
  zapDisputeAddresses,
  zapAddresses,
  vaultAddresses,
} from "../src/contract/addresses";

import Zap from "../src/zap";

import { getSigners } from "./test_utils";
import { SuiteConstants } from "mocha";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
chai.use(chaiAsPromised);

chai.should();

describe("Zap Class", () => {
  let signer: Signer;
  let zapVault: Contract;
  let zapMaster: Contract;
  let zapGettersLibrary: Contract;
  let zapLibrary: Contract;
  let zapStake: Contract;
  let zapDispute: Contract;
  let token: Contract;
  let zap: Contract;

  const signers = getSigners(provider);

  beforeEach(async () => {
    signer = signers[0];

    token = await deployZapToken();
    console.log("token address: ", token.address);
    await token.deployed();

    zapGettersLibrary = await deployZapGettersLibrary();
    console.log("zapGettersLibrary address: ", zapGettersLibrary.address);
    await zapGettersLibrary.deployed();

    zapDispute = await deployZapDispute();
    console.log("zapDispute address: ", zapDispute.address);
    await zapDispute.deployed();

    zapStake = await deployZapStake(zapDispute.address);
    console.log("zapStake address: ", zapStake.address);
    await zapStake.deployed();

    zapLibrary = await deployZapLibrary();
    console.log("zapLibrary address: ", zapLibrary.address);
    await zapLibrary.deployed();

    zap = await deployZap(
      token.address,
      zapDispute.address,
      zapStake.address,
      zapLibrary.address
    );
    console.log("zap address: ", zap.address);
    await zap.deployed();

    zapMaster = await deployZapMaster(
      zap.address,
      token.address,
      zapStake.address
    );
    console.log("zapMaster address: ", zapMaster.address);
    await zapMaster.deployed();

    zapVault = await deployVault(zapMaster.address, token.address);
    console.log("zapVault address: ", zapVault.address);
    await zapVault.deployed();

    await zapMaster.changeVaultContract(zapVault.address);

    zapAddresses["1337"] = zap.address;
    zapTokenAddresses["1337"] = token.address;
    zapGettersLibraryAddresses["1337"] = zapGettersLibrary.address;
    zapLibraryAddresses["1337"] = zapLibrary.address;
    zapMasterAddresses["1337"] = zapMaster.address;
    zapStakeAddresses["1337"] = zapStake.address;
    zapDisputeAddresses["1337"] = zapDispute.address;
    vaultAddresses["1337"] = zapVault.address;
  });

  describe("Staking", () => {
    it("Revert if balance does not equal 500K ZAP", async () => {
      const zapClass = new Zap(1337, signers[1]);
      await zapClass
        .stake()
        .should.be.rejectedWith(
          "VM Exception while processing transaction: revert"
        );
    });

    it("Should return a staked status of 1 for a balance greater than 500K", async () => {
      const signerAddress = await signers[1].getAddress();
      await token.allocate(signerAddress, "10000000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);
      await zapClass.approveSpending(500000);

      const tx = await zapClass.stake();

      const stakerInfo = await zapMaster.getStakerInfo(signerAddress);

      const balance = await token.balanceOf(signerAddress);

      expect(Number(stakerInfo[0])).to.equal(1);
      expect(String(balance)).to.equal("9500000000000000000000000");
    });

    it("Should revert staking if stake status is already 1", async () => {
      const signerAddress = await signers[1].getAddress();
      await token.allocate(signerAddress, "10000000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);
      await zapClass.approveSpending(500000);

      const tx = await zapClass.stake();

      await zapClass.approveSpending(500000);

      await zapClass
        .stake()
        .should.be.rejectedWith("ZapStake: Staker is already staked");
    });
  });

  describe("Withdraw", () => {
    it("Should reject withdraw request if not staked", async () => {
      const signerAddress = await signers[1].getAddress();
      const zapClass = new Zap(1337, signers[1]);
      await zapClass
        .requestWithdraw()
        .should.be.rejectedWith("Miner is not staked");
    });

    it("Should accept withdraw request and set staker status to 2", async () => {
      const signerAddress = await signers[1].getAddress();
      await token.allocate(signerAddress, "10000000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);
      await zapClass.approveSpending(500000);

      await zapClass.stake();

      await zapClass.requestWithdraw();

      const stakerInfo = await zapMaster.getStakerInfo(signerAddress);

      expect(Number(stakerInfo[0])).to.equal(2);
    });

    it("Should reject withdraw if status is not 2", async () => {
      const signerAddress = await signers[1].getAddress();
      await token.allocate(signerAddress, "10000000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);
      await zapClass.approveSpending(500000);

      await zapClass.stake();

      await provider.send("evm_increaseTime", [691200]);

      await zapClass
        .withdraw()
        .should.be.rejectedWith("Required to request withdraw of stake");
    });

    it("Should not withdraw if time has not been 7 days since request", async () => {
      const signerAddress = await signers[1].getAddress();
      await token.allocate(signerAddress, "10000000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);
      await zapClass.approveSpending(500000);

      await zapClass.stake();

      await zapClass.requestWithdraw();

      await zapClass
        .withdraw()
        .should.be.rejectedWith(
          "Need to wait at LEAST 7 days from stake start date"
        );
    });

    it("Should withdraw if time has been 7 days since request", async () => {
      const signerAddress = await signers[1].getAddress();
      await token.allocate(signerAddress, "10000000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);
      await zapClass.approveSpending(500000);

      await zapClass.stake();

      await zapClass.requestWithdraw();

      await provider.send("evm_increaseTime", [691200]);

      await zapClass.withdraw();

      const stakerInfo = await zapMaster.getStakerInfo(signerAddress);

      expect(Number(stakerInfo[0])).to.equal(0);
      const balance = await token.balanceOf(signerAddress);
      expect(String(balance)).to.equal("10000000000000000000000000");
    });

    it("Should allow restaking after a withdraw", async () => {
      const signerAddress = await signers[1].getAddress();
      await token.allocate(signerAddress, "10000000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);
      await zapClass.approveSpending(500000);

      await zapClass.stake();

      await zapClass.requestWithdraw();

      await provider.send("evm_increaseTime", [691200]);

      await zapClass.withdraw();

      await zapClass.approveSpending(500000);

      await zapClass.stake();

      const stakerInfo = await zapMaster.getStakerInfo(signerAddress);

      const balance = await token.balanceOf(signerAddress);

      expect(Number(stakerInfo[0])).to.equal(1);
      expect(String(balance)).to.equal("9500000000000000000000000");
    });
  });

  describe("Tipping", () => {
    it("Allow to add tip to a request", async () => {
      const signerAddress = await signers[1].getAddress();
      await token.allocate(signerAddress, "10000000000000000000000000");

      let orignalBal = await zap.connect(signers[1]).balanceOf(signerAddress);

      let symbol: string = "BTC/USD";
      // Request string
      const api: string =
        "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4";
      await token.connect(signers[1]).approve(zap.address, 6000);
      await zap.connect(signers[1]).requestData(api, symbol, 100000, 52);

      let balAfterRequestData = await zap
        .connect(signers[1])
        .balanceOf(signerAddress);

      expect(orignalBal.sub(balAfterRequestData).toString()).to.equal("52");

      const zapClass = new Zap(1337, signers[1]);

      await zapClass.approveSpending(500000);

      await zapClass.addTip(1, 333);

      let balAfterAddTip = await zap
        .connect(signers[1])
        .balanceOf(signerAddress);
      
      expect(balAfterRequestData.sub(balAfterAddTip).toString()).to.equal("333");
    });

    it("Reverts function if tip amount is greater than 1000", async () => {
        const signerAddress = await signers[1].getAddress();
        await token.allocate(signerAddress, "10000000000000000000000000");
  
        let orignalBal = await zap.connect(signers[1]).balanceOf(signerAddress);
  
        let symbol: string = "BTC/USD";
        // Request string
        const api: string =
          "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4";
        await token.connect(signers[1]).approve(zap.address, 6000);
        await zap.connect(signers[1]).requestData(api, symbol, 100000, 1000);
  
        let balAfterRequestData = await zap
          .connect(signers[1])
          .balanceOf(signerAddress);
  
        expect(orignalBal.sub(balAfterRequestData).toString()).to.equal("1000");
  
        const zapClass = new Zap(1337, signers[1]);
  
        await zapClass.approveSpending(500000);

        // await zapClass.addTip(1, "10000000000000000000000000");
  
        await zapClass.addTip(1, 10000).should.be.rejectedWith("revert Tip cannot be greater than 1000 Zap Tokens");

    })
  });
});
