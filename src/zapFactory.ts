import { Contract, ethers, Signer } from "ethers";
import { zapMasterAbi } from "./contract/abi";
import { contractAddresses } from "./utils";

class ZapFactory {
  contract: Contract;
  networkId: number;
  signer: Signer;

  constructor(
    networkId: number, 
    signer: Signer
    ) {
      this.networkId = networkId;
      this.signer = signer;
      this.contract = new ethers.Contract(
        contractAddresses(networkId).zapMasterAddress,
        zapMasterAbi,
        signer,
      );
    }

    /**
     * Deploys Zap 
     * @param 
     */
    async deployZap(

    ): Promise<any> {
      const tx = await this.contract.deployZap(

      );
    }
}