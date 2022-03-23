import { BigNumber, Contract, ethers, Signer } from "ethers";
import { vaultAbi } from "./contract/abi";
import { contractAddresses } from "./utils";

class Vault {
    public readonly vault: Contract;
    public readonly chainId: number;
    public readonly signer: Signer;

    constructor(chainId: number, signer: Signer) {
        this.chainId = chainId;
        this.signer = signer;
        this.vault = new Contract(
            contractAddresses(chainId).vaultAddress,
            vaultAbi,
            this.signer,
        );   
    }

    public userBalance = async (userAddress: string) => {
        return this.vault.userBalance(userAddress);
    }
}

export default Vault;