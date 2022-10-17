import type { NextPage } from "next";
import Head from "next/head";
import WalletCard from "@components/WalletCard";
import styles from "@styles/WalletOverview.module.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Wallet Overview</title>
        <meta name="description" content="Wallet Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <WalletCard></WalletCard>
      </main>
    </div>
  );
};

export default Home;
