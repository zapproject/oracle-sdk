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

    public retrieveData = async (_requestId: BigNumberish, _timestamp: BigNumberish) => {
        return this.zapMaster.retrieveData(_requestId, _timestamp);
    }
}

export default ZapMaster;