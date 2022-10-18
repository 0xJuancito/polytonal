import { IHistoryTableTX } from "./types";
import { utils, BigNumber } from "ethers";
import { TxItem, TxResponse } from "./covalent.types";

const APIKEY = process.env.COVALENT_API_KEY;
const baseURL = "https://api.covalenthq.com/v1";
const chainId = "1666600000";

export const getTxs = async (
  address: string,
  pageNumber = 0,
  pageSize = 100
): Promise<IHistoryTableTX[]> => {
  const qsCurrency = `quote-currency=USD`;
  const qsFormat = `format=JSON`;
  const qsOrder = `block-signed-at-asc=false`;
  const qsLogs = `no-logs=false`;
  const qsPageNumber = `page-number=${pageNumber}`;
  const qsPageSize = `page-size=${pageSize}`;

  const qs = `${qsCurrency}&${qsFormat}&${qsOrder}&${qsLogs}&${qsPageNumber}&${qsPageSize}&key=${APIKEY}`;
  const url = new URL(
    `${baseURL}/${chainId}/address/${address}/transactions_v2/?${qs}`
  );

  const response = await fetch(url);
  const result = await response.json();
  const data = result.data as TxResponse;

  const txHistory = data.items.map((item) => parseTx(item, address));

  return txHistory.filter((tx) => tx) as IHistoryTableTX[];
};

const parseTx = (item: TxItem, address: string): IHistoryTableTX | null => {
  const log = item.log_events.find((log) => {
    const isTransfer = log.decoded.name === "Transfer";
    const toUser = log.decoded.params.some(
      (param) => param.name === "to" && param.value === address
    );
    return isTransfer && toUser;
  });

  if (!log) {
    return null;
  }

  const amount =
    log.decoded.params.find((param) => param.name === "value")?.value || "0";
  const bigAmount = utils.parseEther(amount).div(BigNumber.from(10).pow(27));

  return {
    action: log.decoded.name,
    datetime: item.block_signed_at.toString(),
    fee: (item.gas_spent / 1000000).toString(),
    feePrice: ((item.gas_spent * item.gas_quote_rate) / 1000000).toFixed(3),
    hash: item.tx_hash,
    erc20: {
      symbol: log.sender_contract_ticker_symbol,
      amount: bigAmount.toString(),
      price: "N/A",
    },
    // nft?: TxNftString,
    recipient: {
      from: item.from_address,
      to: address,
      isContract: false,
    },
  };
};
