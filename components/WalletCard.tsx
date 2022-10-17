import styles from "@styles/WalletCard.module.css";
import Image from "next/image";

const WalletCard = () => {
  return (
    <div className={styles.container}>
      <Image
        height="104"
        width="104"
        src={"/profile.png"}
        alt="profile"
        className={styles.profileImg}
      ></Image>
      <div className={styles.dataContainer}>
        <div className={styles.address}>0x2491…5818</div>
        <div className={styles.balance}>$323.29</div>
      </div>
    </div>
  );
};

export default WalletCard;
