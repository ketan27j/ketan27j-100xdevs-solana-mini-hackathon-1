import prisma from '@repo/db';
import { Connection, PublicKey, ParsedTransactionWithMeta, SignaturesForAddressOptions, TransactionResponse,LAMPORTS_PER_SOL } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Connection(process.env.SOLANA_MAINNET || 'https://api.mainnet-beta.solana.com');

export async function getLatestTransactions(walletAddress: string): Promise<ParsedTransactionWithMeta[]> {
  const publicKey = new PublicKey(walletAddress);
  const transactionList = await getSignaturesWithRetry(publicKey, { limit: 10 });
  // console.log(transactionList);
  const output: ParsedTransactionWithMeta[] = [];
  const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));
  
  for(const transaction of transactionList){
    // await delay(1000);
    const details = await connection.getParsedTransaction(transaction.signature)
    if(details){
        output.push(details);
    }
  }
  return output;
};

async function getSignaturesWithRetry(publicKey:PublicKey, options:SignaturesForAddressOptions, retries = 5) {
  const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} to get signatures for address ${publicKey.toString()}`);
      const signatures = await connection.getSignaturesForAddress(publicKey, options);
      return signatures;
    } catch (error:any) {
      if (error.message.includes('429')) {
        const retryAfter = 11000; // Exponential backoff with jitter
        console.log(`Rate limited. Retrying after ${retryAfter} ms...`);
        await delay(retryAfter);
      } else {
        throw error;
      }
    }
  }
  throw new Error('Too many requests, please try again later.');
}

export const checkForLargeTransaction = (transactionDetails: ParsedTransactionWithMeta, solPriceInUsd: number): number => {
  if (!transactionDetails || !transactionDetails.meta) return 0;

  const preBalances = transactionDetails.meta.preBalances;
  const postBalances = transactionDetails.meta.postBalances;
  
  if (!preBalances || !postBalances) return 0;

  let amountTransferred = 0;
  for (let i = 0; i < preBalances.length; i++) {
    const balanceChange = (postBalances[i] ?? 0)-(preBalances[i] ?? 0);
    if(Math.abs(balanceChange) > amountTransferred){
      amountTransferred = balanceChange
    }
  }
  
  const amountTransferredSOL = (Math.abs(amountTransferred) / LAMPORTS_PER_SOL) ; 
  const amountTransferredUSD = amountTransferredSOL * solPriceInUsd;
  // console.log(`preBalances: ${preBalances} postBalances: ${postBalances} amountTransferredSOL: ${amountTransferredSOL} amountTransferredUSD: ${amountTransferredUSD}`);
  return amountTransferredUSD;
};

export async function insertTransaction(wallet: { id: number; address: string; threshold: number; createdAt: Date; }, transaction:ParsedTransactionWithMeta, amountTransferredUSD: number) {
  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      amount: amountTransferredUSD,
      signature: transaction.transaction.signatures[0] ?? '',
      tweeted: true,
      timestamp: new Date(),
    },
  });
}