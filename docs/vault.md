Vault Class
===========

The Vault class binding for the Vauilt Oracle smart contract.

### Hierarchy

*   Vault

Index
-----

### Constructors

*   [constructor](Vault.html#constructor)

### Properties

*   [chainId](Vault.html#chainId)
*   [signer](Vault.html#signer)

### Methods

*   [userBalance](Vault.html#userBalance)

Constructors
------------

### constructor[](#constructor)

*   new Vault(chainId: number, signer: Signer): [Vault](Vault.html)

*   *   Defined in [vault.ts:18](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/vault.ts#L18)
    
    Constructor
    
    #### Parameters
    
    *   ##### chainId: number
        
        The network chain ID Zap is associated with
        
    *   ##### signer: Signer
        
        The signer of transactions
        
    
    #### Returns [Vault](Vault.html)
    

Properties
----------

### Readonly chainId[](#chainId)

chainId: number

*   Defined in [vault.ts:10](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/vault.ts#L10)

### Readonly signer[](#signer)

signer: Signer

*   Defined in [vault.ts:11](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/vault.ts#L11)


Methods
-------

### userBalance[](#userBalance)

*   userBalance(userAddress: string): Promise<any\>

*   *   Defined in [vault.ts:33](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/vault.ts#L33)
    
    Retreives the balance of specified address.
    
    #### Parameters
    
    *   ##### userAddress: string
        
        The address to reference
        
    
    #### Returns Promise<any\>
    
    The Promise of the balance
    