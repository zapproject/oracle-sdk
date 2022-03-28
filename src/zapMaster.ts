import {
  BigNumberish,
  Bytes,
  BytesLike,
  Contract,
  ethers,
  Signer,
} from "ethers";
import { zapMasterAbi } from "./contract/abi";
import { contractAddresses } from "./utils";

/** 
 * The ZapMaster class binding for the ZapMast Oracle smart contract.
 * Exposes all the getters concerning the Oracles.
 */
class ZapMaster {
  public readonly zapMaster: Contract;
  public readonly chainId: number;
  public readonly signer: Signer;

  /**
   * Constructor
   * @param chainId - The network chain ID Zap is associated with
   * @param signer - The signer of transactions
   */
  constructor(chainId: number, signer: Signer) {
    this.chainId = chainId;
    this.signer = signer;
    this.zapMaster = new Contract(
      contractAddresses(chainId).zapMasterAddress,
      zapMasterAbi,
      this.signer
    );
  }

  /**
   * Retreives the approval amount between specified addresses.
   * @param _user - The owner address of the token(s) approving
   * @param _spender - The spender address of the approved
   * @returns The Promise of the allowance amount
   */
  public allowance = async (_user: string, _spender: string) => {
    return this.zapMaster.allowance(_user, _spender);
  };

  /**
   * Retreives the balance of the specified address.
   * @param _address - The address to reference
   * @returns The Promise of the balance amount
   */
  public balanceOf = async (_address: string) => {
    return this.zapMaster.balanceOf(_address);
  };

  /**
   * Retreives whether the specified address has bid on the specified dispute.
   * @param _disputeId - The ID of the dispute to reference
   * @param _address - The address to reference
   * @returns The Promise of whether the specified address has voted
   */
  public didVote = async (_disputeId: BigNumberish, _address: string) => {
    return this.zapMaster.didVote(_disputeId, _address);
  };

  /**
   * Retreives the dispute variables of specified dispute as an array.
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the dispute variables array. [hash of dispute, voted, vote passed, reported miner, reporting party, proposedForkAddress, forkedContract, requestId, timestamp, value, minExecutionDate, numberOfVotes, blockNumber, minerSlot, quorum, fee]
   */
  public getAllDisputeVars = async (disputeId: BigNumberish) => {
    return this.zapMaster.getAllDisputeVars(disputeId);
  };

  /**
   * Retreives the current request variables as an array.
   * @returns The Promise of current request variables. [challenge, requestId, difficulty, api/query string, granularity, total tip for the request]
   */
  public getCurrentVariables = async () => {
    return this.zapMaster.getCurrentVariables();
  };

  /**
   * Retreives the count of values that have been submited for the specified request.
   * @param _requestId - The ID of the request to reference
   * @returns The Promise of the count
   */
  public getNewValueCountbyRequestId = async (_requestId: BigNumberish) => {
    return this.zapMaster.getNewValueCountbyRequestId(_requestId);
  };

  /**
   * Retreives the submissions of specified request and timestamp.
   * @param _requestId - The ID of the request to reference
   * @param _timestamp - The timestamp to reference
   * @returns The Promise of the submissions array [5]
   */
  public getSubmissionsByTimestamp = async (_requestId:BigNumberish, _timestamp: BigNumberish) => {
    return this.zapMaster.getSubmissionsByTimestamp(_requestId, _timestamp);
  };

  /**
   * Retreives the next request information on queue/request with highest payout
   * @returns The Promise of request information array [RequestId, Totaltips, and API query string]. 
   */
  public getVariablesOnDeck = async () => {
    return this.zapMaster.getVariablesOnDeck();
  }

  /**
   * Retreives the dispute ID with specified miner address, request, and timestamp.
   * @param miner - The miner address
   * @param requestID - The ID of the request to reference
   * @param timestamp - The timestamp to reference
   * @returns The Promise of the dispute ID
   */
  public getDisputeIdByDisputeHash = async (miner: BigNumberish, requestID: BigNumberish, timestamp: BigNumberish) => {
      const hash = ethers.utils.solidityKeccak256([ "address", "uint256", "uint256" ], [ miner, requestID, timestamp ]);
    return this.zapMaster.getDisputeIdByDisputeHash(hash);
  };

