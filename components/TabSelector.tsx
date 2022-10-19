import styles from "@styles/TabSelector.module.css";

const TabSelector = () => {
  return (
    <div className={styles.container}>
      <div className={styles.selected}>History</div>
      <div className={styles.tab}>Tokens</div>
      <div className={styles.tab}>NFTs</div>
    </div>
  );
};

export default TabSelector;
