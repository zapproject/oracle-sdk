import { BigNumber, Contract, ethers, Signer } from "ethers";
import { vaultAbi } from "./contract/abi";
import { contractAddresses } from "./utils";

/**
 * The Vault class binding for the Vauilt Oracle smart contract.
 */
export class Vault {
    private vault: Contract;
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
        this.vault = new Contract(
            contractAddresses(chainId).vaultAddress,
            vaultAbi,
            this.signer,
        );   
    }

    /**
     * Retreives the balance of specified address.
     * @param userAddress - The address to reference
     * @returns The Promise of the balance
     */
    public userBalance = async (userAddress: string) => {
        return this.vault.userBalance(userAddress);
    }
}

// export default Vault;