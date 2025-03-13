export interface Offer {
  key: number;
  id: number;
  seller: any;
  amount: string;
  pricePerUnit: string;
  isAvailable: any;
}





export interface OSSUploadResponse {
  callback: string;
  dir: string;
  expire: number;
  host: string;
  key: string;
  policy: string;
}

export interface NFTInfo {
  created_at: string;
  desc: string;
  owner: string;
  art_id: number;
  edition: number;
  minted: number;
  id: number;
  mime_type: string;
  oss_url: string;
  state: string;
  title: string;
  updated_at: string;
  ipfs_cid: string;
  ipfs_state: string;
}

export interface Edition {
  id: number;
  created_at: string;
  updated_at: string;
  nft_contract: string;
  fix_bid_contract: string;
  eng_bid_contract: string;
  token: number;
  owner: string;
  ipfs_cid: string;
  art_id: number;
  edition: number;
  state: string;
  latest_block: number;
  seller: string;
  auction_id: string;
  opening_bid: number;
  fixed_price: number;
  bidder: string;
  bid_price: number;
  bid_count: number;
}

export interface MarketArt {
  n_id: number;
  n_created_at: string;
  n_updated_at: string;
  n_user_id: number;
  n_user_name: string;
  n_art_id: number;
  n_ipfs_cid: string;
  n_owner: string;
  n_title: string;
  n_desc: string;
  n_state: string;
  n_mime_type: string;
  n_oss_url: string;
  e_id: number;
  e_created_at: string;
  e_updated_at: string;
  e_nft_contract: string;
  e_fix_bid_contract: string;
  e_eng_bid_contract: string;
  e_owner: string;
  e_ipfs_cid: string;
  e_art_id: number;
  e_edition: number;
  e_token: number;
  e_seller: string;
  e_auction_id: number;
  e_opening_bid: number;
  e_fixed_price: number;
  e_bidder: string;
  e_bid_price: number;
  e_bid_count: number;
  e_state: string;
  e_ether_net: string;
}

export interface BidLog {
  ether_net: string;
  block: number;
  auction_id: number;
  bidder: string;
  bid_price: number;
  bid_count: number;
  start_time: number;
  tx_hash: string;
  expiration_time: number;
  state: string;
}

export interface ArtworkUser {
  name: string;
  avatar?: string;
  address?: string;
}

export interface LastSale {
  eth_price?: any;
  usd_price?: number | string;
  sale_time?: string;
}

export interface ResList<T> {
  total: number;
  page: number;
  count: number;
  arts: T[];
}

export interface CollectionMarketItem {
  index?: number;
  name: string;
  desc: string;
  mime_type: "image/*" | "video/*";
  video: string;
  image: string;
  id?: number;
  is_owner?: number;
  nft_base_id?: number;
  token_id?: number | string;
  contract_address?: string;
  schema_name?: string;
  auction_id?: number;
  bid_type?: number;
  bid_status?: number;
  bid_start_price?: number | string;
  bid_increase_price?: number | string;
  bid_list_price?: any;
  bid_fixed_price?: any;
  bid_curr_price?: any;
  bid_start_time?: string;
  bid_end_time?: string;
  collector?: ArtworkUser;
  owner?: ArtworkUser;
  creator: ArtworkUser;
  last_sale?: LastSale;
}

export interface TradingList {
  from?: string;
  to?: string;
  price?: number;
  action?: string;
  time?: string;
}

export interface NftDetail extends CollectionMarketItem {
  trading_list: TradingList[];
  countdown_seconds?: number;
  eth_usd_price?: string | number;
  bid_curr_price?: string | number;
}
