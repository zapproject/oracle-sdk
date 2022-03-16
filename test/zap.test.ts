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
} from "../src/deploy"

import {
    zapTokenAddresses,
    zapGettersLibraryAddresses,
    zapLibraryAddresses,
    zapMasterAddresses,
    zapStakeAddresses,
    zapDisputeAddresses,
    zapAddresses,
    vaultAddresses
} from "../src/contract/addresses";

import Zap from "../src/zap"

import { getSigners } from "./test_utils";
import { SuiteConstants } from "mocha";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
chai.use(chaiAsPromised);

chai.should();

describe("ZapMaster", () => {
    let signer : Signer;
    let zapVault : Contract;
    let zapMaster : Contract;
    let zapGettersLibrary : Contract;
    let zapLibrary : Contract;
    let zapStake : Contract;
    let zapDispute : Contract;
    let token : Contract;
    let zap : Contract; 

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

        zap = await deployZap(token.address, zapDispute.address, zapStake.address, zapLibrary.address);
        console.log("zap address: ", zap.address);
        await zap.deployed();

        zapMaster = await deployZapMaster(zap.address, token.address, zapStake.address);
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
    })

    describe("Test Before Each", () => {
        it("should deploy ZapMaster", async () => {
            expect(zapMaster).to.exist;
        });
    })

    describe.only("Staking", () => {
        it("Revert if balance does not equal 500K ZAP", async() => {
            const zapClass = new Zap(1337, signers[1]);
            await zapClass.stake().should.be.rejectedWith("VM Exception while processing transaction: revert");
        })

        it.only("Should return a staked status of 1 for a balance greater than 500K", async () => {
            const signerAddress = await signers[1].getAddress();
            await token.allocate(signerAddress, "10000000000000000000000000");
            
            const zapClass = new Zap(1337, signers[1]);
            await zapClass.approveSpending(500000);
            const allowance = await token.allowance(signerAddress, zap.address);
            console.log(String(allowance));
            await zapClass.stake()
            const stakerInfo = await zapMaster.getStakerInfo(signerAddress);
            // console.log(stakerInfo);
            expect(stakerInfo[0]).to.equal(1);
        })
    })
});


