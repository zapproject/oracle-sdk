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

import Vault from "../src/vault";
import ZapMaster from "../src/zapMaster";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
chai.use(chaiAsPromised);

chai.should();

describe.only("ZapMaster", () => {
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

  describe("Should retrieve all the getters for Disputed values", async function() {
    this.timeout(400000);
    beforeEach(async () => {
        await token.allocate(zapMaster.address, "10000000000000000000000000");
        for (let i = 1; i <= 15; i++) {
            console.log(i)
          const _address = await signers[i].getAddress();
          await zap.attach(zapMaster.address)
          await token.allocate(_address, "1100000000000000000000000");
          await token.connect(signers[i]).approve(zapMaster.address, "500000000000000000000000");
          const allowance = await token.allowance(_address, zapMaster.address);
          console.log(String(allowance))
          await zap.connect(signers[i])
          
          console.log(_address)
          await zap.depositStake();
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
        await token.connect(signers[1]).approve(zapMaster.address, "60000000000000000000000");
        await zap.connect(signers[1]).requestData(api, symbol, 100000, 52);
  
        for (var i = 1; i <= 5; i++) {
          const _address = await signers[i].getAddress();
          token.connect(signers[i]).approve(zapMaster.address, i === 5 ? "50000000000000000000000000" : "500000000000000000000000");
          // Connects address 1 as the signer
          zap = zap.connect(signers[i]);
  
          /*
                Gets the data properties for the current request
                bytes32 _challenge,
                uint256[5] memory _requestIds,
                uint256 _difficutly,
                uint256 _tip
              */
          const newCurrentVars: any = await zap.getNewCurrentVariables();
  
          // Each Miner will submit a mining solution
          const mining = await zap.submitMiningSolution(
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
  
        // const zapClass = new Zap(1337, signers[1]);
  
        await zap.connect(signers[1]).beginDispute("1", String(timeStamp), "4");
  
        const disputeCount: Uint8Array = ethers.utils.toUtf8Bytes("disputeCount");
  
        // Convert to a keccak256 hash
        const ddisputecount: string = ethers.utils.keccak256(disputeCount);
  
        const disputeCountNumber = await zapMaster.getUintVar(ddisputecount);
  
        expect(disputeCountNumber.toString()).to.equal("1");
      });

      it("Should pass before each", async()=> {
          expect("1").to.equal("1");
      })
  })


});
