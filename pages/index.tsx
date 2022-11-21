import type { NextPage } from "next";
import Head from "next/head";
import styles from "@styles/ConnectWallet.module.css";
import { Store, ReactNotifications } from "react-notifications-component";
import { SetStateAction, useState } from "react";
import "react-notifications-component/dist/theme.css";
import { useRouter } from "next/router";

const ConnectWallet: NextPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState("");

  const submitAddress = () => {
    if (!address.length) {
      router.push("/address/portfolio/overview");
      return;
    }

    if (address.length != 42) {
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

    router.push(`/address/${address}/overview`);
  };

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setAddress(event.target.value);
  };

  return (
    <div className={styles.page}>
      <ReactNotifications />
      <Head>
        <title>Polytonal</title>
        <meta name="description" content="Polytonal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.polytonal}>Polytonal</div>
        <div className={styles.subtitle}>
          Track all your Harmony wallets in one place
        </div>
        <div className={styles.addressContainer}>
          <div className={styles.label}>Track any wallet</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              id="address"
              name="address"
              onChange={handleChange}
              placeholder="Enter a Harmony address (one... or 0x...)"
              className={styles.addressInput}
            ></input>
            <button
              className={styles.addButton}
              onClick={() => submitAddress()}
            >
              Search
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConnectWallet;
