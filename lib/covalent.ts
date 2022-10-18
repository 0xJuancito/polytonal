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
  const fee = (item.gas_spent / 1000000).toString();
  const feePrice =
    item.gas_spent && item.gas_quote_rate
      ? ((item.gas_spent * item.gas_quote_rate) / 10000000).toFixed(4)
      : "";

  const datetime = item.block_signed_at.toString();

  const response: IHistoryTableTX = {
    action: "Contract Execution",
    datetime,
    fee,
    feePrice,
    hash: item.tx_hash,
    // nft?: TxNftString,
    recipient: {
      from: item.from_address,
      to: item.to_address,
      isContract: true,
    },
  };

  // hrc20
  const hrc20Log = item.log_events.find((log) => {
    if (!log.decoded) {
      return null;
    }

    const isTransfer = log.decoded.name === "Transfer";
    const toUser = log.decoded.params.some(
      (param) => param.name === "to" && param.value === address
    );
    return isTransfer && toUser;
  });
  if (hrc20Log) {
    const amount =
      hrc20Log.decoded.params.find((param) => param.name === "value")?.value ||
      "0";
    const bigAmount = utils.parseEther(amount).div(BigNumber.from(10).pow(27));
    const hrc20Symbol = hrc20Log.sender_contract_ticker_symbol;
    const hrc20Amount = bigAmount.toString();
    const hrc20Price = "";

    response.action = hrc20Log.decoded.name;

    response.hrc20 = {
      symbol: hrc20Symbol,
      amount: hrc20Amount,
      price: hrc20Price,
    };
  }

  // ONE
  if (!item.log_events.length && item.gas_spent === 21000) {
    const valueQuote = item.value_quote
      ? item.value_quote.toFixed(2).toString()
      : "";

    let amount: number | string =
      Number(item.value) / Number(utils.parseEther("1"));
    if (amount < 1) {
      amount = amount.toFixed(4);
    } else {
      amount = amount.toFixed(0);
    }

    response.hrc20 = {
      symbol: "ONE",
      amount: amount.toString(),
      price: valueQuote,
    };

    response.action = "Transfer";
    response.recipient.isContract = false;
  }

  return response;
};
