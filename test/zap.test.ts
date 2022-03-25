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
import Vault from "../src/vault";

import { getSigners } from "./test_utils";
import { SuiteConstants } from "mocha";
import { Address } from "ethereumjs-util";

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

      // the vault balance should be stake amount
      const vaultClass = new Vault(1337, signers[1]);

      const vaultBalance = await vaultClass.userBalance(signerAddress);

      expect(String(vaultBalance)).to.equal("500000000000000000000000");
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

      expect(balAfterRequestData.sub(balAfterAddTip).toString()).to.equal(
        "333000000000000000000"
      );
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

      await zapClass
        .addTip(1, 10001)
        // .addTip(1, 10000)
        .should.be.rejectedWith(
          "revert Tip cannot be greater than 1000 Zap Tokens"
        );
    });
  });

  describe.only("Dispute", async () => {
    beforeEach(async () => {
      await token.allocate(zapMaster.address, "10000000000000000000000000");
      for (let i = 1; i <= 5; i++) {
        const _address = await signers[i].getAddress();
        if (i === 5) {
          await token.allocate(_address, "10000000000000000000000000");
        }
        await token.allocate(_address, "1100000000000000000000000");
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.approveSpending(500000);
        await zapClass.stake();
        expect(String(await zapMaster.balanceOf(_address))).to.equal(
          i === 5 ? "10600000000000000000000000" : "600000000000000000000000"
        );
        expect(String(await zapMaster.balanceOf(zapVault.address))).to.equal(
          `${5 * i}00000000000000000000000`
        );
      }

      await token.allocate(
        await signers[6].getAddress(),
        "500000000000000000000"
      );

      let symbol: string = "BTC/USD";
      // Request string
      const api: string =
        "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4";
      const _zapClass = new Zap(1337, signers[1]);
      await _zapClass.approveSpending(60000);
      await _zapClass.zap.requestData(api, symbol, 100000, 52);

      for (var i = 1; i <= 5; i++) {
        const _address = await signers[i].getAddress();
        console.log(`Miner ${i}: ${_address}`);
        const status = await zapMaster.getStakerInfo(_address);
        console.log(status[0].toString());
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.approveSpending(i === 5 ? 50000000 : 500000);
        // Connects address 1 as the signer
        zap = zap.connect(signers[i]);

        /*
              Gets the data properties for the current request
              bytes32 _challenge,
              uint256[5] memory _requestIds,
              uint256 _difficutly,
              uint256 _tip
            */
        const newCurrentVars: any = await zapClass.zap.getNewCurrentVariables();

        // Each Miner will submit a mining solution
        const mining = await zapClass.zap.submitMiningSolution(
          "nonce",
          1,
          1200
        );

        // Checks if the miners mined the challenge
        // true = Miner did mine the challenge
        // false = Miner did not mine the challenge
        const didMineStatus: boolean = await zapMaster.didMine(
          newCurrentVars[0],
          _address
        );
        expect(didMineStatus).to.be.true;
      }
    });
    //////////////////////// From hardhat-bsc

    it("Should be able to dispute a submission.", async () => {
      // Converts the uintVar "stakeAmount" to a bytes array
      const timeOfLastNewValueBytes: Uint8Array =
        ethers.utils.toUtf8Bytes("timeOfLastNewValue");

      // Converts the uintVar "stakeAmount" from a bytes array to a keccak256 hash
      const timeOfLastNewValueHash: string = ethers.utils.keccak256(
        timeOfLastNewValueBytes
      );

      // Gets the the current stake amount
      let timeStamp: BigNumber = await zapMaster.getUintVar(
        timeOfLastNewValueHash
      );

      /////////// await zapTokenBsc.connect(signers[1]).approve(zapMaster.address, BigNumber.from("500000000000000000000000"));
      await token
        .connect(signers[1])
        .approve(zapMaster.address, "500000000000000000000000");

      // Convert to a bytes array
      const _disputeCount: Uint8Array =
        ethers.utils.toUtf8Bytes("disputeCount");

      // Convert to a keccak256 hash
      const disputecount: string = ethers.utils.keccak256(_disputeCount);

      // Gets the disputeID also the dispute count
      let disputeId: BigNumber = await zapMaster.getUintVar(disputecount);

      // test dispute count before beginDispute
      expect(disputeId).to.deep.equal(
        BigNumber.from("0"),
        "There should be no disputes before beginDispute."
      );

      // Connect with signer whom is not staked
      const zapClass = new Zap(1337, signers[6]);
      await expect(
        zapClass.dispute("1", String(timeStamp), "4")
      ).to.be.rejectedWith("Only stakers can begin a dispute");

      // Connect  to signer whom is staked
      await zapClass.zap.connect(signers[1]);
      const _zapClass = new Zap(1337, signers[1]);
      await _zapClass.dispute("1", String(timeStamp), "4");

      disputeId = await zapMaster.getUintVar(disputecount);
      // test dispute count after beginDispute
      expect(disputeId).to.deep.equal(
        BigNumber.from(1),
        "Dispute count should be 1."
      );

      disputeId = await zapMaster.getUintVar(disputecount);
      let disp = await zapMaster.getAllDisputeVars(disputeId);

      // expect to be the address that begain the dispute
      expect(disp[4]).to.equal(await signers[1].getAddress());
      // expect to be the address that is being disputed
      expect(disp[3]).to.equal(await signers[5].getAddress());
      //expect requestID disputed to be 1
      expect(String(disp[7][0])).to.equal(String(1));
      // expect timestamp to be the same timestamp used when disputed
      expect(String(disp[7][1])).to.equal(String(timeStamp));

      // check dispute fee increased
      let disputeFee = await zapMaster.getUintVar(getUintHash("disputeFee"));
      let stakeAmount = await zapMaster.getUintVar(getUintHash("stakeAmount"));
      let stakers = await zapMaster.getUintVar(getUintHash("stakerCount"));
      let targetMiners = await zapMaster.getUintVar(
        getUintHash("targetMiners")
      );

      // self.uintVars[keccak256('stakeAmount')].mul(
      //   1000 -
      //   (self.uintVars[keccak256('stakerCount')] * 1000) /
      //   self.uintVars[keccak256('targetMiners')]
      // ) / 1000
      expect(disputeFee).to.deep.equal(
        stakeAmount
          .mul(
            BigNumber.from(1000).sub(
              stakers.mul(BigNumber.from(1000)).div(targetMiners)
            )
          )
          .div(BigNumber.from(1000))
      );

      //////////
    });

    it.only("Should be able to dispute with token balance exactly equal to disputeFee.", async () => {
      // main actor in this test case
      let disputer = await signers[1].getAddress();

      // Converts the uintVar "stakeAmount" to a bytes array
      const timeOfLastNewValueBytes: Uint8Array =
        ethers.utils.toUtf8Bytes("timeOfLastNewValue");

      // Converts the uintVar "stakeAmount" from a bytes array to a keccak256 hash
      const timeOfLastNewValueHash: string = ethers.utils.keccak256(
        timeOfLastNewValueBytes
      );

      // Gets the the current stake amount
      let timeStamp: BigNumber = await zapMaster.getUintVar(
        timeOfLastNewValueHash
      );

      // balance of disputer (main actor in this test case)
      let disputerBalance = (await token.balanceOf(disputer)).toString();

      // give away tokens to make 0 Zap Token balance
      await token
        .connect(signers[1])
        .transfer(await signers[2].getAddress(), disputerBalance);

      // get the disputeFee
      let disputeFee = await zapMaster.getUintVar(getUintHash("disputeFee"));

      // allocate disputeFee amount of tokens to disputer
      await token.connect(signers[0]).allocate(disputer, disputeFee);

      disputerBalance = (await token.balanceOf(disputer)).toString(); //487500000000000000000000

      // create zap class
      const zapClass = new Zap(1337, signers[1]);

      // approve then begin dispute
      await token.connect(signers[1]).approve(zapMaster.address, disputeFee);
      await zapClass.dispute("1", String(timeStamp), "4");

      // Convert to a bytes array
      const disputeCount: Uint8Array = ethers.utils.toUtf8Bytes("disputeCount");

      // Convert to a keccak256 hash
      const ddisputecount: string = ethers.utils.keccak256(disputeCount);

      // Gets the disputeID also the dispute count
      let disputeId: BigNumber = await zapMaster.getUintVar(ddisputecount);

      disputeId = await zapMaster.getUintVar(ddisputecount);
      let disp = await zapMaster.getAllDisputeVars(String(disputeId));

      let reporting_miner_wallet_bal = await token.balanceOf(disp[5]);

      let reportingVBal = await zapVault.userBalance(disp[4]);

      let initReportedVBal = await zapVault.userBalance(disp[3]);

      expect(String(reporting_miner_wallet_bal)).to.equal(String("0"));

      // expect to be the address that begain the dispute
      expect(disp[4]).to.equal(disputer);
      // expect to be the address that is being disputed
      expect(disp[3]).to.equal(await signers[5].getAddress());
      //expect requestID disputed to be 1
      expect(String(disp[7][0])).to.equal(String(1));
      // expect timestamp to be the same timestamp used when disputed
      expect(String(disp[7][1])).to.equal(String(timeStamp));

      // vote of a dispute
      // signers 2-4 vote for the dispute 1
      for (var i = 2; i < 5; i++) {
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.vote(Number(String(disputeId)), false);
      }
      disputeId = await zapMaster.getUintVar(ddisputecount);
      disp = await zapMaster.getAllDisputeVars(disputeId);
      expect(String(disp[7][6])).to.equal(String(4));

      zapMaster.didVote(disputeId, disputer);

      let blockNumber = await provider.getBlockNumber();

      // Increase the evm time by 8 days
      // A stake can not be withdrawn until 7 days passed
      await provider.send("evm_increaseTime", [691200]);
      await zapClass.tallyVotes(Number(String(disputeId)));

      disp = await zapMaster.getAllDisputeVars(disputeId);

      // expect voting to have ended
      expect(disp[1]).to.be.true;

      // expect dispute to be successful
      expect(disp[2]).to.be.false;

      blockNumber = await provider.getBlockNumber();

      let winner_miner_wallet_bal = await zapMaster.balanceOf(disp[3]);

      reporting_miner_wallet_bal = await zapMaster.balanceOf(disp[4]);

      let finalReportingVBal = await zapVault.userBalance(disp[4]);

      let finalReportedVBal = await zapVault.userBalance(disp[3]);

      // let zMBal = await zap.getBalanceAt(zapMaster.address, blockNumber);
      blockNumber = await provider.getBlockNumber();

      // let zMBal = await zap.getBalanceAt(zapMaster.address, blockNumber);
      let zMBal2 = await zapMaster.balanceOf(zapMaster.address);

      ///

      // expect balance of winner's wallet to be 1087500: 600k(leftover bal. after staking) + 487500 disputeFee
      expect(String(winner_miner_wallet_bal)).to.equal(
        String("11087500000000000000000000")
      );

      // 0, since disputer's balance was exactly disputeFee
      expect(String(reporting_miner_wallet_bal)).to.equal(String("0"));

      expect(String(reportingVBal)).to.equal(String(finalReportingVBal));

      expect(String(initReportedVBal.add(disputeFee))).to.equal(
        String(finalReportedVBal)
      );
    });
  });

  describe("Voting", async () => {
    beforeEach(async () => {
      await token.allocate(zapMaster.address, "10000000000000000000000000");
      for (let i = 1; i <= 5; i++) {
        const _address = await signers[i].getAddress();
        if (i === 5) {
          await token.allocate(_address, "10000000000000000000000000");
        }
        await token.allocate(_address, "1100000000000000000000000");
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.approveSpending(500000);
        await zapClass.stake();
        expect(String(await zapMaster.balanceOf(_address))).to.equal(
          i === 5 ? "10600000000000000000000000" : "600000000000000000000000"
        );
        expect(String(await zapMaster.balanceOf(zapVault.address))).to.equal(
          `${5 * i}00000000000000000000000`
        );
      }

      await token.allocate(
        await signers[6].getAddress(),
        "500000000000000000000000"
      );

      let symbol: string = "BTC/USD";
      // Request string
      const api: string =
        "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4";
      const _zapClass = new Zap(1337, signers[1]);
      await _zapClass.approveSpending(60000);
      await _zapClass.zap.requestData(api, symbol, 100000, 52);

      for (var i = 1; i <= 5; i++) {
        const _address = await signers[i].getAddress();
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.approveSpending(i === 5 ? 50000000 : 500000);
        // Connects address 1 as the signer
        zap = zap.connect(signers[i]);

        /*
              Gets the data properties for the current request
              bytes32 _challenge,
              uint256[5] memory _requestIds,
              uint256 _difficutly,
              uint256 _tip
            */
        const newCurrentVars: any = await zapClass.zap.getNewCurrentVariables();

        // Each Miner will submit a mining solution
        const mining = await zapClass.zap.submitMiningSolution(
          "nonce",
          1,
          1200
        );

        // Checks if the miners mined the challenge
        // true = Miner did mine the challenge
        // false = Miner did not mine the challenge
        const didMineStatus: boolean = await zapMaster.didMine(
          newCurrentVars[0],
          _address
        );
        expect(didMineStatus).to.be.true;
      }

      const timeOfLastNewValueBytes: Uint8Array =
        ethers.utils.toUtf8Bytes("timeOfLastNewValue");

      // Converts the uintVar "stakeAmount" from a bytes array to a keccak256 hash
      const timeOfLastNewValueHash: string = ethers.utils.keccak256(
        timeOfLastNewValueBytes
      );

      // Gets the the current stake amount
      let timeStamp: BigNumber = await zapMaster.getUintVar(
        timeOfLastNewValueHash
      );

      await token
        .connect(signers[1])
        .approve(zapMaster.address, "500000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);

      await zapClass.dispute("1", String(timeStamp), "4");

      const disputeCount: Uint8Array = ethers.utils.toUtf8Bytes("disputeCount");

      // Convert to a keccak256 hash
      const ddisputecount: string = ethers.utils.keccak256(disputeCount);

      const disputeCountNumber = await zapMaster.getUintVar(ddisputecount);

      expect(disputeCountNumber.toString()).to.equal("1");
    });
    it("Only allow staked miners to vote", async () => {
      const zapClass = new Zap(1337, signers[6]);
      await zapClass
        .vote(1, true)
        .should.be.rejectedWith(
          "Only Stakers that are not under dispute can vote"
        );
      const didVote = await zapMaster.didVote(
        "1",
        await signers[6].getAddress()
      );
      expect(didVote).to.be.false;
    });
    it("Shouldn't allow disputed miners to vote", async () => {
      const zapClass = new Zap(1337, signers[5]);
      await zapClass
        .vote(1, true)
        .should.be.rejectedWith(
          "Only Stakers that are not under dispute can vote"
        );
      const didVote = await zapMaster.didVote(
        "1",
        await signers[5].getAddress()
      );
      expect(didVote).to.be.false;
    });
    it("Allow staked miners to vote", async () => {
      const zapClass = new Zap(1337, signers[2]);
      await zapClass.vote(1, true);
      const didVote = await zapMaster.didVote(
        "1",
        await signers[2].getAddress()
      );
      expect(didVote).to.be.true;
    });
  });

  describe.only("Tally Votes", async function () {
    this.timeout(200000);
    beforeEach(async () => {
      await token.allocate(zapMaster.address, "10000000000000000000000000");
      for (let i = 1; i <= 15; i++) {
        const _address = await signers[i].getAddress();
        await token.allocate(_address, "1100000000000000000000000");
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.approveSpending(500000);
        await zapClass.stake();
        expect(String(await zapMaster.balanceOf(_address))).to.equal(
          "600000000000000000000000"
        );
        expect(String(await zapMaster.balanceOf(zapVault.address))).to.equal(
          `${5 * i}00000000000000000000000`
        );
      }

      let symbol: string = "BTC/USD";
      // Request string
      const api: string =
        "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4";
      const _zapClass = new Zap(1337, signers[1]);
      await _zapClass.approveSpending(60000);
      await _zapClass.zap.requestData(api, symbol, 100000, 52);

      for (var i = 1; i <= 5; i++) {
        const _address = await signers[i].getAddress();
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.approveSpending(i === 5 ? 50000000 : 500000);
        // Connects address 1 as the signer
        zap = zap.connect(signers[i]);

        /*
              Gets the data properties for the current request
              bytes32 _challenge,
              uint256[5] memory _requestIds,
              uint256 _difficutly,
              uint256 _tip
            */
        const newCurrentVars: any = await zapClass.zap.getNewCurrentVariables();

        // Each Miner will submit a mining solution
        const mining = await zapClass.zap.submitMiningSolution(
          "nonce",
          1,
          1200
        );

        // Checks if the miners mined the challenge
        // true = Miner did mine the challenge
        // false = Miner did not mine the challenge
        const didMineStatus: boolean = await zapMaster.didMine(
          newCurrentVars[0],
          _address
        );
        expect(didMineStatus).to.be.true;
      }

      const timeOfLastNewValueBytes: Uint8Array =
        ethers.utils.toUtf8Bytes("timeOfLastNewValue");

      // Converts the uintVar "stakeAmount" from a bytes array to a keccak256 hash
      const timeOfLastNewValueHash: string = ethers.utils.keccak256(
        timeOfLastNewValueBytes
      );

      // Gets the the current stake amount
      let timeStamp: BigNumber = await zapMaster.getUintVar(
        timeOfLastNewValueHash
      );

      await token
        .connect(signers[1])
        .approve(zapMaster.address, "500000000000000000000000");

      const zapClass = new Zap(1337, signers[1]);

      await zapClass.dispute("1", String(timeStamp), "4");

      const disputeCount: Uint8Array = ethers.utils.toUtf8Bytes("disputeCount");

      // Convert to a keccak256 hash
      const ddisputecount: string = ethers.utils.keccak256(disputeCount);

      const disputeCountNumber = await zapMaster.getUintVar(ddisputecount);

      expect(disputeCountNumber.toString()).to.equal("1");
    });

    it("Should fail dispute if the number of voters are less than 10%", async () => {
      const zapClass = new Zap(1337, signers[2]);
      await zapClass.vote(1, true);
      const didVote = await zapMaster.didVote(
        "1",
        await signers[2].getAddress()
      );
      expect(didVote).to.be.true;

      await provider.send("evm_increaseTime", [691200]);

      await zapClass.tallyVotes(1);

      const disp = await zapMaster.getAllDisputeVars(1);

      // expect voting to have ended
      expect(disp[1]).to.be.true;

      // expect dispute to have failed
      expect(disp[2]).to.be.false;
    });

    it("'Should revert when calling tallyVote() if not 7 days.'", async () => {
      for (let i = 6; i <= 12; i++) {
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.vote(1, i % 2 == 0);
        const didVote = await zapMaster.didVote(
          "1",
          await signers[i].getAddress()
        );
        expect(didVote).to.be.true;
      }

      await provider.send("evm_increaseTime", [600]);

      const nonStaked = new Zap(1337, signers[19]);
      await nonStaked
        .tallyVotes(1)
        .should.be.rejectedWith("Cannot vote at this time");
    });
    it.only("Should tally votes", async () => {
      for (let i = 6; i <= 12; i++) {
        const zapClass = new Zap(1337, signers[i]);
        await zapClass.vote(1, i % 2 == 0);
        const didVote = await zapMaster.didVote(
          "1",
          await signers[i].getAddress()
        );
        expect(didVote).to.be.true;
      }

      await provider.send("evm_increaseTime", [691200]);

      const nonStaked = new Zap(1337, signers[19]);
      await nonStaked.tallyVotes(1);

      const disp = await zapMaster.getAllDisputeVars(1);

      // expect voting to have ended
      expect(disp[1]).to.be.true;

      // expect dispute to have failed
      expect(disp[2]).to.be.true;
    });
  });
});

// helps grab uintVar variables from ZapStorage
async function getUintHash(key: string) {
  // Converts the uintVar "stakeAmount" to a bytes array
  const _bytes: Uint8Array = ethers.utils.toUtf8Bytes(key);

  // Converts the uintVar "stakeAmount" from a bytes array to a keccak256 hash
  const _hash: string = ethers.utils.keccak256(_bytes);

  return _hash;
}
