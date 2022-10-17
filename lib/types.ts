export type TxErc20 = {
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
  datetime: Date;
  fee: string;
  hash: string;
  erc20?: TxErc20;
  nft?: TxNft;
  recipient: {
    from: string;
    to: string;
    isContract: boolean;
  };
};
