import { IHistoryTableTX } from "./types";
import { utils, BigNumber } from "ethers";
import { TxItem, TxResponse } from "./covalent.types";
import { INFT, IToken } from "@pages/address/[address]/overview";
import { BalancesResponse } from "./covalent-balance.types";

const APIKEY = process.env.COVALENT_API_KEY;
const baseURL = "https://api.covalenthq.com/v1";
const chainId = "1666600000";

const sameAddress = (addr1: string, addr2: string) => {
  return addr1.toLowerCase() === addr2.toLowerCase();
};

export interface IHistoryTableResponse {
  wallet: string;
  txs: IHistoryTableTX[];
  tokens: IToken[];
  nfts: INFT[];
}

const getBalances = async (
  address: string,
  action: string
): Promise<{ tokens: IToken[]; nfts: INFT[] }> => {
  let newTokens = [] as IToken[];
  let newNfts = [] as INFT[];

  const qsCurrency = `quote-currency=USD`;
  const qsFormat = `format=JSON`;
  const nft = action === "nfts" ? `nft=true` : `nft=false`;
  const noNftFetch = `no-nft-fetch=false`;

  const qs = `${qsCurrency}&${qsFormat}&${nft}&${noNftFetch}&key=${APIKEY}`;
  const url = new URL(
    `${baseURL}/${chainId}/address/${address}/balances_v2/?${qs}`
  );

  const response = await fetch(url);
  const result = (await response.json()) as BalancesResponse;

  if (action === "tokens") {
    newTokens = result.data?.items
      .filter((item) => item.type === "cryptocurrency")
      .map((item) => {
        let balance: number | string =
          Number(item.balance) / Math.pow(10, item.contract_decimals);
        if (balance < 10) {
          balance = balance.toFixed(4);
        } else {
          balance = balance.toFixed(0);
        }

        return {
          icon: "",
          symbol: item.contract_ticker_symbol,
          price: item.quote_rate?.toString() || "N/A",
          balance: balance as string,
          value: item.quote?.toFixed(2) || "N/A",
        };
      });
  }

  result.data?.items.forEach((item) => {
    if (item.type !== "nft" && !item.nft_data) {
      return;
    }

    item.nft_data.forEach((nft) => {
      newNfts.push({
        image: nft.external_data?.image,
        collection: item.contract_name,
        name: nft.external_data?.name,
      });
    });
  });

  return {
    tokens: newTokens?.filter((token) => token) || [],
    nfts: newNfts?.filter((nft) => nft) || [],
  };
};

const findTxs = async (address: string): Promise<IHistoryTableTX[]> => {
  const pageNumber = 0;
  const pageSize = 200;
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
  return txHistory.filter((tx) => tx) as IHistoryTableTX[];
};

export const getTxs = async (
  address: string,
  action: string
): Promise<IHistoryTableResponse> => {
  let txs = [] as any;
  let tokens = [] as any;
  let nfts = [] as any;

  if (action === "txs") {
    txs = await findTxs(address);
  }
  if (action === "nfts") {
    nfts = (await getBalances(address, "nfts")).nfts;
  }
  if (action === "tokens") {
    tokens = (await getBalances(address, "tokens")).tokens;
  }

  return {
    wallet: txs[0]?.address || address,
    txs,
    tokens: tokens,
    nfts: nfts,
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

  // Action
  if (response.action === "Contract Execution") {
    const action = item.log_events
      .map((event) => event.decoded)
      .find((decoded) => decoded?.name && decoded?.name !== "Transfer")?.name;
    if (action) {
      response.action = action;
    }
  }

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

    response.recipient.from = fromUser;
    response.recipient.to = toUser;
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

    response.recipient.from = fromUser;
    response.recipient.to = toUser;
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

  // Fallback
  if (
    sameAddress(item.from_address, address) &&
    item.log_events.some((event) => event.decoded?.name === "Transfer") &&
    item.log_events.some(
      (event) =>
        event.decoded?.name &&
        event.decoded?.name !== "Transfer" &&
        event.decoded?.name !== "Approval"
    )
  ) {
    response.recipient.from = item.from_address;
    response.recipient.to = item.to_address;
    response.recipient.isContract = true;
    response.action = "Contract Execution";
    delete response.hrc20;
    delete response.nft;

    if (item.log_events.some((event) => event.decoded?.name === "Swap")) {
      response.action = "Swap";
    }
  }

  response.address = response.address.toLowerCase();
  response.recipient.from = response.recipient.from.toLowerCase();
  response.recipient.to = response.recipient.to.toLowerCase();

  return response;
};
