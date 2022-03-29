import chai, { expect } from "chai";
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

import { getSigners } from "./test_utils";
import { SuiteConstants } from "mocha";
import { Address } from "ethereumjs-util";

import Zap from "../src/zap";
import Vault from "../src/vault";
import ZapMaster from "../src/zapMaster";
import { time, timeStamp } from "console";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
chai.use(chaiAsPromised);

chai.should();

describe.only("ZapMaster", () => {
  let signer: Signer;
  let zapVault: Contract;
  let zapMaster: ZapMaster;
  let zapGettersLibrary: Contract;
  let zapLibrary: Contract;
  let zapStake: Contract;
  let zapDispute: Contract;
  let token: Contract;
  let zap: Contract;
  let zapMasterDeployed: Contract;

  const signers = getSigners(provider);

  beforeEach(async () => {
    signer = signers[0];

    token = await deployZapToken();
    await token.deployed();

    zapGettersLibrary = await deployZapGettersLibrary();
    await zapGettersLibrary.deployed();

    zapDispute = await deployZapDispute();
    await zapDispute.deployed();

    zapStake = await deployZapStake(zapDispute.address);
    await zapStake.deployed();

    zapLibrary = await deployZapLibrary();
    await zapLibrary.deployed();

    zap = await deployZap(
      token.address,
      zapDispute.address,
      zapStake.address,
      zapLibrary.address
    );
    await zap.deployed();

    let zapMasterDeployed = await deployZapMaster(
      zap.address,
      token.address,
      zapStake.address
    );
    await zapMasterDeployed.deployed();

    zapVault = await deployVault(zapMasterDeployed.address, token.address);
    await zapVault.deployed();

    await zapMasterDeployed.changeVaultContract(zapVault.address);

    zapAddresses["1337"] = zap.address;
    zapTokenAddresses["1337"] = token.address;
    zapGettersLibraryAddresses["1337"] = zapGettersLibrary.address;
    zapLibraryAddresses["1337"] = zapLibrary.address;
    zapMasterAddresses["1337"] = zapMasterDeployed.address;
    zapStakeAddresses["1337"] = zapStake.address;
    zapDisputeAddresses["1337"] = zapDispute.address;
    vaultAddresses["1337"] = zapVault.address;

    zapMaster = new ZapMaster(1337, signers[1]);

    await stake(zapMasterDeployed);

    await requestData();
  });

  async function stake(zapMasterC: Contract) {
    await token.allocate(
      zapMasterAddresses[1337],
      "10000000000000000000000000"
    );

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

      let staked = await zapMaster.getStakerInfo(await signers[i].getAddress());
      expect(String(staked[0])).to.equal("1");
    }
  }

  async function requestData() {
    await token.allocate(
      await signers[1].getAddress(),
      "10000000000000000000000000"
    );

    let symbol: string = "BTC/USDT";
    // Request string
    let api: string =
      "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4";
    const _zapClass = new Zap(1337, signers[1]);
    await _zapClass.approveSpending(52000000000000000000);

    let allowance = await zapMaster.allowance(await signers[1].getAddress(), zapMasterAddresses[1337])
    expect(String(allowance)).to.equal("52000000000000000000000000000000000000");

    await _zapClass.zap.requestData(api, symbol, 100000, 10);

    symbol = "ETH/USDT";
    // Request string
    api =
      "json(https://api.binance.com/api/v1/klines?symbol=ETHUSDT&interval=1d&limit=1).0.4";
    await _zapClass.zap.requestData(api, symbol, 100000, 1);
  }

  async function mine(){
    for (var i = 1; i <= 5; i++) {
      const _address = await signers[i].getAddress();

      await token
        .connect(signers[i])
        .approve(
          zapMasterAddresses[1337],
          i === 5 ? "50000000000000000000000000" : "500000000000000000000000"
        );

      const zapClass = new Zap(1337, signers[i]);

      const newCurrentVars: any = await zapClass.zap.getNewCurrentVariables();

      const mining = await zapClass.zap.submitMiningSolution(
        "nonce",
        1,
        1200
      );

      const zmClass = new ZapMaster(1337, signers[1]);
      const didMineStatus: boolean = await zmClass.zapMaster.didMine(
        newCurrentVars[0],
        _address
      );
      expect(didMineStatus).to.be.true;
    }
  }

  it("Should get all request data getters", async () => {
    let requestGran = await zapMaster.getRequestUintVars(1, "granularity");
    expect(String(requestGran)).to.equal("100000");

    let totalTip = await zapMaster.getUintVar("currentTotalTips");
    expect(String(totalTip)).to.equal("10");

    // the request's total tip is 0 because it's been transfer to on-deck as there is only one request and is now currentTotalTips
    let requestTotalTip = await zapMaster.getRequestUintVars(1, "totalTip");
    expect(String(requestTotalTip)).to.equal("0");

    let requestTotalTip2 = await zapMaster.getRequestUintVars(2, "totalTip");
    expect(String(requestTotalTip2)).to.equal("1");

    let requestQ = await zapMaster.getRequestQ();
    expect(String(requestQ[50])).to.equal("1");

    let requestIdFromQ = await zapMaster.getRequestIdByRequestQIndex(50);
    expect(String(requestIdFromQ)).to.equal("2");

    // let {api, symbol, hash, gran, qIndex, tip};
    let vars = await zapMaster.getRequestVars(1);
    expect(vars[0]).to.equal(
      "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4"
    );
    expect(vars[1]).to.equal("BTC/USDT");
    expect(String(vars[3])).to.equal("100000");
    expect(String(vars[4])).to.equal("0");
    expect(String(vars[5])).to.equal("0");

    let currentVar = await zapMaster.getCurrentVariables();
    expect(String(currentVar[1])).to.equal("1");
    expect(String(currentVar[2])).to.equal("1");
    expect(String(currentVar[3])).to.equal(
      "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4"
    );
    expect(String(currentVar[4])).to.equal("100000");
  });

  describe("Should retrieve all the getters for Disputed values", async function() {
    beforeEach(async () => {
      await mine();

      // Gets the the current stake amount
      let timeStamp: BigNumber = await zapMaster.getUintVar(
        "timeOfLastNewValue"
      );

      let disputeFee = await zapMaster.getUintVar("disputeFee");

      expect(
        Number(await token.balanceOf(signers[1].getAddress()))
      ).to.be.greaterThanOrEqual(Number(disputeFee));

      await token
        .connect(signers[1])
        .approve(zapMasterAddresses[1337], disputeFee);

      const zapClass = new Zap(1337, signers[1]);

      await zapClass.dispute("1", String(timeStamp), "2");

      const disputeCountNumber = await zapMaster.getUintVar("disputeCount");

      expect(disputeCountNumber.toString()).to.equal("1");

      const signerSix = await signers[6].getAddress();

      await token.allocate(signerSix, "10000000000000000000000000");
      const sixZap = new Zap(1337, signers[6]);
      await sixZap.approveSpending(500000);
      await sixZap.stake();

      for (let i = 1; i <= 6; i++) {
        if (i !== 1 && i !== 3) {
          const instance = new Zap(1337, signers[i]);
          await instance.approveSpending(500000);
          await instance.vote(1, true);

          let voted = await zapMaster.didVote(1, await signers[i].getAddress());
          expect(voted).to.equal(true);
        }
      }

      

      const zapMasterClass = new ZapMaster(1337, signers[1]);
      const timestamp = await zapMasterClass.getTimestampbyRequestIDandIndex(1, 0);

      expect(String(timestamp)).to.equal(String(timeStamp));

      const miners = await zapMasterClass.getMinersByRequestIdAndTimestamp(1, timestamp);

      const fromHashDisputeId = await zapMasterClass.getDisputeIdByDisputeHash(miners[2], 1, timestamp);

      expect(String(fromHashDisputeId)).to.equal(String("1"))

      const isInDispute = await zapMasterClass.isInDispute(1, timestamp);

      expect(isInDispute).to.be.true; // this value never changes back to false after disputed


      // test for zapMaster Class Getter

      await provider.send("evm_increaseTime", [691200]);

      await zapClass.tallyVotes(1);

      const disp = await zapMaster.getAllDisputeVars(1);

      // expect voting to have ended
      expect(disp[1]).to.be.true;

      // expect dispute to have failed
      expect(disp[2]).to.be.true;
    });

    it.only("Should return 0 from retrieve data call", async () => {
      const zapMasterClass = new ZapMaster(1337, signers[1]);
      const timestamp = await zapMasterClass.getTimestampbyRequestIDandIndex(1, 0);

      const miners = await zapMasterClass.getMinersByRequestIdAndTimestamp(1, timestamp);

      const fromHashDisputeId = await zapMasterClass.getDisputeIdByDisputeHash(miners[2], 1, timestamp);

      expect(String(fromHashDisputeId)).to.equal(String("1"))

      const isInDispute = await zapMasterClass.isInDispute("1", timestamp);

      expect(isInDispute).to.be.true; // this value never changes back to false after disputed

      const disputeCount = await zapMasterClass.getUintVar("disputeCount");

      console.log("dispute id from hash: ", fromHashDisputeId)

      // if dispute has passed successfully retreive data should return 0 else it should return 1200
      let retrievedData = await zapMaster.retrieveData(1, timestamp);
      expect(String(retrievedData)).to.equal("0");


        // uint keccak256("requestId");//apiID of disputed value
        // uint keccak256("timestamp");//timestamp of distputed value
        // uint keccak256("value"); //the value being disputed
        // uint keccak256("minExecutionDate");//7 days from when dispute initialized
        // uint keccak256("numberOfVotes");//the number of parties who have voted on the measure
        // uint keccak256("blockNumber");// the blocknumber for which votes will be calculated from
        // uint keccak256("minerSlot"); //index in dispute array
        // uint keccak256("quorum"); //quorum for dispute vote NEW
        // uint keccak256("fee"); //fee paid corresponding to dispute

        const requestId = await zapMasterClass.getDisputeUintVars(1, "requestId")
        const timestampDispute = await zapMasterClass.getDisputeUintVars(1, "timestamp")
        const valueDispute = await zapMasterClass.getDisputeUintVars(1, "value")
        const minExecutionDate = await zapMasterClass.getDisputeUintVars(1, "minExecutionDate")
        const numberOfVotes = await zapMasterClass.getDisputeUintVars(1, "numberOfVotes")
        const blockNumber = await zapMasterClass.getDisputeUintVars(1, "blockNumber")
        const minerSlot = await zapMasterClass.getDisputeUintVars(1, "minerSlot")
        const quorum = await zapMasterClass.getDisputeUintVars(1, "quorum")
        const fee = await zapMasterClass.getDisputeUintVars(1, "fee")

        console.log("ID",String(requestId))
        console.log("time",String(timestampDispute))
        console.log("value", String(valueDispute))
        console.log("minEx", String(minExecutionDate))
        console.log("Vote count",String(numberOfVotes))
        console.log("BlockNumber",String(blockNumber))
        console.log("MinerSlot", String(minerSlot))
        console.log("Quorum",String(quorum))
        console.log("Fee", String(fee))


      
    });
  });

  it("Should get mining getters", async () => {
    await mine();

    let currentTimestamp = await zapMaster.getTimestampbyRequestIDandIndex(1, 0);
    expect(String(currentTimestamp)).to.not.equal("0");

    let miners = await zapMaster.getMinersByRequestIdAndTimestamp(1, currentTimestamp);

    for (let i = 0; i < miners.length; i++) {
      expect(miners[i]).to.equal(await signers[i+1].getAddress());
    }

    let valueCount = await zapMaster.getNewValueCountbyRequestId(1);
    expect(String(valueCount)).to.equal("1");

    let submissions = await zapMaster.getSubmissionsByTimestamp(1, currentTimestamp);
    expect(String(submissions[0])).to.equal("1200");

    // let nextVar = await zapMaster.getVariablesOnDeck();

    let retrievedData = await zapMaster.retrieveData(1, currentTimestamp);
    expect(String(retrievedData)).to.equal("1200");
  })
});
