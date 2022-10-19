import type { NextPage } from "next";
import Head from "next/head";
import WalletCard from "@components/WalletCard";
import styles from "@styles/Overview.module.css";
import TabSelector from "@components/TabSelector";
import PerformanceCard from "@components/PerformanceCard";
import HistoryCard from "@components/HistoryCard";
import AssetsCard from "@components/AssetsCard";
import HistoryTable from "@components/HistoryTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Identicon from "react-identicons";

const wallets = [
  "0x8D1D23dA965D33C2EBCf49ddaC95e8Da9Ec1fFa7",
  "0x6D95A4341fF6321af10983EDD40D6a333F636258",
  "0xa2c2a7370CD059da2A6e48fD5F7c2CB8cF8Ba778",
];

const shortenAddress = (address: string) => {
  const start = address.slice(0, 6);
  const end = address.slice(address.length - 4, address.length);
  return `${start}...${end}`;
};

const Overview: NextPage = () => {
  const router = useRouter();

  const [txs, setTxs] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (address) {
      return;
    }

    let { address: queryAddress = "" } = router.query;
    queryAddress =
      typeof queryAddress === "string" ? queryAddress : queryAddress[0];

    if (!queryAddress) {
      return;
    }

    fetch(`/api/address/${queryAddress}/txs`).then(async (response) => {
      const data = await response.json();
      setTxs(data.txs);
      setAddress(data.wallet);
    });
  }, [router]);

  return (
    <div className={styles.page}>
      <Head>
        <title>Polytonal</title>
        <meta name="description" content="Polytonal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.sidebarBack}>
        <div>.</div>
      </div>
      <div className={styles.sidebar}>
        <a href="/" className={styles.polytonal}>
          POLYTONAL
        </a>
        <a
          href={`/address/portfolio/overview`}
          className={styles.walletContainer}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="6" fill="#2962EF"></rect>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.793 9.623a3.587 3.587 0 00-3.586 0L8.44 12.959a.87.87 0 000 1.51l5.768 3.336c1.107.64 2.479.64 3.586 0l5.768-3.335a.87.87 0 000-1.511l-5.768-3.336zM8.439 17.53l1.124-.65 3.881 2.245a5.11 5.11 0 005.112 0l3.881-2.245 1.124.65a.87.87 0 010 1.511l-5.768 3.336a3.587 3.587 0 01-3.586 0L8.44 19.041a.87.87 0 010-1.51z"
              fill="#fff"
            ></path>
          </svg>
          <span className={styles.portfolio}>Portfolio</span>
        </a>
        {wallets.map((wallet) => (
          <a
            href={`/address/${wallet}/overview`}
            className={styles.walletContainer}
          >
            <Identicon
              string={wallet}
              className={styles.avatar}
              size={"32"}
            ></Identicon>
            {shortenAddress(wallet)}
          </a>
        ))}
      </div>

      <div className={styles.mainContainer}>
        <main className={styles.main}>
          <WalletCard></WalletCard>
          <div className={styles.tabSelectorContainer}>
            <TabSelector></TabSelector>
          </div>
          <div className={styles.historyTableContainer}>
            {txs.length ? (
              <HistoryTable txs={txs} walletAddress={address}></HistoryTable>
            ) : (
              <div className={styles.loading}>
                <Image
                  height="200"
                  width="200"
                  src="/loading.svg"
                  alt="action"
                ></Image>
              </div>
            )}
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
    </div>
  );
};

export default Overview;
