import { IHistoryTableTX } from "./types";
import { utils, BigNumber } from "ethers";
import { TxItem, TxResponse } from "./covalent.types";

const APIKEY = process.env.COVALENT_API_KEY;
const baseURL = "https://api.covalenthq.com/v1";
const chainId = "1666600000";

const sameAddress = (addr1: string, addr2: string) => {
  return addr1.toLowerCase() === addr2.toLowerCase();
};

export interface IHistoryTableResponse {
  wallet: string;
  txs: IHistoryTableTX[];
}

export const getTxs = async (
  address: string,
  pageNumber = 0,
  pageSize = 20
): Promise<IHistoryTableResponse> => {
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

  const txHistory = data.items.map((item) => parseTx(item, data.address));

  return {
    wallet: data.address,
    txs: txHistory.filter((tx) => tx) as IHistoryTableTX[],
  };
};

const parseTx = (item: TxItem, address: string): IHistoryTableTX | null => {
  const fee = (item.gas_spent / 1000000).toString();
  const feePrice =
    item.gas_spent && item.gas_quote_rate
      ? ((item.gas_spent * item.gas_quote_rate) / 10000000).toFixed(5)
      : "";

  const datetime = item.block_signed_at.toString();

  const response: IHistoryTableTX = {
    address,
    action: "Contract Execution",
    datetime,
    fee,
    feePrice,
    hash: item.tx_hash,
    recipient: {
      from: item.from_address,
      to: item.to_address,
      isContract: true,
    },
  };

  // hrc20
  const hrc20Log = item.log_events.find((log) => {
    if (!log.decoded?.params) {
      return null;
    }

    const isTransfer = log.decoded.name === "Transfer";
    const toUser = log.decoded.params.some(
      (param) =>
        (param.name === "to" && sameAddress(param.value, address)) ||
        (param.name === "from" && sameAddress(param.value, address))
    );
    const isValue = log.decoded.params.some((param) => param.name === "value");
    return isTransfer && toUser && isValue;
  });
  if (hrc20Log?.decoded?.params) {
    const fromUser =
      hrc20Log.decoded.params.find((param) => param.name === "from")?.value ||
      "";

    const toUser =
      hrc20Log.decoded.params.find((param) => param.name === "to")?.value || "";

    const amount =
      hrc20Log.decoded.params.find((param) => param.name === "value")?.value ||
      "0";
    const decimals = hrc20Log.sender_contract_decimals || 1;

    let bigAmount: number | string = Number(amount) / Math.pow(10, decimals);
    if (bigAmount < 10) {
      bigAmount = bigAmount.toFixed(3);
    } else {
      bigAmount = bigAmount.toFixed(0);
    }

    const hrc20Amount = bigAmount.toString();
    const hrc20Symbol = hrc20Log.sender_contract_ticker_symbol;
    const hrc20Price = "";

    response.action = "Transfer";
    response.recipient.isContract = false;
    response.hrc20 = {
      symbol: hrc20Symbol,
      amount: hrc20Amount,
      price: hrc20Price,
    };

    if (response.recipient.from !== address) {
      response.recipient.from = fromUser;
    }
    if (response.recipient.to !== address) {
      response.recipient.to = toUser;
    }
  }

  // nft
  const nftLog = item.log_events.find((log) => {
    if (!log.decoded?.params) {
      return null;
    }

    const isTransfer = log.decoded.name === "Transfer";
    const toUser = log.decoded.params.some(
      (param) =>
        (param.name === "to" && sameAddress(param.value, address)) ||
        (param.name === "from" && sameAddress(param.value, address))
    );
    const isNft = log.decoded.params.some((param) => param.name === "tokenId");

    return isTransfer && toUser && isNft;
  });

  if (nftLog?.decoded?.params) {
    const fromUser =
      nftLog.decoded.params.find((param) => param.name === "from")?.value || "";

    const toUser =
      nftLog.decoded.params.find((param) => param.name === "to")?.value || "";

    const tokenId =
      nftLog.decoded.params.find((param) => param.name === "tokenId")?.value ||
      "";

    const contractAddress = nftLog.sender_address;
    const collectionName = nftLog.sender_name;

    response.action = "Transfer";
    response.nft = {
      tokenId,
      contractAddress,
      collectionName,
    };
    response.recipient.isContract = false;

    if (response.recipient.from !== address) {
      response.recipient.from = fromUser;
    }
    if (response.recipient.to !== address) {
      response.recipient.to = toUser;
    }
  }

  // ONE
  if (!item.log_events.length && item.gas_spent === 21000) {
    const valueQuote = item.value_quote
      ? item.value_quote.toFixed(2).toString()
      : "";

    let amount: number | string =
      Number(item.value) / Number(utils.parseEther("1"));
    if (amount < 10) {
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

  // Action
  if (response.action === "Contract Execution") {
    const action = item.log_events
      .map((event) => event.decoded)
      .find((decoded) => decoded?.name)?.name;
    if (action) {
      response.action = action;
    }
  }

  return response;
};
