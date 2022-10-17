import styles from "@styles/HistoryTableTx.module.css";
import { IHistoryTableTX } from "@lib/types";
import Image from "next/image";
import { FC } from "react";

interface Props {
  tx: IHistoryTableTX;
}

const HistoryTableTx: FC<Props> = ({ tx }) => {
  const getActionIcon = (action: string) => {
    const actionTitles = new Map<string, string>([
      ["send", "/actions/send.svg"],
    ]);
    return actionTitles.get(action) || "/actions/contract.svg";
  };

  const getActionTitle = (action: string) => {
    const actionTitles = new Map<string, string>([["send", "Send"]]);
    return actionTitles.get(action) || "Contract Execution";
  };

  const formatTime = (datetime: Date) => {
    return datetime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTokenSymbol = (symbol = "") => {
    const actionTitles = new Map<string, string>([
      ["USDC", "/tokens/usdc.webp"],
    ]);
    return actionTitles.get(symbol) || "/actions/contract.svg";
  };

  const getTokenDiff = (tx: IHistoryTableTX) => {
    let text = "";

    if (tx.action === "send") {
      text += "-";
    }

    text = `${text}${tx.erc20?.amount} ${tx.erc20?.symbol}`;

    return text;
  };

  const getPrice = (tx: IHistoryTableTX) => {
    return `$${tx.erc20?.price}`;
  };

  const getRecipientTitle = (tx: IHistoryTableTX) => {
    if (tx.recipient.isContract) {
      return "Application";
    }

    if (tx.action === "receive") {
      return "From";
    }

    return "To";
  };

  const getRecipientAddress = (tx: IHistoryTableTX) => {
    const parseAddress = (address: string) => {
      const start = address.slice(0, 6);
      const end = address.slice(address.length - 4, address.length);
      return `${start}...${end}`;
    };

    if (tx.action === "receive") {
      return parseAddress(tx.recipient.from);
    }

    return parseAddress(tx.recipient.to);
  };

  return (
    <div className={styles.txContainer}>
      <div className={styles.actionContainer}>
        <Image
          height="24"
          width="24"
          src={getActionIcon(tx.action)}
          alt="action"
          className={styles.actionImage}
        ></Image>
        <div className={styles.actionDetailContainer}>
          <div className={styles.actionText}>{getActionTitle(tx.action)}</div>
          <div className={styles.actionDate}>{formatTime(tx.datetime)}</div>
        </div>
      </div>

      <div className={styles.tokenRecipientContainer}>
        <div className={styles.tokenContainer}>
          <Image
            height="32"
            width="32"
            src={getTokenSymbol(tx.erc20?.symbol)}
            alt="token"
            className={styles.tokenImage}
          ></Image>
          <div className={styles.tokenDetailContainer}>
            <div className={styles.tokenDiff}>{getTokenDiff(tx)}</div>
            <div className={styles.tokenValue}>{getPrice(tx)}</div>
          </div>
        </div>
        <div className={styles.recipientContainer}>
          <div className={styles.recipientText}>{getRecipientTitle(tx)}</div>
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
              {getRecipientAddress(tx)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTableTx;
