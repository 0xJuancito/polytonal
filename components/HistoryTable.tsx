import styles from "@styles/HistoryTable.module.css";
import { IHistoryTableTX } from "@lib/types";
import HistoryTableTx from "./HistoryTableTx";

interface TxDay {
  date: string;
  txs: IHistoryTableTX[];
}

const txs: IHistoryTableTX[] = [
  {
    action: "send",
    datetime: new Date("2022-10-17T13:24:08.049Z"),
    fee: "0.00037",
    hash: "0xfbd4a7bf4d3757a17b313a00d4658306b19397d3d05f11c2292d244dd99b4691",
    erc20: {
      symbol: "USDC",
      amount: "250",
      price: "250.31",
    },
    recipient: {
      from: "one1xgufxsckyw8thksllv3fajdr00mxc4ty0zaaka",
      to: "one1pyw0epwjug93zrxh2nrvgy9x0jf9c40dw6dqy4",
      isContract: false,
    },
  },
];

const HistoryTable = () => {
  const formatDate = (datetime: Date) => {
    return datetime.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const txMap: Map<string, IHistoryTableTX[]> = new Map();
  txs.forEach((tx) => {
    const date = formatDate(tx.datetime);
    const mapTxs = txMap.get(date) || [];
    txMap.set(date, [...mapTxs, tx]);
  });

  const txDays: TxDay[] = [];
  txMap.forEach((txs, date) => {
    txDays.push({
      date,
      txs,
    });
  });

  return (
    <div className={styles.container}>
      {txDays.map((txDay, id) => (
        <div className={styles.dayContainer} key={id}>
          <div className={styles.dateContainer}>
            <div className={styles.date}>{txDay.date}</div>
          </div>
          {txDay.txs.map((tx, id) => (
            <HistoryTableTx tx={tx} key={id}></HistoryTableTx>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HistoryTable;
