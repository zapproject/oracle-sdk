import {
  zapAddresses,
  zapMasterAddresses,
} from "./contract/addresses";
import { DecimalValue, BidShares, MediaData, Ask, Bid } from "./types";
import invariant from "tiny-invariant";
import warning from "tiny-warning";

import { BigNumber, BigNumberish, BytesLike, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";



/**
 * Below functions are used in nft-sdk.
 * Address names were tweaked for current sdk.
 * We should adopt and/or create new util functions as needed.
 */
let zapAddress: string;

let zapMasterAddress: string;

/**
 * Returns the MediaFactory, ZapMarket, and ZapMedia contract addresses depending on the networkId.
 * @param {string} networkId- The numeric value that routes to a blockchain network.
 */
export const contractAddresses = (networkId: number): any => {
  if (networkId === 1337) {
    zapAddress = zapAddresses["1337"];
    zapMasterAddress = zapMasterAddresses["1337"];

    return {
      zapAddress,
      zapMasterAddress,
    };
  } else if (networkId === 4) {
    zapAddress = zapAddresses["4"];
    zapMasterAddress = zapMasterAddresses["4"];

    return {
      zapAddress,
      zapMasterAddress,
    };
  } else if (networkId === 97) {
    zapAddress = zapAddresses["97"];
    zapMasterAddress = zapMasterAddresses["97"];


    return {
      zapAddress,
      zapMasterAddress,
    };
  } else if (networkId === 1) {
    zapAddress = zapAddresses["1"];
    zapMasterAddress = zapMasterAddresses["1"];


    return {
      zapAddress,
      zapMasterAddress,
    };
  } else if (networkId === 56) {
    zapAddress = zapAddresses["56"];
    zapMasterAddress = zapMasterAddresses["56"];


    return {
      zapAddress,
      zapMasterAddress,
    };
  } else {
    invariant(false, "Constructor: Network Id is not supported.");
  }
};

export const validateBidShares = (
  collabShares: Array<DecimalValue>,
  creator: DecimalValue,
  owner: DecimalValue
) => {
  // Counter for collabShares sum
  let collabShareSum = BigNumber.from(0);

  // Converts 100 to a Decimal hexString value
  // The hexString value represents 100e18
  // BidShares must sum to 100 and this value is used to check against it
  const decimal100 = Decimal.new(100);

  // Converts 5 to a Decimal hexString value
  // The hexString value represents 5e18
  // The market fee is 5 percent of the bidShares
  const decimalMarketFee = Decimal.new(5);

  for (var i = 0; i < collabShares.length; i++) {
    collabShareSum = collabShareSum.add(
      BigInt(parseInt(collabShares[i].toString()))
    );
  }

  const sum = collabShareSum
    .add(creator.value)
    .add(owner.value)
    .add(decimalMarketFee.value);

  if (sum.toString() != decimal100.value.toString()) {
    invariant(
      false,
      `The BidShares sum to ${sum.toString()}, but they must sum to ${decimal100.value.toString()}`
    );
  }
};

/**
 * Constructs an Ask.
 *
 * @param currency
 * @param amount
 */
export function constructAsk(currency: string, amount: BigNumberish): Ask {
  return {
    currency: currency,
    amount: amount,
  };
}

/**
 * Constructs a Bid.
 *
 * @param currency
 * @param amount
 * @param bidder
 * @param recipient
 * @param sellOnShare
 */
export function constructBid(
  currency: string,
  amount: BigNumberish,
  bidder: string,
  recipient: string,
  sellOnShare: number
): Bid {
  let parsedCurrency: string;
  let parsedBidder: string;
  let parsedRecipient: string;

  try {
    parsedCurrency = validateAndParseAddress(currency);
  } catch (err: any) {
    throw new Error(`Currency address is invalid: ${err.message}`);
  }

  try {
    parsedBidder = validateAndParseAddress(bidder);
  } catch (err: any) {
    throw new Error(`Bidder address is invalid: ${err.message}`);
  }

  try {
    parsedRecipient = validateAndParseAddress(recipient);
  } catch (err: any) {
    throw new Error(`Recipient address is invalid: ${err.message}`);
  }

  const decimalSellOnShare = Decimal.new(parseFloat(sellOnShare.toFixed(4)));

  return {
    currency: parsedCurrency,
    amount: amount,
    bidder: parsedBidder,
    recipient: parsedRecipient,
    sellOnShare: decimalSellOnShare,
  };
}

/**
 * Decimal is a class to make it easy to go from Javascript / Typescript `number` | `string`
 * to ethers `BigDecimal` with the ability to customize precision
 */
export class Decimal {
  /**
   * Returns a `DecimalValue` type from the specified value and precision
   * @param value
   * @param precision
   */
  static new(value: number | string, precision: number = 18): any {
    invariant(
      precision % 1 == 0 && precision <= 18 && precision > -1,
      `${precision.toString()} must be a non-negative integer less than or equal to 18`
    );

    // if type of string, ensure it represents a floating point number or integer
    if (typeof value == "string") {
      invariant(
        value.match(/^[-+]?[0-9]*\.?[0-9]+$/),
        "value must represent a floating point number or integer"
      );
    } else {
      value = value.toString();
    }

    const decimalPlaces = Decimal.countDecimals(value);

    // require that the specified precision is at least as large as the number of decimal places of value
    invariant(
      precision >= decimalPlaces,
      `Precision: ${precision} must be greater than or equal the number of decimal places: ${decimalPlaces} in value: ${value}`
    );

    const difference = precision - decimalPlaces;
    const zeros = BigNumber.from(10).pow(difference);
    const abs = BigNumber.from(`${value.replace(".", "")}`);
    return { value: abs.mul(zeros) };
  }

  /**
   * Returns the number of decimals for value
   * @param value
   */
  private static countDecimals(value: string) {
    if (value.includes(".")) return value.split(".")[1].length || 0;
    return 0;
  }
}

/**
 * Constructs a MediaData type.
 *
 * @param tokenURI
 * @param metadataURI
 * @param contentHash
 * @param metadataHash
 */
export function constructMediaData(
  tokenURI: string,
  metadataURI: string,
  contentHash: BytesLike,
  metadataHash: BytesLike
): MediaData {
  // validate the hash to ensure it fits in bytes32
  //   validateBytes32(contentHash);
  //   validateBytes32(metadataHash);
  //   validateURI(tokenURI);
  //   validateURI(metadataURI);

  return {
    tokenURI: tokenURI,
    metadataURI: metadataURI,
    contentHash: contentHash,
    metadataHash: metadataHash,
  };
}

/**
 * Constructs a BidShares type.
 * Throws an error if the BidShares do not sum to 100 with 18 trailing decimals.
 *
 * @param creator
 * @param owner
 * @param prevOwner
 */
export function constructBidShares(
  collaborators: Array<string>,
  collabShares: Array<number>,
  creator: number,
  owner: number
): any {
  // Store the collabShares Decimal values
  let decimalCollabShares = [];

  for (var i = 0; i < collabShares.length; i++) {
    // Converts the collabShare integers to a Decimal hexString value
    // The hexString value represents a collabShare integer to the 18th
    decimalCollabShares.push(
      Decimal.new(parseFloat(collabShares[i].toFixed(4))).value
    );
  }

  // Converts the creator integer to a Decimal hexString value
  // The hexString value represents the creator integer to the 18th
  const decimalCreator = Decimal.new(parseFloat(creator.toFixed(4)));

  // Converts the owner integer to a Decimal hexString value
  // The hexString value represents the owner integer to the 18th
  const decimalOwner = Decimal.new(parseFloat(owner.toFixed(4)));

  validateBidShares(decimalCollabShares, decimalCreator, decimalOwner);
  return {
    collaborators: collaborators,
    collabShares: decimalCollabShares,
    creator: decimalCreator,
    owner: decimalOwner,
  };
}

/**
 * Validates the URI is prefixed with `https://`
 *
 * @param uri
 */
export function validateURI(uri: string) {
  if (!uri.match(/^https:\/\/(.*)/)) {
    invariant(false, `${uri} must begin with \`https://\``);
  }
}

/**
 * Validates and returns the checksummed address
 *
 * @param address
 */
export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = ethers.utils.getAddress(address);
    warning(address === checksummedAddress, `${address} is not checksummed.`);
    return checksummedAddress;
  } catch (error) {
    invariant(false, `${address} is not a valid address.`);
  }
}