  /**
   * Retreives the uint variable for specified dispute and mapping key.
   * @param disputeID - The ID of the dispute to reference
   * @param key - The mapping key to retrieve
   * @returns The Promise of the uint variable
   */
  public getDisputeUintVars = (disputeID: BigNumberish, key: string) => {
    const _bytes: Uint8Array = ethers.utils.toUtf8Bytes(key);

    const _hash: string = ethers.utils.keccak256(_bytes);

    return this.zapMaster.getDisputeUintVars(disputeID, _hash);
  };

  /**
   * Retreives whether the set value of a block is in dispute.
   * @param requestID - The ID of the request to reference
   * @param timestamp - The timestamp to reference
   * @returns The Promise of whether the block is in dispute
   */
  public isInDispute = async (requestID: BigNumberish, timestamp: BigNumberish) => {
    return this.zapMaster.isInDispute(requestID, timestamp);
  };

  /**
   * Retreives a uint variable within the Oracle specified by the mapping key.
   * @param key - The mapping key
   * @returns The Promise of uint variable
   */
  public getUintVar = async (key: string) => {
    // Converts the uintVar "stakeAmount" to a bytes array
    const _bytes: Uint8Array = ethers.utils.toUtf8Bytes(key);

    // Converts the uintVar "stakeAmount" from a bytes array to a keccak256 hash
    const _hash: string = ethers.utils.keccak256(_bytes);

    return this.zapMaster.getUintVar(_hash);
  };

  /**
   * Retreives the request by the request Q index
   * @param _index - The Q index to reference
   * @returns The Promise of the request ID
   */
  public getRequestIdByRequestQIndex = async (_index: BigNumberish) => {
    return this.zapMaster.getRequestIdByRequestQIndex(_index);
  };

  /**
   * Retreives the request Q as an array.
   * @returns The Promise of the request Q array.
   */
  public getRequestQ = async () => {
    return this.zapMaster.getRequestQ();
  };

  /**
   * Retreives a request uint variable specified by the mapping key.
   * @param _requestId - The ID of the request to reference
   * @param _data - The mapping key
   * @returns The Promise of the request uint variable
   */
  public getRequestUintVars = async (
    _requestId: BigNumberish,
    _data: string
  ) => {
    let bytes = ethers.utils.toUtf8Bytes(_data);
    let data = ethers.utils.keccak256(bytes);
    return this.zapMaster.getRequestUintVars(_requestId, data);
  };

  /**
   * Retreives the request variables of specified request
   * @param _requestId - The ID of the request to reference
   * @returns The Promise of the request variables array. [query api, api syumbol, hash of string, granularity, requestQ index, tips]
   */
  public getRequestVars = async (_requestId: BigNumberish) => {
    return this.zapMaster.getRequestVars(_requestId);
  };

  /**
   * Retreives the timestamp of specified request and request timestamp index.
   * @param _requestId - The ID of the request to reference
   * @param _index - The index of the request timestamp
   * @returns The Promise of the timestamp
   */
  public getTimestampbyRequestIDandIndex = async (
    _requestId: BigNumberish,
    _index: BigNumberish
  ) => {
    return this.zapMaster.getTimestampbyRequestIDandIndex(_requestId, _index);
  };

  /**
   * Retreives the block data specified by the request and timestamp.
   * @param _requestId - The ID of the request to reference
   * @param _timestamp - The timestamp to reference
   * @returns The Promise of the block data
   */
  public retrieveData = async (
    _requestId: BigNumberish,
    _timestamp: BigNumberish
  ) => {
    return this.zapMaster.retrieveData(_requestId, _timestamp);
  };

  /**
   * Retreives the staker info of specified address.
   * @param _address - The address to reference
   * @returns The Promise of the staker info
   */
  public getStakerInfo = async (_address: string) => {
    return this.zapMaster.getStakerInfo(_address);
  };

  /**
   * Retreives the miners specified by request and timestamp.
   * @param requestID - The ID of the request to reference
   * @param timestamp - The timestamp to reference
   * @returns The Promise of the miners array
   */
  public getMinersByRequestIdAndTimestamp = async (requestID: BigNumberish, timestamp: BigNumberish) => {
    return this.zapMaster.getMinersByRequestIdAndTimestamp(requestID, timestamp);
  }
}

export default ZapMaster;
