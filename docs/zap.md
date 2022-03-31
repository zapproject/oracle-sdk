Zap Class
=========

The Zap class binding for the Zap Oracle smart contract. Exposes state changing functionalities including staking, mining, and disputing.

### Hierarchy

*   Zap

Index
-----

### Constructors

*   [constructor](#constructor)

### Properties

*   [chainId](#chainId)
*   [signer](#signer)

### Methods

*   [addTip](#addTip)
*   [approveSpending](#approveSpending)
*   [dispute](#dispute)
*   [requestWithdraw](#requestWithdraw)
*   [stake](#stake)
*   [tallyVotes](#tallyVotes)
*   [vote](#vote)
*   [withdraw](#withdraw)

Constructors
------------

### constructor[](#constructor)

*   new Zap(chainId: number, signer: Signer): [Zap]()

*   *   Defined in [zap.ts:19](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L19)
    
    Constructor
    
    #### Parameters
    
    *   ##### chainId: number
        
        The network chain ID Zap is associated with
        
    *   ##### signer: Signer
        
        The signer of transactions
        
    
    #### Returns Zap
    

Properties
----------

### Readonly chainId[](#chainId)

chainId: number

*   Defined in [zap.ts:11](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L11)

### Readonly signer[](#signer)

signer: Signer

*   Defined in [zap.ts:12](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L12)


Methods
-------

### addTip[](#addTip)

*   addTip(id: number, value: number): Promise<any\>

*   *   Defined in [zap.ts:76](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L76)
    
    Add a tip to Request value within the Oracle
    
    #### Parameters
    
    *   ##### id: number
        
        The ID of the request to add the tip to
        
    *   ##### value: number
        
        The amount of tip to add
        
    
    #### Returns Promise<any\>
    
    The Promise transaction object
    

### approveSpending[](#approveSpending)

*   approveSpending(value: number): Promise<any\>

*   *   Defined in [zap.ts:35](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L35)
    
    Approves the ZapMaster contract as the signer. This is required before and transfer of funds.
    
    #### Parameters
    
    *   ##### value: number
        
        The amount to be approved
        
    
    #### Returns Promise<any\>
    
    The Promise bool of success
    

### dispute[](#dispute)

*   dispute(\_requestId: string, \_timestamp: string, \_minerId: string): Promise<any\>

*   *   Defined in [zap.ts:88](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L88)
    
    Begins a new dispute of specified request, timestamp, and miner.
    
    #### Parameters
    
    *   ##### \_requestId: string
        
        The ID of the request to dispute
        
    *   ##### \_timestamp: string
        
        The timestamp of the request
        
    *   ##### \_minerId: string
        
        The index ID of the miner of block to dispute
        
    
    #### Returns Promise<any\>
    
    The Promise transaction object
    

### requestWithdraw[](#requestWithdraw)

*   requestWithdraw(): Promise<any\>

*   *   Defined in [zap.ts:58](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L58)
    
    Initiates the request for withdraw of the stake and Oracle rewards. Must wait 7 days until withdrawl can be made.
    
    #### Returns Promise<any\>
    
    The Promise transaction object
    

### stake[](#stake)

*   stake(): Promise<any\>

*   *   Defined in [zap.ts:50](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L50)
    
    Desposits the Oracle stake. Ensure the signer has the stake balance and approves the ZapMaster.
    
    #### Returns Promise<any\>
    
    The Promise transaction object
    

### tallyVotes[](#tallyVotes)

*   tallyVotes(disputeId: number): Promise<any\>

*   *   Defined in [zap.ts:107](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L107)
    
    Tallies the votes made for a dispute
    
    #### Parameters
    
    *   ##### disputeId: number
        
        The Id of the dispute to resolve
        
    
    #### Returns Promise<any\>
    
    The Promise transaction object
    

### vote[](#vote)

*   vote(disputeId: number, vote: boolean): Promise<any\>

*   *   Defined in [zap.ts:98](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L98)
    
    Votes for or against a dispute.
    
    #### Parameters
    
    *   ##### disputeId: number
        
        The Id of the dispute to resolve
        
    *   ##### vote: boolean
        
        The boolean vote value
        
    
    #### Returns Promise<any\>
    
    The Promise transaction object
    

### withdraw[](#withdraw)

*   withdraw(): Promise<any\>

*   *   Defined in [zap.ts:66](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/zap.ts#L66)
    
    Withdraws the stake and Oracle rewards. Signer must have requested for withdraw 7 days prior.
    
    #### Returns Promise<any\>
    
    The Promise transaction object
    