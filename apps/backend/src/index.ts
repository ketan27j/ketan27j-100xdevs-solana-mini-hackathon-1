import axios from "axios";
import express from "express";
import TwitterApi from "twitter-api-v2";
import prisma from '@repo/db';
import { checkForLargeTransaction, getLatestTransactions, insertTransaction } from "./utils/solana";
import dotenv from 'dotenv';

dotenv.config();

const app = express()

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY || '',
    appSecret: process.env.TWITTER_API_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
  });
  const rwClient = twitterClient.readWrite;

app.get("/monitor", async (req, res) => {
    try {
        const response = await axios.get(process.env.COINGECKO_URL || 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const solPriceInUsd = response.data.solana.usd;
        const wallets = await prisma.solanaWallet.findMany();
        for (const wallet of wallets) {
        const transactions = await getLatestTransactions(wallet.address);
        for (const transaction of transactions) {
            const amountTransferredUSD = checkForLargeTransaction(transaction, solPriceInUsd)
            console.log(`start-------------amountTransferredUSD ${amountTransferredUSD} wallet threshold ${wallet.threshold}`);
            if (amountTransferredUSD !== 0 && amountTransferredUSD >= wallet.threshold) {
                const message = `Whale Alert! A transaction of $${amountTransferredUSD} SOL was detected. https://solscan.io/tx/${transaction.transaction.signatures[0]}`;
                const transactionTweeted = await prisma.transaction.findFirst({
                    where: {
                        signature: transaction.transaction.signatures[0],
                        tweeted: true
                    }
                });
                if(!transactionTweeted) {
                    console.log(`end-------------message ${message}`);
                    await rwClient.v2.tweet(message);
                    await insertTransaction(wallet, transaction, amountTransferredUSD);
                    } else {
                        console.log('end-------------Transaction already tweeted');
                    }
                } else {
                    console.log('end-------------Transaction below threshold');
                }
            }
        }
    res.status(200).json({
        message: "Monitoring completed"
    });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
}});
app.listen(3003, () => {
    console.log("server is running on port 3003");
})

