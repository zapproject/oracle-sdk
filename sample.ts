import { address } from "./config.json";
import { ethers, Signer, Wallet } from "ethers";
import { Zap, ZapMaster, Vault } from "./src/index";


const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
let wallet = new Wallet(address, provider);

let zapMaster = new ZapMaster(97, wallet);
let zap = new Zap(97, wallet);

async function main(){
    let balance = await zapMaster.balanceOf(wallet.address);
    console.log(String(balance));

    let gasPrice = await provider.getGasPrice();
    console.log("gas price: ", gasPrice.toNumber());

    let latestBlock = await provider.getBlock("latest");
    console.log("gas limit: ", latestBlock.gasLimit.toNumber())

    let tx1 = await zap.approveSpending(500000);

    console.log(tx1)

    let tx = await zap.stake();

    console.log(tx)

    let stakerStatus = await zapMaster.getStakerInfo(wallet.address);
    console.log(String(stakerStatus))
}

main();