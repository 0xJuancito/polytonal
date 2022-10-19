export type TxHrc20 = {
  symbol: string;
  amount: string;
  price: string;
};

export type TxNft = {
  tokenId: string;
  contractAddress: string;
  collectionName: string;
};

export type IHistoryTableTX = {
  address: string;
  action: string;
  datetime: string;
  fee: string;
  feePrice: string;
  hash: string;
  hrc20?: TxHrc20;
  nft?: TxNft;
  recipient: {
    from: string;
    to: string;
    isContract: boolean;
  };
};
