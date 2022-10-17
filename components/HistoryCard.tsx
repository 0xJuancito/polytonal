import styles from "@styles/HistoryCard.module.css";

const HistoryCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>History</div>
      <div className={styles.card}></div>
    </div>
  );
};

export default HistoryCard;
