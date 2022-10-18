import { HttpProvider } from "@harmony-js/network";
import { HRC721, Key } from "harmony-marketplace-sdk";
import styles from "@styles/HistoryTableTx.module.css";
import { IHistoryTableTX } from "@lib/types";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import Identicon from "react-identicons";
import ABI from "@lib/abis/hrc721.json";

interface Props {
  tx: IHistoryTableTX;
  walletAddress: string;
}

const HistoryTableTx: FC<Props> = ({ tx, walletAddress }) => {
  const [active, setActive] = useState(false);
  const [nftImage, setNftImage] = useState("/nft.webp");
  const [nftUri, setNftUri] = useState("");
  const [loadingNft, setLoadingNft] = useState(false);

  useEffect(() => {
    if (!tx.nft || loadingNft) {
      return;
    }
    setLoadingNft(true);

    const key = new Key(new HttpProvider("https://api.harmony.one"));
    const contract = new HRC721(tx.nft.contractAddress, ABI, key);

    let url = "";
    contract
      .tokenURI(tx.nft.tokenId)
      .then((uri) => {
        url = uri;
        return fetch(uri);
      })
      .then(async (response) => {
        const data = await response.json();
        const imageUrl = data.image;
        if (imageUrl) {
          setNftUri(url);
          setNftImage(imageUrl);
          setLoadingNft(false);
        }
      })
      .catch(() => {
        setLoadingNft(false);
      });
  }, []);

  const getActionIcon = () => {
    let icon = "";
    if (tx.action === "Transfer") {
      icon = sameAddress(tx.recipient.from, walletAddress)
        ? "/actions/send.svg"
        : "/actions/receive.svg";
    }

    return icon || "/actions/contract.svg";
  };

  const sameAddress = (address1: string, address2: string) => {
    return address1.toUpperCase() === address2.toUpperCase();
  };

  const getActionTitle = () => {
    let action = tx.action;

    if (tx.action === "Transfer") {
      action = sameAddress(tx.recipient.from, walletAddress)
        ? "Send"
        : "Receive";

      if (tx.nft) {
        action += " NFT";
      }
    }

    return action || "Contract Execution";
  };

  const formatTime = () => {
    return new Date(tx.datetime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTokenSymbolImage = (symbol = "") => {
    const actionTitles = new Map<string, string>([
      ["USDC", "/tokens/usdc.webp"],
      ["ETH", "/tokens/eth.png"],
      ["ONE", "/tokens/one.png"],
    ]);
    const icon = actionTitles.get(tx.hrc20?.symbol || "");

    if (icon) {
      return (
        <Image
          height="32"
          width="32"
          src={icon}
          alt="token"
          className={styles.tokenImage}
        ></Image>
      );
    }

    return (
      <div className={styles.defaultTokenIcon}>
        <span>{tx.hrc20?.symbol?.toUpperCase()?.slice(0, 3)}</span>
      </div>
    );
  };

  const getTokenDiff = () => {
    let sign = "";

    if (tx.action === "Transfer") {
      sign = sameAddress(tx.recipient.from, walletAddress) ? "-" : "+";
    }

    return `${sign}${tx.hrc20?.amount} ${tx.hrc20?.symbol}`;
  };

  const getTokenDiffClass = () => {
    if (tx.action !== "Transfer") {
      return "";
    }

    const netPositive = sameAddress(tx.recipient.to, walletAddress);
    return netPositive ? styles.greenTokenDiff : "";
  };

  const getPrice = () => {
    if (!tx.hrc20?.price) {
      return "";
    }
    return `$${tx.hrc20?.price}`;
  };

  const getRecipientTitle = () => {
    if (tx.recipient.isContract) {
      return "Application";
    }

    // show the other address
    if (sameAddress(tx.recipient.to, walletAddress)) {
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
    // show the other address
    if (sameAddress(tx.recipient.to, walletAddress)) {
      return shortenAddress(tx.recipient.from);
    }

    return shortenAddress(tx.recipient.to);
  };

  const getRecipientFullAddress = () => {
    return sameAddress(tx.recipient.to, walletAddress)
      ? tx.recipient.from
      : tx.recipient.to;
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const getFee = () => {
    const feePrice = tx.feePrice ? ` ($${tx.feePrice})` : "";
    return `${tx.fee} ONE ${feePrice}`;
  };

  const getTxHash = () => {
    return shortenAddress(tx.hash);
  };

  const getExternalTxLink = () => {
    return `https://explorer.harmony.one/tx/${tx.hash}`;
  };

  const getExternalAddressLink = () => {
    return `https://explorer.harmony.one/address/${getRecipientFullAddress()}`;
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
          {tx.action === "Transfer" && tx.hrc20 ? (
            <div className={styles.tokenContainer}>
              {getTokenSymbolImage()}
              <div className={styles.tokenDetailContainer}>
                <div className={getTokenDiffClass()}>{getTokenDiff()}</div>
                <div className={styles.tokenValue}>{getPrice()}</div>
              </div>
            </div>
          ) : (
            ""
          )}
          {tx.action === "Transfer" && tx.nft ? (
            <a
              className={
                nftUri ? styles.nftTokenContainer : styles.tokenContainer
              }
              target={"_blank"}
              rel={"noreferrer"}
              href={nftUri}
              onClick={(event) => {
                if (nftUri) {
                  event.stopPropagation();
                } else {
                  event.preventDefault();
                }
              }}
            >
              {loadingNft ? (
                <div className={styles.ldsRipple}>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <img
                  height="32"
                  width="32"
                  src={nftImage}
                  alt="token"
                  className={styles.nftImage}
                ></img>
              )}
              <div className={styles.tokenDetailContainer}>
                <div className={getTokenDiffClass()}>
                  {tx.nft?.collectionName} #{tx.nft?.tokenId}
                </div>
                <div className={styles.tokenValue}>{getPrice()}</div>
              </div>
            </a>
          ) : (
            ""
          )}
          <div className={styles.recipientContainer}>
            <a
              className={styles.recipientInnerContainer}
              target={"_blank"}
              rel={"noreferrer"}
              href={getExternalAddressLink()}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.recipientText}>{getRecipientTitle()}</div>
              <div className={styles.recipientAddressContainer}>
                <div className={styles.recipientAddressImageContainer}>
                  <Identicon
                    string={getRecipientFullAddress()}
                    className={styles.recipientAddressImage}
                    size={"16"}
                  ></Identicon>
                </div>
                <div className={styles.recipientAddress}>
                  {getRecipientAddress()}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      {active ? getTxDetail() : ""}
    </div>
  );
};

export default HistoryTableTx;
