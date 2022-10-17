import type { NextPage } from "next";
import Head from "next/head";
import WalletCard from "@components/WalletCard";
import styles from "@styles/WalletOverview.module.css";
import TabSelector from "../../components/TabSelector";
import PerformanceCard from "../../components/PerformanceCard";
import HistoryCard from "../../components/HistoryCard";
import AssetsCard from "../../components/AssetsCard";
import HistoryTable from "../../components/HistoryTable";

const Home: NextPage = () => {
  return (
    <div className={styles.page}>
      <Head>
        <title>Wallet Overview</title>
        <meta name="description" content="Wallet Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <WalletCard></WalletCard>
        <div className={styles.tabSelectorContainer}>
          <TabSelector></TabSelector>
        </div>
        <div className={styles.historyTableContainer}>
          <HistoryTable></HistoryTable>
        </div>
        <div>
          <div className={styles.cardsContainer}>
            <PerformanceCard></PerformanceCard>
            <HistoryCard></HistoryCard>
          </div>
          <div className={styles.assetsCardContainer}>
            <AssetsCard></AssetsCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
