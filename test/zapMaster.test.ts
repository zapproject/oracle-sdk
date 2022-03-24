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

    let zapMasterDeployed = await deployZapMaster(
      zap.address,
      token.address,
      zapStake.address
    );
    console.log("zapMaster address: ", zapMasterDeployed.address);
    await zapMasterDeployed.deployed();

    zapVault = await deployVault(zapMasterDeployed.address, token.address);
    console.log("zapVault address: ", zapVault.address);
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

    await stake();

    await requestData();

  });

  async function stake() {
    await token.allocate(zapMasterAddresses[1337], "10000000000000000000000000");
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
      await signers[1].getAddress(),
      "10000000000000000000000000"
    );

    let symbol: string = "BTC/USDT";
    // Request string
    let api: string =
      "json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4";
    const _zapClass = new Zap(1337, signers[1]);
    await _zapClass.approveSpending(52000000000000000000);
    await _zapClass.zap.requestData(api, symbol, 100000, 10);

    symbol = "ETH/USDT";
    // Request string
    api =
      "json(https://api.binance.com/api/v1/klines?symbol=ETHUSDT&interval=1d&limit=1).0.4";
    await _zapClass.zap.requestData(api, symbol, 100000, 1);
  };
  
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

    // let {api, symbol, hash, gran, qIndex, tip};
    let vars = await zapMaster.getRequestVars(1);
    expect(vars[0]).to.equal("json(https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1).0.4");
    expect(vars[1]).to.equal("BTC/USDT");
    expect(String(vars[3])).to.equal("100000");
    expect(String(vars[4])).to.equal("0");
    expect(String(vars[5])).to.equal("0");
  });
});
