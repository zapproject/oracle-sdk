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
export class ZapMaster {
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
      console.log("hash: ", hash)
    return this.zapMaster.getDisputeIdByDisputeHash(hash);
  };

  /**
   * Retreives the uint variable for specified dispute and mapping key.
   * @param disputeID - The ID of the dispute to reference
   * @param key - The mapping key to retrieve
   * @returns The Promise of the uint variable
   */
  public getDisputeUintVars = async (disputeID: BigNumberish, key: string) => {
    const _bytes: Uint8Array = ethers.utils.toUtf8Bytes(key);

    const _hash: string = ethers.utils.keccak256(_bytes);

    return this.zapMaster.getDisputeUintVars(disputeID, _hash);
  };

  /**
   * Retreives the request ID in reference to the specified dispute
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the request ID
   */
  public getDisputeRequestID = async (disputeId: BigNumberish) => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("requestId");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getDisputeUintVars(disputeId, _hash);
  }

  /**
   * Retreives the request timestamp in reference to the specified dispute
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the request timestamp
   */
  public getDisputeTimestamp = async (disputeId: BigNumberish) => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("timestamp");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getDisputeUintVars(disputeId, _hash);
  }

  /**
   * Retreives the dispute value in reference to the specified dispute
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the dispute value
   */
  public getDisputeValue = async (disputeId: BigNumberish) => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("value");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getDisputeUintVars(disputeId, _hash);
  }

  /**
   * Retreives the minimum execution date in reference to the specified dispute
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the minimum execution date
   */
  public getDisputeMinExecDate = async (disputeId: BigNumberish) => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("minExecutionDate");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getDisputeUintVars(disputeId, _hash);
  }

  /**
   * Retreives the number of votes in reference to the specified dispute
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the number of votes
   */
  public getDisputeNumVotes = async (disputeId: BigNumberish) => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("numberOfVotes");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getDisputeUintVars(disputeId, _hash);
  }

  /**
   * Retreives the block number in reference to the specified dispute
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the block number
   */
  public getDisputeBlockNumber= async (disputeId: BigNumberish) => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("blockNumber");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getDisputeUintVars(disputeId, _hash);
  }

  /**
   * Retreives the miner slot in reference to the specified dispute
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the miner slot
   */
  public getDisputeMinerSlot = async (disputeId: BigNumberish) => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("minerSlot");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getDisputeUintVars(disputeId, _hash);
  }

  /**
   * Retreives the quorum in reference to the specified dispute
   * @param disputeId - The ID of the dispute to reference
   * @returns The Promise of the quorum
   */
  public getDisputeQuorum = async (disputeId: BigNumberish) => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("quorum");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getDisputeUintVars(disputeId, _hash);
  }
  
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

  public getDecimals = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("decimals");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the dispute fee.
   * @returns The Promise of the dispute fee
   */
  public getDisputeFee = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("disputeFee");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the dispute count.
   * @returns The Promise of the dispute count
   */
   public getDisputeCount = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("disputeCount");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Gets the status of the disptue type
   * @returns String of the dispute type status. 1 = noraml dispute, 2 = Zap.sol change proposal, 3 = Vault.sol change proposal
   */

  public getDisputeType = async (disputeId: BigNumberish) => {
    const typeNum = await this.zapMaster.getAllDisputeVars(disputeId);
    console.log("Type",typeNum[6]);
    switch(String(typeNum[6])){
      case "0":
        return "Normal Dispute";
      case "1":
        return "Zap Contract Change";
      case "2":
        return "Zap Master Contract Change";
      case "3":
        return "Vault Contract Change";
      default:
        return "Unknown ID";
    }
  }

  /**
   * Retreives the stake amount
   * @returns The Promise of the stake amount
   */
   public getStakeAmount = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("stakeAmount");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the staker count.
   * @returns The Promise of the staker count
   */
   public getStakerCount = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("stakerCount");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the time of last new value. The time of last challenge solved.
   * @returns The Promise of the time of last new value
   */
   public getTimeOfLastNewValue = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("timeOfLastNewValue");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the difficulty. The difficulty of current block.
   * @returns The Promise of the difficulty
   */
   public getDifficulty = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("difficulty");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the current total tips. The value of highest api/timestamp payout pool.
   * @returns The Promise of the current total tips.
   */
   public getCurrentTotalTips = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("currentTotalTips");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the request ID.
   * @returns The Promise of the request ID
   */
   public getCurrentRequestId = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("currentRequestId");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the request count. The total number of requests through the system.
   * @returns The Promise of the request count
   */
   public getRequestCount = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("requestCount");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the slot progress. The number of miners who have mined this value so far.
   * @returns The Promise of the slot progress
   */
   public getSlotProgress = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("slotProgress");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the mining reward. The mining Reward given to all miners per value.
   * @returns The Promise of the mining reward
   */
   public getMiningReward = async () => {
    let _bytes: Uint8Array = ethers.utils.toUtf8Bytes("miningReward");
    let _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the time target. The time between blocks (mined Oracle values).
   * @returns The Promise of the time target
   */
   public getTimeTarget = async () => {
    const _bytes: Uint8Array = ethers.utils.toUtf8Bytes("timeTarget");
    const _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

  /**
   * Retreives the current mining reward. The last reward given to miners on creation of a new block.
   * @returns The Promise of the current mining reward
   */
   public getCurrentMiningReward = async () => {
    const _bytes: Uint8Array = ethers.utils.toUtf8Bytes("getCurrentMiningReward");
    const _hash: string = ethers.utils.keccak256(_bytes);
    return this.zapMaster.getUintVar(_hash);
  }

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
   * Retreives the granularity of specified request.
   * @param requestId - The ID of the request to reference
   * @returns The Promise of the granularity
   */
  public getRequestGranularity = async (requestId: BigNumberish) => {
    let bytes = ethers.utils.toUtf8Bytes("granularity");
    let data = ethers.utils.keccak256(bytes);
    return this.zapMaster.getRequestUintVars(requestId, data);
  }

  /**
   * Retreives the request Q position of specified request.
   * @param requestId - The ID of the request to reference
   * @returns The Promise of the request Q position
   */
  public getRequestQPosition = async (requestId: BigNumberish) => {
    let bytes = ethers.utils.toUtf8Bytes("requestQPosition");
    let data = ethers.utils.keccak256(bytes);
    return this.zapMaster.getRequestUintVars(requestId, data);
  }

  /**
   * Retreives the total tip of specified request.
   * @param requestId - The ID of the request to reference
   * @returns The Promise of the total tip
   */
  public getRequestTotalTip = async (requestId: BigNumberish) => {
    let bytes = ethers.utils.toUtf8Bytes("totalTip");
    let data = ethers.utils.keccak256(bytes);
    return this.zapMaster.getRequestUintVars(requestId, data);
  }

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

// export default ZapMaster;
