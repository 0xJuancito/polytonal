import styles from "@styles/TabSelector.module.css";

const TabSelector = () => {
  return (
    <div className={styles.container}>
      <div className={styles.selected}>Tokens</div>
      <div className={styles.tab}>NFTs</div>
      <div className={styles.tab}>History</div>
    </div>
  );
};

export default TabSelector;
