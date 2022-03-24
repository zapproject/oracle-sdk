import { BigNumberish, Contract, ethers, Signer } from "ethers";
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

    public getAllDisputeVars = async (disputeId: number) => {
        return await this.zapMaster.getAllDisputeVars(disputeId)
    }

    public getCurrentVariables = () => {

    }

    public getDisputeIdByDisputeHash = () => {
        
    }

    public getDisputeUintVars = () => {
        
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


}

export default ZapMaster;