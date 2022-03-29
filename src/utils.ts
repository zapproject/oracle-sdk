import {
  zapAddresses,
  zapMasterAddresses,
  zapTokenAddresses,
  vaultAddresses
} from "./contract/addresses";
import invariant from "tiny-invariant";
// import { BigNumber } from "ethers";



/**
 * Below functions are used in nft-sdk.
 * Address names were tweaked for current sdk.
 * We should adopt and/or create new util functions as needed.
 */
let zapAddress: string;

let zapMasterAddress: string;

let zapToken: string;

let vaultAddress: string;

/**
 * Returns the MediaFactory, ZapMarket, and ZapMedia contract addresses depending on the networkId.
 * @param {string} networkId- The numeric value that routes to a blockchain network.
 */
export const contractAddresses = (networkId: number): any => {
  if (networkId === 1337) {
    zapAddress = zapAddresses["1337"];
    zapMasterAddress = zapMasterAddresses["1337"];
    zapToken = zapTokenAddresses["1337"];
    vaultAddress = vaultAddresses["1337"];

    return {
      zapAddress,
      zapMasterAddress,
      zapToken,
      vaultAddress
    };
  } else if (networkId === 4) {
    zapAddress = zapAddresses["4"];
    zapMasterAddress = zapMasterAddresses["4"];
    zapToken = zapTokenAddresses["4"];
    vaultAddress = vaultAddresses["4"];

    return {
      zapAddress,
      zapMasterAddress,
      zapToken,
      vaultAddress
    };
  } else if (networkId === 97) {
    zapAddress = zapAddresses["97"];
    zapMasterAddress = zapMasterAddresses["97"];
    zapToken = zapTokenAddresses["97"];
    vaultAddress = vaultAddresses["97"];

    return {
      zapAddress,
      zapMasterAddress,
      zapToken,
      vaultAddress
    };
  } else if (networkId === 1) {
    zapAddress = zapAddresses["1"];
    zapMasterAddress = zapMasterAddresses["1"];
    zapToken = zapTokenAddresses["1"];
    vaultAddress = vaultAddresses["1"];

    return {
      zapAddress,
      zapMasterAddress,
      zapToken,
      vaultAddress
    };
  } else if (networkId === 56) {
    zapAddress = zapAddresses["56"];
    zapMasterAddress = zapMasterAddresses["56"];
    zapToken = zapTokenAddresses["56"];
    vaultAddress = vaultAddresses["56"];

    return {
      zapAddress,
      zapMasterAddress,
      zapToken,
      vaultAddress
    };
  } else {
    invariant(false, "Constructor: Network Id is not supported.");
  }
};

// /**
//  * Decimal is a class to make it easy to go from Javascript / Typescript `number` | `string`
//  * to ethers `BigDecimal` with the ability to customize precision
//  */
// export class Decimal {
//   /**
//    * Returns a `DecimalValue` type from the specified value and precision
//    * @param value
//    * @param precision
//    */
//   static new(value: number | string, precision: number = 18): any {
//     invariant(
//       precision % 1 == 0 && precision <= 18 && precision > -1,
//       `${precision.toString()} must be a non-negative integer less than or equal to 18`
//     );

//     // if type of string, ensure it represents a floating point number or integer
//     if (typeof value == "string") {
//       invariant(
//         value.match(/^[-+]?[0-9]*\.?[0-9]+$/),
//         "value must represent a floating point number or integer"
//       );
//     } else {
//       value = value.toString();
//     }

//     const decimalPlaces = Decimal.countDecimals(value);

//     // require that the specified precision is at least as large as the number of decimal places of value
//     invariant(
//       precision >= decimalPlaces,
//       `Precision: ${precision} must be greater than or equal the number of decimal places: ${decimalPlaces} in value: ${value}`
//     );

//     const difference = precision - decimalPlaces;
//     const zeros = BigNumber.from(10).pow(difference);
//     const abs = BigNumber.from(`${value.replace(".", "")}`);
//     return { value: abs.mul(zeros) };
//   }

//   /**
//    * Returns the number of decimals for value
//    * @param value
//    */
//   private static countDecimals(value: string) {
//     if (value.includes(".")) return value.split(".")[1].length || 0;
//     return 0;
//   }
// }
