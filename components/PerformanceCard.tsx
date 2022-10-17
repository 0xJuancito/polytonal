import styles from "@styles/PerformanceCard.module.css";

const PerformanceCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Performance</div>
      <div className={styles.card}></div>
    </div>
  );
};

export default PerformanceCard;
