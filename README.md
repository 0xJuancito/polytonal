# Polytonal - For Encode x Harmony Hackathon

<img width="729" alt="Screen Shot 2022-10-20 at 11 36 12" src="https://user-images.githubusercontent.com/12957692/196978974-793e7d16-6414-466a-81fa-94334b6884b1.png">

## Harmony SDK & Covalent Usage

- [Harmony Marketplace SDK - HRC721 API tokenURI for retrieving the NFT metadata for HRC721](https://github.com/0xJuancito/polytonal/blob/main/components/HistoryTableTx.tsx)
- [Harmony Marketplace SDK - HRC1155 API tokenURI for retrieving the NFT metadata for HRC1155](https://github.com/0xJuancito/polytonal/blob/main/components/HistoryTableTx.tsx)
- [Harmony Marketplace SDK - KEY for generating a temporary wallet without private key](https://github.com/0xJuancito/polytonal/blob/main/components/HistoryTableTx.tsx)
- [Harmony Marketplace SDK - HttpProvider for connecting to the Harmony RPC](https://github.com/0xJuancito/polytonal/blob/main/components/HistoryTableTx.tsx)
- [Covalent - `transactions_v2` endpoint for getting the list of txs for the wallet and displaying it as a list](https://github.com/0xJuancito/polytonal/blob/main/lib/covalent.ts)
- [Covalent - `balances_v2` endpoint for getting the Tokens balances for the user](https://github.com/0xJuancito/polytonal/blob/main/lib/covalent.ts)
- [Covalent - `balances_v2` endpoint for getting the NFTs for the user](https://github.com/0xJuancito/polytonal/blob/main/lib/covalent.ts)

## Features

### Required by the hackathon

- Use of the Harmony Marketplace SDK to integrate with the blockchain and the HRC standards
- Use of Covalent APIs for getting wallet token and NFTs balances
- Accept multiple wallet addresses entered by user
- Retrieve all transaction details for the address over a period of time (default 1 month)
- Retrieve all HRC20/721/1155 transactions that impact the user (e.g. transactions made by user and tokens transferred to the user, etc)
- Show this information in a dashboard with ability to drill into each transaction (send user to explorer for more info)
- Opensource (MIT / BSD) github
- Working website that can be demonstrated: [https://polytonal.vercel.app](https://polytonal.vercel.app)

### Extra features

- Unified portfolio for transactions, balances and NFTs
- Support both Harmony One (one...) and Ethereum (0x...) addresses
- Display HRC20 tokens balances detail for all tokens the user has
- Display the total price of the HRC20 assets the user has
- Display a collection of NFTs owned by the user
- Link to NFT metadata
- Link to the explorer for the wallet address used
- Link to the explorer for the address that the wallet interacted with
- Display other interactions like Approval, Transfer, Mint, Burn, etc
- Custom wallet icons to distinguish addresses
- Filter by date or get all transactions
- Local storage cache for quickly loading once the data has been retrieved

<p align="left">
<img width="45%" alt="Screen Shot 2022-10-20 at 11 38 24" src="https://user-images.githubusercontent.com/12957692/196979583-c167ef0b-ea50-41d6-9039-fa98b8b0756a.png">
&nbsp; &nbsp; &nbsp; &nbsp;
<img width="45%" alt="Screen Shot 2022-10-20 at 11 41 15" src="https://user-images.githubusercontent.com/12957692/196980303-6898eafa-07ce-447e-b4e2-551d0f6b494a.png">
&nbsp; &nbsp; &nbsp; &nbsp;
<img width="45%" alt="Screen Shot 2022-10-20 at 11 38 15" src="https://user-images.githubusercontent.com/12957692/196979592-2c174aee-680e-4afd-8e5d-0f452d7c0721.png">
&nbsp; &nbsp; &nbsp; &nbsp;
<img width="45%" alt="Screen Shot 2022-10-20 at 11 38 03" src="https://user-images.githubusercontent.com/12957692/196979596-22a2eb9c-f64e-4702-b805-b8740db2f351.png">
</p>

## Wallet Examples

- [Wallet with recent HRC721 NFT game interactions](https://polytonal.vercel.app/address/0x01aa1d1131Ee8671A7864CD5bccD772B5479fE59/overview)
- [Wallet with HRC1155 transfers](https://polytonal.vercel.app/address/0x2E3B19E64eA050d703a0282a6DD2AFE8952fe70b/overview)
- [Wallet with HRC20 interactions](https://polytonal.vercel.app/address/0x6e46f1e34fc46c6937741c3b262984615c13177f/overview)
- [vitalik.eth wallet](https://polytonal.vercel.app/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045/overview)

## Known Issues

ℹ️ Sometimes Covalent is down for NFTs or Tokens responses with an error message: `Failed to connect to upstream third-party service`. When that happens, NFTs or Token won't be able to show on their respective sections.

ℹ️ For some addresses with lots of assets/transactions, Covalent is not able to respondo from their API

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
