import { ethers } from 'ethers';

import * as abis from './contract/abi';

import * as bytecodes from './contract/bytecode';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

const signer = provider.getSigner(0);

let zapAddress: string;
let zapMasterAddress: string;

export const deployZap = async (tokenAddress: string) => {
  const zapFactory = new ethers.ContractFactory(
    abis.zapAbi,
    bytecodes.zapBytecode,
    signer,
  );

  const zap = await zapFactory.deploy(tokenAddress);

  await zap.deployed();

  zapAddress = zap.address;

  return zap;
};

export const deployZapMaster = async (_zapAddress: string, tokenAddress: string) => {
  const zapMasterFactory = new ethers.ContractFactory(
    abis.zapMasterAbi,
    bytecodes.zapMasterBytecode,
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
    abis.zapGettersLibraryAbi,
    bytecodes.zapGettersLibraryByteCode,
    signer,
  );

  const zapGettersLibrary = await zapGettersLibraryFactory.deploy();

  await zapGettersLibrary.deployed();

  return zapGettersLibrary;
}

export const deployZapDispute = async () => {
  const zapDisputeFactory = new ethers.ContractFactory(
    abis.zapDisputeAbi,
    bytecodes.zapDisputeByteCode,
    signer,
  );

  const zapDispute = await zapDisputeFactory.deploy();

  await zapDispute.deployed();

  return zapDispute;
}

export const deployZapStake = async () => {
  const zapStakeFactory = new ethers.ContractFactory(
    abis.zapStakeAbi,
    bytecodes.zapStakeByteCode,
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
