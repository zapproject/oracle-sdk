import { Contract, ethers, Signer } from "ethers";
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

    public async stake(){
        return this.zapMaster.depositStake();
    }
}

export default ZapMaster;