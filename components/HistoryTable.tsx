import styles from "@styles/HistoryTable.module.css";
import { IHistoryTableTX } from "@lib/types";
import HistoryTableTx from "./HistoryTableTx";
import { FC } from "react";

interface TxDay {
  date: string;
  txs: IHistoryTableTX[];
}

interface Props {
  txs: IHistoryTableTX[];
  walletAddress: string;
}

const HistoryTable: FC<Props> = ({ txs, walletAddress }) => {
  const formatDate = (datetime: Date) => {
    return datetime.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const txMap: Map<string, IHistoryTableTX[]> = new Map();
  txs.forEach((tx) => {
    const date = formatDate(new Date(tx.datetime));
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
            <HistoryTableTx
              tx={tx}
              walletAddress={walletAddress}
              key={id}
            ></HistoryTableTx>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HistoryTable;
