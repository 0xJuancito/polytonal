export interface TxParam {
  name: string;
  type: string;
  indexed: boolean;
  decoded: boolean;
  value: string;
}

export interface TxDecoded {
  name: string;
  signature: string;
  params?: TxParam[];
}

export interface TxLogEvent {
  block_signed_at: Date;
  block_height: number;
  tx_offset: number;
  log_offset: number;
  tx_hash: string;
  raw_log_topics: string[];
  sender_contract_decimals?: number;
  sender_name: string;
  sender_contract_ticker_symbol: string;
  sender_address: string;
  sender_address_label?: any;
  sender_logo_url: string;
  raw_log_data: string;
  decoded?: TxDecoded;
}

export interface TxItem {
  block_signed_at: Date;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  from_address: string;
  from_address_label?: any;
  to_address: string;
  to_address_label?: any;
  value: string;
  value_quote: number;
  gas_offered: number;
  gas_spent: number;
  gas_price: any;
  fees_paid: string;
  gas_quote: number;
  gas_quote_rate: number;
  log_events: TxLogEvent[];
}

export interface TxPagination {
  has_more: boolean;
  page_number: number;
  page_size: number;
  total_count?: any;
}

export interface TxResponse {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: TxItem[];
  pagination: TxPagination;
}
