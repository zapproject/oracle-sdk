import { Contract, ethers, Signer } from "ethers";
import { zapAbi, zapTokenAbi } from "./contract/abi";
import { contractAddresses } from "./utils";

/** ZapMaster w/ ZapGetters */
class Zap {
    public readonly zap: Contract;
    public readonly chainId: number;
    public readonly signer: Signer;

    constructor(chainId: number, signer: Signer) {
        this.chainId = chainId;
        this.signer = signer;
        this.zap = new Contract(
            contractAddresses(chainId).zapAddress,
            zapAbi,
            this.signer,
        );
    }

    public approveSpending = async (value: number) => {
        const tokenInstance = new Contract(
            contractAddresses(this.chainId).zapToken,
            zapTokenAbi,
            this.signer,
        );
        const wei = ethers.utils.parseEther(value.toString());
        const weiString = wei.toString();
        return tokenInstance.approve(this.zap.address, weiString);
    }

    public stake = async () => {
        return this.zap.depositStake();
    }
}

export default Zap;