import { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import { BytesLike } from "ethers";
import { hexDataLength, hexlify, isHexString } from "ethers/lib/utils";
import invariant from "tiny-invariant";

export function getSigners(provider: JsonRpcProvider, num = 20) {
  const signers: JsonRpcSigner[] = [];
  for (let i = 0; i < num; i++) {
    signers.push(provider.getSigner(i));
  }
  return signers;
}

/**
 * Validates if the input is exactly 32 bytes
 * Expects a hex string with a 0x prefix or a Bytes type
 *
 * @param value
 */
export function validateBytes32(value: BytesLike) {
  if (typeof value == "string") {
    if (isHexString(value) && hexDataLength(value) == 32) {
      return;
    }

    invariant(false, `${value} is not a 0x prefixed 32 bytes hex string`);
  } else {
    if (hexDataLength(hexlify(value)) == 32) {
      return;
    }

    invariant(false, `value is not a length 32 byte array`);
  }
}