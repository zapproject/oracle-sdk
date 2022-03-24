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

    stake();

    requestData();
  });

  async function stake() {
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
  };

  async function requestData() {
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

  };
  
  it("should", async () => {

    console.log("done");
  });
});
