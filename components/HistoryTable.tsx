import styles from "@styles/HistoryTable.module.css";
import HistoryTableTx from "./HistoryTableTx";

const HistoryTable = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dayContainer}>
        <div className={styles.dateContainer}>
          <div className={styles.date}>September 1, 2022</div>
        </div>
        <HistoryTableTx></HistoryTableTx>
      </div>
    </div>
  );
};

export default HistoryTable;
