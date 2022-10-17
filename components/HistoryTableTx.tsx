import styles from "@styles/HistoryTableTx.module.css";
import { IHistoryTableTX } from "@lib/types";
import Image from "next/image";
import { FC, useState } from "react";

interface Props {
  tx: IHistoryTableTX;
}

const HistoryTableTx: FC<Props> = ({ tx }) => {
  const [active, setActive] = useState(false);

  const getActionIcon = () => {
    const actionTitles = new Map<string, string>([
      ["send", "/actions/send.svg"],
    ]);
    return actionTitles.get(tx.action) || "/actions/contract.svg";
  };

  const getActionTitle = () => {
    const actionTitles = new Map<string, string>([["send", "Send"]]);
    return actionTitles.get(tx.action) || "Contract Execution";
  };

  const formatTime = () => {
    return tx.datetime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTokenSymbol = (symbol = "") => {
    const actionTitles = new Map<string, string>([
      ["USDC", "/tokens/usdc.webp"],
    ]);
    return actionTitles.get(tx.erc20?.symbol || "") || "/actions/contract.svg";
  };

  const getTokenDiff = () => {
    let text = "";

    if (tx.action === "send") {
      text += "-";
    }

    text = `${text}${tx.erc20?.amount} ${tx.erc20?.symbol}`;

    return text;
  };

  const getPrice = () => {
    return `$${tx.erc20?.price}`;
  };

  const getRecipientTitle = () => {
    if (tx.recipient.isContract) {
      return "Application";
    }

    if (tx.action === "receive") {
      return "From";
    }

    return "To";
  };

  const shortenAddress = (address: string) => {
    const start = address.slice(0, 6);
    const end = address.slice(address.length - 4, address.length);
    return `${start}...${end}`;
  };

  const getRecipientAddress = () => {
    if (tx.action === "receive") {
      return shortenAddress(tx.recipient.from);
    }

    return shortenAddress(tx.recipient.to);
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const getFee = () => {
    const price = "0.70";
    return `${tx.fee} ETH ($${price})`;
  };

  const getTxHash = () => {
    return shortenAddress(tx.hash);
  };

  const getExternalTxLink = () => {
    return `https://explorer.harmony.one/tx/${tx.hash}`;
  };

  const getTxDetail = () => {
    return (
      <div className={styles.txDetailContainer}>
        <div className={styles.feeContainer}>
          <div>Fee</div>
          <div className={styles.fee}>{getFee()}</div>
        </div>
        <a
          className={styles.txHashContainer}
          target={"_blank"}
          rel={"noreferrer"}
          href={getExternalTxLink()}
          onClick={(event) => event.stopPropagation()}
        >
          <div>Transaction hash</div>
          <div className={styles.txHashAddressContainer}>
            <div className={styles.txHash}>{getTxHash()}</div>
            <div className={styles.txExternalLink}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "rgb(0,163,245)" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.667 8.889h6.666c.306 0 .556-.25.556-.556V5.556c0-.306.25-.556.555-.556.306 0 .556.25.556.556v3.333C10 9.5 9.5 10 8.889 10H1.11C.5 10 0 9.5 0 8.889V1.11A1.11 1.11 0 011.111 0h3.333C4.75 0 5 .25 5 .556c0 .305-.25.555-.556.555H1.667a.557.557 0 00-.556.556v6.666c0 .306.25.556.556.556zM6.665 1.11a.557.557 0 01-.556-.555C6.11.25 6.36 0 6.665 0h2.778c.305 0 .555.25.555.556v2.777c0 .306-.25.556-.555.556a.557.557 0 01-.556-.556V1.894L3.815 6.967a.553.553 0 11-.784-.784l5.073-5.072h-1.44z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
        </a>
      </div>
    );
  };

  return (
    <div
      className={`${styles.txContainer} ${active ? styles.active : ""}`}
      onClick={toggleActive}
    >
      <div className={styles.txMainContainer}>
        <div className={styles.actionContainer}>
          <Image
            height="24"
            width="24"
            src={getActionIcon()}
            alt="action"
            className={styles.actionImage}
          ></Image>
          <div className={styles.actionDetailContainer}>
            <div className={styles.actionText}>{getActionTitle()}</div>
            <div className={styles.actionTime}>{formatTime()}</div>
          </div>
        </div>

        <div className={styles.tokenRecipientContainer}>
          <div className={styles.tokenContainer}>
            <Image
              height="32"
              width="32"
              src={getTokenSymbol()}
              alt="token"
              className={styles.tokenImage}
            ></Image>
            <div className={styles.tokenDetailContainer}>
              <div className={styles.tokenDiff}>{getTokenDiff()}</div>
              <div className={styles.tokenValue}>{getPrice()}</div>
            </div>
          </div>
          <div className={styles.recipientContainer}>
            <div className={styles.recipientText}>{getRecipientTitle()}</div>
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
              <div className={styles.recipientAddress}>
                {getRecipientAddress()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {active ? getTxDetail() : ""}
    </div>
  );
};

export default HistoryTableTx;