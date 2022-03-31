ZapMaster Class
===============

The ZapMaster class binding for the ZapMast Oracle smart contract. Exposes all the getters concerning the Oracles.

### Hierarchy

*   ZapMaster

Index
-----

### Constructors

*   [constructor](ZapMaster.html#constructor)

### Properties

*   [chainId](ZapMaster.html#chainId)
*   [signer](ZapMaster.html#signer)

### Methods

*   [allowance](ZapMaster.html#allowance)
*   [balanceOf](ZapMaster.html#balanceOf)
*   [didVote](ZapMaster.html#didVote)
*   [getAllDisputeVars](ZapMaster.html#getAllDisputeVars)
*   [getCurrentMiningReward](ZapMaster.html#getCurrentMiningReward)
*   [getCurrentRequestId](ZapMaster.html#getCurrentRequestId)
*   [getCurrentTotalTips](ZapMaster.html#getCurrentTotalTips)
*   [getCurrentVariables](ZapMaster.html#getCurrentVariables)
*   [getDecimals](ZapMaster.html#getDecimals)
*   [getDifficulty](ZapMaster.html#getDifficulty)
*   [getDisputeBlockNumber](ZapMaster.html#getDisputeBlockNumber)
*   [getDisputeCount](ZapMaster.html#getDisputeCount)
*   [getDisputeFee](ZapMaster.html#getDisputeFee)
*   [getDisputeIdByDisputeHash](ZapMaster.html#getDisputeIdByDisputeHash)
*   [getDisputeMinExecDate](ZapMaster.html#getDisputeMinExecDate)
*   [getDisputeMinerSlot](ZapMaster.html#getDisputeMinerSlot)
*   [getDisputeNumVotes](ZapMaster.html#getDisputeNumVotes)
*   [getDisputeQuorum](ZapMaster.html#getDisputeQuorum)
*   [getDisputeRequestID](ZapMaster.html#getDisputeRequestID)
*   [getDisputeTimestamp](ZapMaster.html#getDisputeTimestamp)
*   [getDisputeUintVars](ZapMaster.html#getDisputeUintVars)
*   [getDisputeValue](ZapMaster.html#getDisputeValue)
*   [getMinersByRequestIdAndTimestamp](ZapMaster.html#getMinersByRequestIdAndTimestamp)
*   [getMiningReward](ZapMaster.html#getMiningReward)
*   [getNewValueCountbyRequestId](ZapMaster.html#getNewValueCountbyRequestId)
*   [getRequestCount](ZapMaster.html#getRequestCount)
*   [getRequestGranularity](ZapMaster.html#getRequestGranularity)
*   [getRequestIdByRequestQIndex](ZapMaster.html#getRequestIdByRequestQIndex)
*   [getRequestQ](ZapMaster.html#getRequestQ)
*   [getRequestQPosition](ZapMaster.html#getRequestQPosition)
*   [getRequestTotalTip](ZapMaster.html#getRequestTotalTip)
*   [getRequestUintVars](ZapMaster.html#getRequestUintVars)
*   [getRequestVars](ZapMaster.html#getRequestVars)
*   [getSlotProgress](ZapMaster.html#getSlotProgress)
*   [getStakeAmount](ZapMaster.html#getStakeAmount)
*   [getStakerCount](ZapMaster.html#getStakerCount)
*   [getStakerInfo](ZapMaster.html#getStakerInfo)
*   [getSubmissionsByTimestamp](ZapMaster.html#getSubmissionsByTimestamp)
*   [getTimeOfLastNewValue](ZapMaster.html#getTimeOfLastNewValue)
*   [getTimeTarget](ZapMaster.html#getTimeTarget)
*   [getTimestampbyRequestIDandIndex](ZapMaster.html#getTimestampbyRequestIDandIndex)
*   [getUintVar](ZapMaster.html#getUintVar)
*   [getVariablesOnDeck](ZapMaster.html#getVariablesOnDeck)
*   [isInDispute](ZapMaster.html#isInDispute)
*   [retrieveData](ZapMaster.html#retrieveData)

### Examples

*   [instantiation](#instantiation)


Constructors
------------

### constructor[](#constructor)

*   new ZapMaster(chainId: number, signer: Signer): [ZapMaster](ZapMaster.html)

*   *   Defined in [zapMaster.ts:26](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L26)
    
    Constructor
    
    #### Parameters
    
    *   ##### chainId: number
        
        The network chain ID Zap is associated with
        
    *   ##### signer: Signer
        
        The signer of transactions
        
    
    #### Returns [ZapMaster](ZapMaster.html)
    

Properties
----------

### chainId[](#chainId)

chainId: number

*   Defined in [zapMaster.ts:18](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L18)

### signer[](#signer)

signer: Signer

*   Defined in [zapMaster.ts:19](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L19)


Methods
-------

### allowance[](#allowance)

*   allowance(\_user: string, \_spender: string): Promise<any\>

*   *   Defined in [zapMaster.ts:42](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L42)
    
    Retreives the approval amount between specified addresses.
    
    #### Parameters
    
    *   ##### \_user: string
        
        The owner address of the token(s) approving
        
    *   ##### \_spender: string
        
        The spender address of the approved
        
    
    #### Returns Promise<any\>
    
    The Promise of the allowance amount
    

### balanceOf[](#balanceOf)

*   balanceOf(\_address: string): Promise<any\>

*   *   Defined in [zapMaster.ts:51](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L51)
    
    Retreives the balance of the specified address.
    
    #### Parameters
    
    *   ##### \_address: string
        
        The address to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the balance amount
    

### didVote[](#didVote)

*   didVote(\_disputeId: BigNumberish, \_address: string): Promise<any\>

*   *   Defined in [zapMaster.ts:61](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L61)
    
    Retreives whether the specified address has bid on the specified dispute.
    
    #### Parameters
    
    *   ##### \_disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    *   ##### \_address: string
        
        The address to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of whether the specified address has voted
    

### getAllDisputeVars[](#getAllDisputeVars)

*   getAllDisputeVars(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:70](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L70)
    
    Retreives the dispute variables of specified dispute as an array.
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the dispute variables array. \[hash of dispute, voted, vote passed, reported miner, reporting party, proposedForkAddress, forkedContract, requestId, timestamp, value, minExecutionDate, numberOfVotes, blockNumber, minerSlot, quorum, fee\]
    

### getCurrentMiningReward[](#getCurrentMiningReward)

*   getCurrentMiningReward(): Promise<any\>

*   *   Defined in [zapMaster.ts:378](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L378)
    
    Retreives the current mining reward. The last reward given to miners on creation of a new block.
    
    #### Returns Promise<any\>
    
    The Promise of the current mining reward
    

### getCurrentRequestId[](#getCurrentRequestId)

*   getCurrentRequestId(): Promise<any\>

*   *   Defined in [zapMaster.ts:328](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L328)
    
    Retreives the request ID.
    
    #### Returns Promise<any\>
    
    The Promise of the request ID
    

### getCurrentTotalTips[](#getCurrentTotalTips)

*   getCurrentTotalTips(): Promise<any\>

*   *   Defined in [zapMaster.ts:318](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L318)
    
    Retreives the current total tips. The value of highest api/timestamp payout pool.
    
    #### Returns Promise<any\>
    
    The Promise of the current total tips.
    

### getCurrentVariables[](#getCurrentVariables)

*   getCurrentVariables(): Promise<any\>

*   *   Defined in [zapMaster.ts:78](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L78)
    
    Retreives the current request variables as an array.
    
    #### Returns Promise<any\>
    
    The Promise of current request variables. \[challenge, requestId, difficulty, api/query string, granularity, total tip for the request\]
    

### getDecimals[](#getDecimals)

*   getDecimals(): Promise<any\>

*   *   Defined in [zapMaster.ts:248](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L248)
    
    #### Returns Promise<any\>
    

### getDifficulty[](#getDifficulty)

*   getDifficulty(): Promise<any\>

*   *   Defined in [zapMaster.ts:308](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L308)
    
    Retreives the difficulty. The difficulty of current block.
    
    #### Returns Promise<any\>
    
    The Promise of the difficulty
    

### getDisputeBlockNumber[](#getDisputeBlockNumber)

*   getDisputeBlockNumber(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:195](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L195)
    
    Retreives the block number in reference to the specified dispute
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the block number
    

### getDisputeCount[](#getDisputeCount)

*   getDisputeCount(): Promise<any\>

*   *   Defined in [zapMaster.ts:268](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L268)
    
    Retreives the dispute count.
    
    #### Returns Promise<any\>
    
    The Promise of the dispute count
    

### getDisputeFee[](#getDisputeFee)

*   getDisputeFee(): Promise<any\>

*   *   Defined in [zapMaster.ts:258](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L258)
    
    Retreives the dispute fee.
    
    #### Returns Promise<any\>
    
    The Promise of the dispute fee
    

### getDisputeIdByDisputeHash[](#getDisputeIdByDisputeHash)

*   getDisputeIdByDisputeHash(miner: BigNumberish, requestID: BigNumberish, timestamp: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:116](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L116)
    
    Retreives the dispute ID with specified miner address, request, and timestamp.
    
    #### Parameters
    
    *   ##### miner: BigNumberish
        
        The miner address
        
    *   ##### requestID: BigNumberish
        
        The ID of the request to reference
        
    *   ##### timestamp: BigNumberish
        
        The timestamp to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the dispute ID
    

### getDisputeMinExecDate[](#getDisputeMinExecDate)

*   getDisputeMinExecDate(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:173](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L173)
    
    Retreives the minimum execution date in reference to the specified dispute
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the minimum execution date
    

### getDisputeMinerSlot[](#getDisputeMinerSlot)

*   getDisputeMinerSlot(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:206](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L206)
    
    Retreives the miner slot in reference to the specified dispute
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the miner slot
    

### getDisputeNumVotes[](#getDisputeNumVotes)

*   getDisputeNumVotes(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:184](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L184)
    
    Retreives the number of votes in reference to the specified dispute
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the number of votes
    

### getDisputeQuorum[](#getDisputeQuorum)

*   getDisputeQuorum(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:217](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L217)
    
    Retreives the quorum in reference to the specified dispute
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the quorum
    

### getDisputeRequestID[](#getDisputeRequestID)

*   getDisputeRequestID(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:140](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L140)
    
    Retreives the request ID in reference to the specified dispute
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the request ID
    

### getDisputeTimestamp[](#getDisputeTimestamp)

*   getDisputeTimestamp(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:151](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L151)
    
    Retreives the request timestamp in reference to the specified dispute
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the request timestamp
    

### getDisputeUintVars[](#getDisputeUintVars)

*   getDisputeUintVars(disputeID: BigNumberish, key: string): Promise<any\>

*   *   Defined in [zapMaster.ts:127](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L127)
    
    Retreives the uint variable for specified dispute and mapping key.
    
    #### Parameters
    
    *   ##### disputeID: BigNumberish
        
        The ID of the dispute to reference
        
    *   ##### key: string
        
        The mapping key to retrieve
        
    
    #### Returns Promise<any\>
    
    The Promise of the uint variable
    

### getDisputeValue[](#getDisputeValue)

*   getDisputeValue(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:162](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L162)
    
    Retreives the dispute value in reference to the specified dispute
    
    #### Parameters
    
    *   ##### disputeId: BigNumberish
        
        The ID of the dispute to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the dispute value
    

### getMinersByRequestIdAndTimestamp[](#getMinersByRequestIdAndTimestamp)

*   getMinersByRequestIdAndTimestamp(requestID: BigNumberish, timestamp: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:499](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L499)
    
    Retreives the miners specified by request and timestamp.
    
    #### Parameters
    
    *   ##### requestID: BigNumberish
        
        The ID of the request to reference
        
    *   ##### timestamp: BigNumberish
        
        The timestamp to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the miners array
    

### getMiningReward[](#getMiningReward)

*   getMiningReward(): Promise<any\>

*   *   Defined in [zapMaster.ts:358](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L358)
    
    Retreives the mining reward. The mining Reward given to all miners per value.
    
    #### Returns Promise<any\>
    
    The Promise of the mining reward
    

### getNewValueCountbyRequestId[](#getNewValueCountbyRequestId)

*   getNewValueCountbyRequestId(\_requestId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:87](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L87)
    
    Retreives the count of values that have been submited for the specified request.
    
    #### Parameters
    
    *   ##### \_requestId: BigNumberish
        
        The ID of the request to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the count
    

### getRequestCount[](#getRequestCount)

*   getRequestCount(): Promise<any\>

*   *   Defined in [zapMaster.ts:338](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L338)
    
    Retreives the request count. The total number of requests through the system.
    
    #### Returns Promise<any\>
    
    The Promise of the request count
    

### getRequestGranularity[](#getRequestGranularity)

*   getRequestGranularity(requestId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:421](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L421)
    
    Retreives the granularity of specified request.
    
    #### Parameters
    
    *   ##### requestId: BigNumberish
        
        The ID of the request to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the granularity
    

### getRequestIdByRequestQIndex[](#getRequestIdByRequestQIndex)

*   getRequestIdByRequestQIndex(\_index: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:389](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L389)
    
    Retreives the request by the request Q index
    
    #### Parameters
    
    *   ##### \_index: BigNumberish
        
        The Q index to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the request ID
    

### getRequestQ[](#getRequestQ)

*   getRequestQ(): Promise<any\>

*   *   Defined in [zapMaster.ts:397](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L397)
    
    Retreives the request Q as an array.
    
    #### Returns Promise<any\>
    
    The Promise of the request Q array.
    

### getRequestQPosition[](#getRequestQPosition)

*   getRequestQPosition(requestId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:432](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L432)
    
    Retreives the request Q position of specified request.
    
    #### Parameters
    
    *   ##### requestId: BigNumberish
        
        The ID of the request to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the request Q position
    

### getRequestTotalTip[](#getRequestTotalTip)

*   getRequestTotalTip(requestId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:443](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L443)
    
    Retreives the total tip of specified request.
    
    #### Parameters
    
    *   ##### requestId: BigNumberish
        
        The ID of the request to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the total tip
    

### getRequestUintVars[](#getRequestUintVars)

*   getRequestUintVars(\_requestId: BigNumberish, \_data: string): Promise<any\>

*   *   Defined in [zapMaster.ts:407](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L407)
    
    Retreives a request uint variable specified by the mapping key.
    
    #### Parameters
    
    *   ##### \_requestId: BigNumberish
        
        The ID of the request to reference
        
    *   ##### \_data: string
        
        The mapping key
        
    
    #### Returns Promise<any\>
    
    The Promise of the request uint variable
    

### getRequestVars[](#getRequestVars)

*   getRequestVars(\_requestId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:454](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L454)
    
    Retreives the request variables of specified request
    
    #### Parameters
    
    *   ##### \_requestId: BigNumberish
        
        The ID of the request to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the request variables array. \[query api, api syumbol, hash of string, granularity, requestQ index, tips\]
    

### getSlotProgress[](#getSlotProgress)

*   getSlotProgress(): Promise<any\>

*   *   Defined in [zapMaster.ts:348](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L348)
    
    Retreives the slot progress. The number of miners who have mined this value so far.
    
    #### Returns Promise<any\>
    
    The Promise of the slot progress
    

### getStakeAmount[](#getStakeAmount)

*   getStakeAmount(): Promise<any\>

*   *   Defined in [zapMaster.ts:278](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L278)
    
    Retreives the stake amount
    
    #### Returns Promise<any\>
    
    The Promise of the stake amount
    

### getStakerCount[](#getStakerCount)

*   getStakerCount(): Promise<any\>

*   *   Defined in [zapMaster.ts:288](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L288)
    
    Retreives the staker count.
    
    #### Returns Promise<any\>
    
    The Promise of the staker count
    

### getStakerInfo[](#getStakerInfo)

*   getStakerInfo(\_address: string): Promise<any\>

*   *   Defined in [zapMaster.ts:489](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L489)
    
    Retreives the staker info of specified address.
    
    #### Parameters
    
    *   ##### \_address: string
        
        The address to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the staker info
    

### getSubmissionsByTimestamp[](#getSubmissionsByTimestamp)

*   getSubmissionsByTimestamp(\_requestId: BigNumberish, \_timestamp: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:97](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L97)
    
    Retreives the submissions of specified request and timestamp.
    
    #### Parameters
    
    *   ##### \_requestId: BigNumberish
        
        The ID of the request to reference
        
    *   ##### \_timestamp: BigNumberish
        
        The timestamp to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the submissions array \[5\]
    

### getTimeOfLastNewValue[](#getTimeOfLastNewValue)

*   getTimeOfLastNewValue(): Promise<any\>

*   *   Defined in [zapMaster.ts:298](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L298)
    
    Retreives the time of last new value. The time of last challenge solved.
    
    #### Returns Promise<any\>
    
    The Promise of the time of last new value
    

### getTimeTarget[](#getTimeTarget)

*   getTimeTarget(): Promise<any\>

*   *   Defined in [zapMaster.ts:368](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L368)
    
    Retreives the time target. The time between blocks (mined Oracle values).
    
    #### Returns Promise<any\>
    
    The Promise of the time target
    

### getTimestampbyRequestIDandIndex[](#getTimestampbyRequestIDandIndex)

*   getTimestampbyRequestIDandIndex(\_requestId: BigNumberish, \_index: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:464](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L464)
    
    Retreives the timestamp of specified request and request timestamp index.
    
    #### Parameters
    
    *   ##### \_requestId: BigNumberish
        
        The ID of the request to reference
        
    *   ##### \_index: BigNumberish
        
        The index of the request timestamp
        
    
    #### Returns Promise<any\>
    
    The Promise of the timestamp
    

### getUintVar[](#getUintVar)

*   getUintVar(key: string): Promise<any\>

*   *   Defined in [zapMaster.ts:238](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L238)
    
    Retreives a uint variable within the Oracle specified by the mapping key.
    
    #### Parameters
    
    *   ##### key: string
        
        The mapping key
        
    
    #### Returns Promise<any\>
    
    The Promise of uint variable
    

### getVariablesOnDeck[](#getVariablesOnDeck)

*   getVariablesOnDeck(): Promise<any\>

*   *   Defined in [zapMaster.ts:105](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L105)
    
    Retreives the next request information on queue/request with highest payout
    
    #### Returns Promise<any\>
    
    The Promise of request information array \[RequestId, Totaltips, and API query string\].
    

### isInDispute[](#isInDispute)

*   isInDispute(requestID: BigNumberish, timestamp: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:229](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L229)
    
    Retreives whether the set value of a block is in dispute.
    
    #### Parameters
    
    *   ##### requestID: BigNumberish
        
        The ID of the request to reference
        
    *   ##### timestamp: BigNumberish
        
        The timestamp to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of whether the block is in dispute
    

### retrieveData[](#retrieveData)

*   retrieveData(\_requestId: BigNumberish, \_timestamp: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:477](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L477)
    
    Retreives the block data specified by the request and timestamp.
    
    #### Parameters
    
    *   ##### \_requestId: BigNumberish
        
        The ID of the request to reference
        
    *   ##### \_timestamp: BigNumberish
        
        The timestamp to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the block data


### getDisputeType[](#getDisputeType)

*   getDisputeType(disputeId: BigNumberish): Promise<any\>

*   *   Defined in [zapMaster.ts:280](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zapMaster.ts#L280)

    Retreives the status of the dispute type

    #### Parameters

    *   ##### disputeId: BigNumberish

        The ID of the dispute to reference

    #### Returns Promise<any\>

    The Promise of the dispute type status.


Examples
--------

### instantiation[](#instantiation)

For this example, we are using chainId 4 and a Rinkeby provider node. 
The chainId and provider node can be replaced with the other available chainId's supported by Zap.

```
// Requires dotenv to allow the reading of environment variables
require("dotenv").config();

// Rinkeby chainId
const rinkebyChainId = 4;

// Requires the ZapMaster class
const { ZapMaster } = require('@zapprotocol/oracle-sdk');

// Requires the ethers.js library
const ethers = require("ethers");

// Infura Rinkeby URL
const testnetUrl = `https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`;

// Creates the instance for the Rinkeby testnet provider
const provider = new ethers.providers.JsonRpcProvider(
    testnetUrl,
    rinkebyChainId
);

// Creates the signer instance with the users private key and provider
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Creates the ZapMaster class instance on the Rinkeby testnet with the signer connected
const zapMaster = new ZapMaster(rinkebyChainId, signer);

const main = async () => {
    let tx = await zapMaster.balanceOf(signer.getAddress());
};

main();
```