import type { NextPage } from "next";
import Head from "next/head";
import WalletCard from "@components/WalletCard";
import styles from "@styles/ConnectWallet.module.css";

const ConnectWallet: NextPage = () => {
  return (
    <div className={styles.page}>
      <Head>
        <title>Connect Wallet</title>
        <meta name="description" content="Connect Wallet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.polytonal}>Polytonal</div>
        <div className={styles.subtitle}>
          All your Harmony wallets in one place
        </div>
        <div className={styles.addressContainer}>
          <div className={styles.label}>Track any wallet</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter Harmony address (one... or 0x...)"
              className={styles.addressInput}
            ></input>
            <button className={styles.addButton}>Add</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConnectWallet;
