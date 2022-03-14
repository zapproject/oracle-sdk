import { ethers } from 'ethers';

import * as abis from './contract/abi';

import * as bytecodes from './contract/bytecode';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

const signer = provider.getSigner(0);

let zapAddress: string;
let zapMasterAddress: string;

export const deployZapOracles = async () => {
  const oraclesFactory = new ethers.ContractFactory(
    abis.zapAbi,
    bytecodes.zapBytecode,
    signer,
  );

  const zapOracles = await oraclesFactory.deploy();

  await zapOracles.deployed();

  zapAddress = zapOracles.address;

  return zapOracles;
};

export const deployZapMaster = async () => {
  const masterFactory = new ethers.ContractFactory(
    abis.zapMasterAbi,
    bytecodes.zapMasterBytecode,
    signer,
  );

  let zapMaster = await masterFactory.deploy();

  await zapMaster.deployed();

  zapMaster.initializeVault(zapMasterAddress);

  zapMasterAddress = zapMaster.address;

  return zapMaster;
};

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
