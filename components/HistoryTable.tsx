import styles from "@styles/HistoryTable.module.css";
import { IHistoryTableTX } from "@lib/types";
import HistoryTableTx from "./HistoryTableTx";

const tx: IHistoryTableTX = {
  action: "send",
  datetime: new Date("2022-10-17T13:24:08.049Z"),
  fee: "0.00037 ETH ($0.56)",
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
};

const HistoryTable = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dayContainer}>
        <div className={styles.dateContainer}>
          <div className={styles.date}>September 1, 2022</div>
        </div>
        <HistoryTableTx tx={tx}></HistoryTableTx>
      </div>
    </div>
  );
};

export default HistoryTable;
