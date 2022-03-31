Vault Class
===========

The Vault class binding for the Vauilt Oracle smart contract.

### Hierarchy

*   Vault

Index
-----

### Constructors

*   [constructor](#constructor)

### Properties

*   [chainId](#chainId)
*   [signer](#signer)

### Methods

*   [userBalance](#userBalance)

### Examples

*   [instantiation](#instantiation)


Constructors
------------

### constructor[](#constructor)

*   new Vault(chainId: number, signer: Signer): Vault

*   *   Defined in [vault.ts:18](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/vault.ts#L18)
    
    Constructor
    
    #### Parameters
    
    *   ##### chainId: number
        
        The network chain ID Zap is associated with
        
    *   ##### signer: Signer
        
        The signer of transactions
        
    
    #### Returns Vault
    

Properties
----------

### chainId[](#chainId)

chainId: number

*   Defined in [vault.ts:10](https://github.com/zapproject/oracle-sdk/blob/726c78c/src/vault.ts#L10)

### signer[](#signer)

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
    


Examples
--------

### Instantiation[](#instantiation)

For this example, we are using chainId 4 and a Rinkeby provider node. 
The chainId and provider node can be replaced with the other available chainId's supported by Zap.

```
// Requires dotenv to allow the reading of environment variables
require("dotenv").config();

// Rinkeby chainId
const rinkebyChainId = 4;

// Requires the Vault class
const { Vault } = require('@zapprotocol/oracle-sdk');

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

// Creates the Vault class instance on the Rinkeby testnet with the signer connected
const vault = new Vault(rinkebyChainId, signer);

const main = async () => {
    let tx = await vault.userBalance(signer.getAddress());
};

main();
```