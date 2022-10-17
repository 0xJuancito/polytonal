import styles from "@styles/AssetsCard.module.css";

const AssetsCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Assets</div>
      <div className={styles.card}></div>
    </div>
  );
};

export default AssetsCard;
