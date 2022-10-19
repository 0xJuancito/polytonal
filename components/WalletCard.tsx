import styles from "@styles/WalletCard.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Identicon from "react-identicons";

const WalletCard = () => {
  const router = useRouter();

  const [address, setAddress] = useState("");

  useEffect(() => {
    const { address = "" } = router.query;
    setAddress(address as string);
  }, [router]);

  const shortenAddress = (address: string) => {
    const start = address.slice(0, 6);
    const end = address.slice(address.length - 4, address.length);
    return `${start}...${end}`;
  };

  const addWallet = () => {
    console.log(address);
  };

  return (
    <div className={styles.container}>
      <div>
        <Identicon
          string={address}
          className={styles.profileImg}
          size={"104"}
        ></Identicon>
        <div className={styles.dataContainer}>
          <div className={styles.address}>{shortenAddress(address)}</div>
          {/* <div className={styles.balance}>$323.29</div> */}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.addButton}
          onClick={() => {
            addWallet();
          }}
        >
          Add wallet
        </button>
      </div>
    </div>
  );
};

export default WalletCard;
