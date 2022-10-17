import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/WalletOverview.module.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Wallet Overview</title>
        <meta name="description" content="Wallet Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </div>
  );
};

export default Home;
