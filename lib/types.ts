export type TxHrc20 = {
  symbol: string;
  amount: string;
  price: string;
};

export type TxNft = {
  name: string;
  imageUrl: string;
};

export type IHistoryTableTX = {
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
