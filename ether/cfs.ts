import { ethers } from "ethers";
import getConfig from "next/config";


const { publicRuntimeConfig } = getConfig();

export interface Agile {
  createArt(
    assistantsAddressList: string[],
    benefits: number[],
    totalEdition: number,
    uri: string,
    count: number
  ): any;
  addArt(artId: string, count: number): any;
  setApprovalForAll(address: string, approved: boolean): void;
  isApprovedForAll(address: string, operator: string): any;
  ownerOf(tokenId: string | number): any;
}

/** 英式拍卖参数 */
export interface FixedBidAuctionParam {
  /** NFT地址 */
  address: string;
  /** Token ID */
  tokenId: number;
  /** 起拍价 */
  openingBid: string;
  /** 一口价 */
  fixedPrice: string;
}
/** 英式拍卖，重拍参数 */
export interface FixedBidReAuctionParam {
  /** Token ID */
  auctionId: number;
  /** 起拍价 */
  openingBid: number;
  /** 一口价 */
  fixedPrice: number;
}

export interface SendCallable {
  send(opt: SendRequest): any;
}
export interface SendRequest {
  from: string;
  value: string;
}

export interface FixedBid {
  /** 上架 */
  auctionWrapped(param: FixedBidAuctionParam): void;
  auction(
    /** NFT地址 */ address: string,
    /** Token ID */
    tokenId: number,
    /** 起拍价 */
    openingBid: string,
    /** 一口价 */
    fixedPrice: string
  ): void;
  /** 拍卖 */
  bid(auctionId: string | number, value: { value: string }): SendCallable;
  /** 作品流拍重新上架（没有人拍卖或未到保留价） */
  reAuctionWrapped(param: FixedBidReAuctionParam): void;
  reAuction(
    /** Token ID */
    auctionId: number,
    /** 起拍价 */
    openingBid: number,
    /** 一口价 */
    fixedPrice: number
  ): void;
  /** 卖家取消拍卖，退回买家的币（没有人参与拍卖或未到保留价） */
  cancel(auctionId: number): void;
  /** 卖家主动结算 */
  sellingSettlementPrice(auctionId: number): void;
  /** 买家一口价 */
  fixedWithdraw(auctionId: number, value: { value: string }): SendCallable;
  /** 买家退款 */
  bidderReverse(auctionId: number): void;
}

// Create NFT Contract FunctionS
export const NFTCreateCFS: (
  provider: ethers.providers.Web3Provider,
  signer: ethers.providers.JsonRpcSigner
) => Agile = (provider, signer) => {
  const c = new ethers.Contract(
    publicRuntimeConfig.address_1,
    Contract.abi,
    provider
  ).connect(signer);

  return c.functions as unknown as Agile;
};

export const FixBidCFS: (
  provider: ethers.providers.Web3Provider,
  signer: ethers.providers.JsonRpcSigner
) => FixedBid = (provider, signer) => {
  const c = new ethers.Contract(
    publicRuntimeConfig.address_2,
    Contract.abi,
    provider
  ).connect(signer);

  const cfs = c.functions as unknown as FixedBid;
  return {
    ...cfs,
    auctionWrapped: (param: FixedBidAuctionParam) =>
      cfs.auction(
        param.address,
        param.tokenId,
        param.openingBid,
        param.fixedPrice
      ),
    reAuctionWrapped: (param: FixedBidReAuctionParam) =>
      cfs.reAuction(param.auctionId, param.openingBid, param.fixedPrice),
  } as FixedBid;
};
