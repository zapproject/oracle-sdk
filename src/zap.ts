import { BigNumber, Contract, ethers, Signer } from "ethers";
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
        ).attach(contractAddresses(this.chainId).zapMasterAddress);
        
    }

    // mine, stake request, stake withdraw

    public approveSpending = async (value: number) => {
        const tokenInstance = new Contract(
            contractAddresses(this.chainId).zapToken,
            zapTokenAbi,
            this.signer,
        );
        const wei = ethers.utils.parseEther(value.toString());
        const weiString = wei.toString();
        return tokenInstance.approve(contractAddresses(this.chainId).zapMasterAddress, weiString);
    }

    public stake = async () => {
        return this.zap.depositStake();
    }

    public requestWithdraw = async () => {
        return this.zap.requestStakingWithdraw();
    }

    public withdraw = async () => {
        return this.zap.withdrawStake();
    }

    public addTip = async (id: number, value: number) => {
        const wei = ethers.utils.parseEther(value.toString());
        return this.zap.addTip(id, String(wei));
    }

    public dispute = async(_requesteId: string, _timestamp: string, _minerId: string) => {
        return this.zap.beginDispute(_requesteId, _timestamp, _minerId);
    }

    public vote = async(disputId: number, vote: boolean) => {
        return this.zap.vote(disputId, vote);
    }
}

export default Zap;