import { ethers } from 'ethers';

import * as abis from './contract/abi';

import * as bytecodes from './contract/bytecode';

import * as disputeJson from '@zapprotocol/bsc-contracts/artifacts/contracts/zap-miner/libraries/ZapDispute.sol/ZapDispute.json'

import * as gettersJson from '@zapprotocol/bsc-contracts/artifacts/contracts/zap-miner/libraries/ZapGettersLibrary.sol/ZapGettersLibrary.json'

import * as stakeJson from '@zapprotocol/bsc-contracts/artifacts/contracts/zap-miner/libraries/ZapStake.sol/ZapStake.json'

console.log(stakeJson.abi, stakeJson.bytecode)

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

const signer = provider.getSigner(0);

const stakeCode = "__$341c69a3b8ea65d7eeecd190190dea4d1b$__"
const disputeCode = "__$965cfd6d1cee46a73cf1c675b6712824df$__"
const libraryCode = "__$6f5c017f31ba759198a3415002c70b4aa5$__"

let zapAddress: string;
let zapMasterAddress: string;

export const deployZap = async (tokenAddress: string, _zapDisputeAddress: string, _zapStakeAddress: string, _zapLibraryAddress: string) => {
  const linkedBytecode = bytecodes.zapByteCode.replaceAll(disputeCode, _zapDisputeAddress.slice(2, _zapDisputeAddress.length).toLowerCase());
  const linkedBytecode2 = linkedBytecode.replaceAll(stakeCode, _zapStakeAddress.slice(2, _zapStakeAddress.length).toLowerCase());
  const linkedBytecode3 = linkedBytecode2.replaceAll(libraryCode, _zapLibraryAddress.slice(2, _zapLibraryAddress.length).toLowerCase());
  const zapFactory = new ethers.ContractFactory(
    abis.zapAbi,
    linkedBytecode3,
    signer,
  );

  const zap = await zapFactory.deploy(tokenAddress);

  await zap.deployed();

  zapAddress = zap.address;

  return zap;
};

export const deployZapMaster = async (_zapAddress: string, tokenAddress: string, _zapStakeAddress: string) => {
  const linkedBytecode = bytecodes.zapMasterBytecode.replace(stakeCode, _zapStakeAddress.slice(2, _zapStakeAddress.length).toLowerCase());
  const zapMasterFactory = new ethers.ContractFactory(
    abis.zapMasterAbi,
    linkedBytecode,
    signer,
  );

  let zapMaster = await zapMasterFactory.deploy(_zapAddress, tokenAddress);

  await zapMaster.deployed();

  // zapMaster.initializeVault(zapMasterAddress);

  zapMasterAddress = zapMaster.address;

  return zapMaster;
};

export const deployZapToken = async () => {
  const zapTokenFactory = new ethers.ContractFactory(
    abis.zapTokenAbi,
    bytecodes.zapTokenByteCode,
    signer,
  );

  const zapToken = await zapTokenFactory.deploy();

  await zapToken.deployed();

  return zapToken;
}

export const deployZapGettersLibrary = async () => {
  const zapGettersLibraryFactory = new ethers.ContractFactory(
    gettersJson.abi,
    gettersJson.bytecode,
    signer,
  );

  const zapGettersLibrary = await zapGettersLibraryFactory.deploy();

  await zapGettersLibrary.deployed();

  return zapGettersLibrary;
}

export const deployZapDispute = async () => {
  const zapDisputeFactory = new ethers.ContractFactory(
    disputeJson.abi,
    disputeJson.bytecode,
    signer,
  );

  const zapDispute = await zapDisputeFactory.deploy();

  await zapDispute.deployed();

  return zapDispute;
}

export const deployZapStake = async (_zapDisputeAddress: string) => {
  const linkedBytecode = stakeJson.bytecode.replaceAll(disputeCode, _zapDisputeAddress.slice(2, _zapDisputeAddress.length).toLowerCase());
  // zapStakeByteCode.replaceAll(disputeCode, _zapDisputeAddress.slice(2, _zapDisputeAddress.length));
  console.log(linkedBytecode)
  const zapStakeFactory = new ethers.ContractFactory(
    stakeJson.abi,
    linkedBytecode,
    signer,
  );

  const zapStake = await zapStakeFactory.deploy();

  await zapStake.deployed();

  return zapStake;
}

export const deployZapLibrary = async () => {
  const zapLibraryFactory = new ethers.ContractFactory(
    abis.zapLibraryAbi,
    bytecodes.zapLibraryByteCode,
    signer,
  );

  const zapLibrary = await zapLibraryFactory.deploy();

  await zapLibrary.deployed();

  return zapLibrary;
}

export const deployVault = async (_zapMasterAddress: string, zapToken: string) => {
  const vaultFactory = new ethers.ContractFactory(
    abis.vaultAbi,
    bytecodes.vaultByteCode,
    signer,
  );

  const vault = await vaultFactory.deploy(zapToken, _zapMasterAddress);

  await vault.deployed();

  return vault;
}






// TODO: Figure out deploying zap getters (after class creation), since it doens't have its own address
// export const deployZapGetters = async () => {
  
//   const gettersFactory = new ethers.ContractFactory(
//     abis.zapGettersAbi,
//     bytecodes.zapGettersBytecode,
//     signer,
//   );

//   let zapGetters = await gettersFactory.deploy();

//   await zapGetters.deployed();

//   zapMasterAddress = zapGetters.address;
//   return zapGetters;
// };

// export const deployZapMedia = async () => {
//   // ZapMarket contract instance
//   const zapMarket = new ethers.Contract(zapMarketAddress, abis.zapMarketAbi, signer);

//   // MediaFactory contract instance
//   const mediaFactory = new ethers.Contract(mediaFactoryAddress, abis.mediaFactoryAbi, signer);

//   // Sets the MediaFactory to ZapMarket
//   await zapMarket.setMediaFactory(mediaFactoryAddress);

//   const deployMedia = await mediaFactory.deployMedia(
//     'TEST COLLECTION',
//     'TC',
//     zapMarket.address,
//     true,
//     'https://testing.com',
//   );

//   const receipt = await deployMedia.wait();

//   const eventLogs = receipt.events[receipt.events.length - 1];

//   const zapMediaAddress = eventLogs.args.mediaContract;

//   const zapMedia = new ethers.Contract(zapMediaAddress, abis.zapMediaAbi, signer);

//   await zapMedia.deployed();

//   await zapMedia.claimTransferOwnership();

//   return zapMedia;
// };
