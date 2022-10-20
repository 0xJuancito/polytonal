export interface Attribute {
  trait_type: string;
  value: string;
}

export interface ExternalData {
  name: string;
  description: string;
  image: string;
  image_256: string;
  image_512: string;
  image_1024: string;
  animation_url?: any;
  external_url?: any;
  attributes: Attribute[];
  owner?: any;
}

export interface NftData {
  token_id: string;
  token_balance: string;
  token_url: string;
  supports_erc: string[];
  token_price_wei?: any;
  token_quote_rate_eth?: any;
  original_owner: string;
  external_data: ExternalData;
  owner: string;
  owner_address?: any;
  burned?: any;
}

export interface Item {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
  last_transferred_at?: Date;
  native_token: boolean;
  type: string;
  balance: string;
  balance_24h: string;
  quote_rate?: number;
  quote_rate_24h?: number;
  quote: number;
  quote_24h?: number;
  nft_data: NftData[];
}

export interface Data {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: Item[];
  pagination?: any;
}

export interface BalancesResponse {
  data: Data;
  error: boolean;
  error_message?: any;
  error_code?: any;
}
