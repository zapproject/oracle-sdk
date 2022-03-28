import { BigNumber, Contract, ethers, Signer } from "ethers";
import { zapAbi, zapTokenAbi } from "./contract/abi";
import { contractAddresses } from "./utils";

/** 
 * The Zap class binding for the Zap Oracle smart contract.
 * Exposes state changing functionalities including staking, mining, and disputing.
 */
class Zap {
    public readonly zap: Contract;
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
        this.zap = new Contract(
            contractAddresses(chainId).zapAddress,
            zapAbi,
            this.signer,
        ).attach(contractAddresses(this.chainId).zapMasterAddress);
        
    }

    /**
     * Approves the ZapMaster contract as the signer. This is required before and transfer of funds.
     * @param value - The amount to be approved
     * @returns The Promise bool of success
     */
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

    /**
     * Desposits the Oracle stake. Ensure the signer has the stake balance and approves the ZapMaster.
     * @returns The Promise transaction object
     */
    public stake = async () => {
        return this.zap.depositStake();
    }

    /**
     * Initiates the request for withdraw of the stake and Oracle rewards. Must wait 7 days until withdrawl can be made.
     * @returns The Promise transaction object
     */
    public requestWithdraw = async () => {
        return this.zap.requestStakingWithdraw();
    }

    /**
     * Withdraws the stake and Oracle rewards. Signer must have requested for withdraw 7 days prior.
     * @returns The Promise transaction object
     */
    public withdraw = async () => {
        return this.zap.withdrawStake();
    }

    /**
     * Add a tip to Request value within the Oracle
     * @param id - The ID of the request to add the tip to
     * @param value - The amount of tip to add
     * @returns The Promise transaction object
     */
    public addTip = async (id: number, value: number) => {
        const wei = ethers.utils.parseEther(value.toString());
        return this.zap.addTip(id, String(wei));
    }

    /**
     * Begins a new dispute of specified request, timestamp, and miner.
     * @param _requestId - The ID of the request to dispute
     * @param _timestamp - The timestamp of the request
     * @param _minerId - The index ID of the miner of block to dispute
     * @returns The Promise transaction object
     */
    public dispute = async(_requestId: string, _timestamp: string, _minerId: string) => {
        return this.zap.beginDispute(_requestId, _timestamp, _minerId);
    }

    /**
     * Votes for or against a dispute.
     * @param disputeId - The Id of the dispute to resolve
     * @param vote - The boolean vote value
     * @returns The Promise transaction object
     */
    public vote = async(disputeId: number, vote: boolean) => {
        return this.zap.vote(disputeId, vote);
    }

    /**
     * Tallies the votes made for a dispute
     * @param disputeId - The Id of the dispute to resolve
     * @returns The Promise transaction object
     */
    public tallyVotes = async(disputeId: number) => {
        return this.zap.tallyVotes(disputeId);
    }
}

export default Zap;