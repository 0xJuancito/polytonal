import type { NextPage } from "next";
import Head from "next/head";
import styles from "@styles/Overview.module.css";
import TabSelector from "@components/TabSelector";
import PerformanceCard from "@components/PerformanceCard";
import HistoryCard from "@components/HistoryCard";
import AssetsCard from "@components/AssetsCard";
import HistoryTable from "@components/HistoryTable";
import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Identicon from "react-identicons";
import { Store, ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const exampleWallets = [
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

  const [wallets, setWallets] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const [errorWallet, setErrorWallet] = useState(false);

  useEffect(() => {
    try {
      const lsWallets = window.localStorage.getItem("wallets") || "[]";
      setWallets(JSON.parse(lsWallets));
    } catch {
      window.localStorage.clear();
    }

    // TODO check
    // if (address) {
    //   return;
    // }

    let { address: queryAddress = "" } = router.query;
    queryAddress =
      typeof queryAddress === "string" ? queryAddress : queryAddress[0];

    if (!queryAddress) {
      return;
    }

    setAddress(queryAddress.toLowerCase());
    setTxs([]);

    try {
      const lsNewWallets: any = window.localStorage.getItem("wallets") || "[]";
      const newWWallets = JSON.parse(lsNewWallets);
      setWallets(newWWallets);
    } catch (err) {
      setErrorWallet(true);
      console.log(err);
    }

    if (queryAddress === "portfolio") {
      try {
        const lsNewTxs: any = window.localStorage.getItem("portfolio");
        const newTxs = JSON.parse(lsNewTxs);
        setTxs(newTxs);
      } catch (err) {
        setErrorWallet(true);
        console.log(err);
      }
      return;
    }
    try {
      const lsNewTxs: any = window.localStorage.getItem(
        queryAddress.toLowerCase()
      );
      if (lsNewTxs) {
        const newTxs = JSON.parse(lsNewTxs);
        setTxs(newTxs);
        return;
      }
    } catch (err) {
      setErrorWallet(true);
      console.log(err);
    }

    fetch(`/api/address/${queryAddress.toLowerCase()}/txs`)
      .then(async (response) => {
        const data = await response.json();
        setTxs(data.txs);
        // TODO works but not great
        if (!data.txs.length) {
          setErrorWallet(true);
        }
      })
      .catch((err) => {
        setErrorWallet(true);
      });
  }, [router]);

  const addWallet = () => {
    const auxWallets = wallets as any;
    if (auxWallets.includes(address.toLowerCase())) {
      return;
    }
    const newWallets = [...auxWallets, address.toLowerCase()] as any;
    setWallets(newWallets);
    window.localStorage.setItem(address.toLowerCase(), JSON.stringify(txs));
    window.localStorage.setItem("wallets", JSON.stringify(newWallets));

    try {
      let allTxs: any = [];
      newWallets.forEach((wallet: string) => {
        const lsOtherWallet =
          window.localStorage.getItem(wallet.toLowerCase()) || "[]";
        const otherWallet = JSON.parse(lsOtherWallet);
        allTxs = allTxs.concat(otherWallet);
      });
      allTxs = allTxs.sort(
        (a: any, b: any) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );
      window.localStorage.setItem("portfolio", JSON.stringify(allTxs));
    } catch (err) {
      console.error(err);
    }
  };

  const removeWallet = () => {
    const newWallets = wallets.filter(
      (wallet) => wallet !== address.toLowerCase()
    );
    setWallets(newWallets);
    window.localStorage.removeItem(address.toLowerCase());
    window.localStorage.setItem("wallets", JSON.stringify(newWallets));

    try {
      let allTxs: any = [];
      newWallets.forEach((wallet: string) => {
        const lsOtherWallet =
          window.localStorage.getItem(wallet.toLowerCase()) || "[]";
        const otherWallet = JSON.parse(lsOtherWallet);
        allTxs = allTxs.concat(otherWallet);
      });
      allTxs = allTxs.sort(
        (a: any, b: any) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );
      window.localStorage.setItem("portfolio", JSON.stringify(allTxs));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchValue(event.target.value);
  };

  const search = () => {
    if (
      !searchValue.length ||
      searchValue.toLowerCase() === address.toLowerCase()
    ) {
      return;
    }

    if (searchValue.length != 42) {
      Store.addNotification({
        title: "Invalid address",
        message: "The provided Harmony address is invalid",
        type: "danger",
        insert: "bottom",
        container: "bottom-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 4000,
          onScreen: true,
        },
      });
      return;
    }

    setErrorWallet(false);
    setSearchValue("");
    router.push(`/address/${searchValue}/overview`);
  };

  const gotoOverview = (addr: string) => {
    router.push(`/address/${addr}/overview`);
  };

  return (
    <div className={styles.page}>
      <ReactNotifications />
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
        <div
          className={styles.walletContainer}
          onClick={() => gotoOverview("portfolio")}
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
          <span className={styles.portfolio}>PORTFOLIO</span>
        </div>
        {wallets.map((wallet, id) => (
          <div
            onClick={() => gotoOverview(wallet)}
            className={styles.walletContainer}
            key={id}
          >
            <Identicon
              string={wallet}
              className={styles.avatar}
              size={"32"}
            ></Identicon>
            {shortenAddress(wallet)}
          </div>
        ))}
      </div>

      <div className={styles.mainContainer}>
        <main className={styles.main}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              id="search"
              name="search"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Enter a Harmony address (one... or 0x...)"
              className={styles.searchInput}
            ></input>
            <button className={styles.cardAddButton} onClick={() => search()}>
              Search
            </button>
          </div>
          <div className={styles.cardContainer}>
            <div>
              {router.query.address === "portfolio" ? (
                <svg
                  width="104"
                  height="104"
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
              ) : (
                <Identicon
                  string={address.toLowerCase()}
                  className={styles.cardProfileImg}
                  size={"104"}
                ></Identicon>
              )}
              <div className={styles.cardDataContainer}>
                <div className={styles.cardAddress}>
                  {router.query.address === "portfolio"
                    ? "PORTFOLIO"
                    : shortenAddress(address.toLowerCase())}
                </div>
                {/* <div className={styles.cardBalance}>$323.29</div> */}
              </div>
            </div>
            <div className={styles.cardButtonContainer}>
              {router.query.address === "portfolio" || !txs?.length ? (
                ""
              ) : (
                <button
                  className={styles.cardAddButton}
                  onClick={() => {
                    {
                      (wallets as any).includes(address.toLowerCase())
                        ? removeWallet()
                        : addWallet();
                    }
                  }}
                >
                  {(wallets as any).includes(address.toLowerCase())
                    ? "Remove wallet"
                    : "Add wallet"}
                </button>
              )}
            </div>
          </div>
          <div className={styles.tabSelectorContainer}>
            <TabSelector></TabSelector>
          </div>
          <div className={styles.historyTableContainer}>
            {txs?.length ? <HistoryTable txs={txs}></HistoryTable> : ""}
            {!txs.length && !errorWallet ? (
              <div className={styles.loading}>
                <Image
                  height="200"
                  width="200"
                  src="/loading.svg"
                  alt="action"
                ></Image>
              </div>
            ) : (
              ""
            )}
            {!txs.length && errorWallet ? (
              <div className={styles.errorMessage}>No transactions found</div>
            ) : (
              ""
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