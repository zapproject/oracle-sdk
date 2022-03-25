import { BigNumberish, Bytes, BytesLike, Contract, ethers, Signer } from "ethers";
import { zapMasterAbi } from "./contract/abi";
import { contractAddresses } from "./utils";

/** ZapMaster w/ ZapGetters */
class ZapMaster {
    public readonly zapMaster: Contract;
    public readonly chainId: number;
    public readonly signer: Signer;

    constructor(chainId: number, signer: Signer) {
        this.chainId = chainId;
        this.signer = signer;
        this.zapMaster = new Contract(
            contractAddresses(chainId).zapMasterAddress,
            zapMasterAbi,
            this.signer,
        );
    }

    public balanceOf = async (_address: string) => {
        return this.zapMaster.balanceOf(_address);
    }

    public getAllDisputeVars = async (disputeId: number) => {
        return await this.zapMaster.getAllDisputeVars(disputeId)
    }

    public getCurrentVariables = () => {

    }

    public getDisputeIdByDisputeHash = () => {
        
    }

    public getDisputeUintVars = () => {
        
    }

    public isInDispute = () => {

    }

    public getUintVar = async (key: string) => {
        // Converts the uintVar "stakeAmount" to a bytes array
        const _bytes: Uint8Array = ethers.utils.toUtf8Bytes(key);
      
        // Converts the uintVar "stakeAmount" from a bytes array to a keccak256 hash
        const _hash: string = ethers.utils.keccak256(_bytes);

        return await this.zapMaster.getUintVar(_hash)
    }
    public getRequestIdByRequestQIndex = async (_index: BigNumberish) => {
        return this.zapMaster.getRequestIdByRequestQIndex(_index);
    }

    public getRequestQ = async () => {
        return this.zapMaster.getRequestQ();
    }

    public getRequestUintVars = async (_requestId: BigNumberish, _data: string) => {
        let bytes = ethers.utils.toUtf8Bytes(_data);
        let data = ethers.utils.keccak256(bytes);
        return this.zapMaster.getRequestUintVars(_requestId, data);
    }

    public getRequestVars = async (_requestId: BigNumberish) => {
        return this.zapMaster.getRequestVars(_requestId);
    }

    public getTimestampbyRequestIDandIndex = async (_requestId: BigNumberish, _index: BigNumberish) => {
        return this.zapMaster.getTimestampbyRequestIDandIndex(_requestId, _index);
    }

    public retrieveData = async (_requestId: BigNumberish, _timestamp: BigNumberish) => {
        return this.zapMaster.retrieveData(_requestId, _timestamp);
    }

    public getStakerInfo = async (_address: string) => {
        return this.zapMaster.getStakerInfo(_address);
    }
}

export default ZapMaster;