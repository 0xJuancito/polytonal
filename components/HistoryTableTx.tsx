import styles from "@styles/HistoryTableTx.module.css";
import Image from "next/image";

const HistoryTableTx = () => {
  return (
    <div className={styles.txContainer}>
      <div className={styles.actionContainer}>
        <Image
          height="24"
          width="24"
          src={"/action.svg"}
          alt="action"
          className={styles.actionImage}
        ></Image>
        <div className={styles.actionDetailContainer}>
          <div className={styles.actionText}>Send</div>
          <div className={styles.actionDate}>10:07 PM</div>
        </div>
      </div>

      <div className={styles.tokenRecipientContainer}>
        <div className={styles.tokenContainer}>
          <Image
            height="32"
            width="32"
            src={"/token.png"}
            alt="token"
            className={styles.tokenImage}
          ></Image>
          <div className={styles.tokenDetailContainer}>
            <div className={styles.tokenDiff}>−250 USDC</div>
            <div className={styles.tokenValue}>$250.31</div>
          </div>
        </div>
        <div className={styles.recipientContainer}>
          <div className={styles.recipientText}>To</div>
          <div className={styles.recipientAddressContainer}>
            <div className={styles.recipientAddressImageContainer}>
              <Image
                height="16"
                width="16"
                src={"/profile.png"}
                alt="profile"
                className={styles.recipientAddressImage}
              ></Image>
            </div>
            <div className={styles.recipientAddress}>0x3da4...dbc6</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTableTx;
