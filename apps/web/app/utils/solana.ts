import { Connection, PublicKey, ParsedTransactionWithMeta, SignaturesForAddressOptions } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Connection('https://api.mainnet-beta.solana.com');
//process.env.SOLANA_MAINNET || 
export async function getLatestTransactions(walletAddress: string): Promise<ParsedTransactionWithMeta[]> {
  const publicKey = new PublicKey(walletAddress);
  const transactionList = await getSignaturesWithRetry(publicKey, { limit: 3 });
  console.log(transactionList);
  const output: ParsedTransactionWithMeta[] = [];
  const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));
  
  for(const transaction of transactionList){
    await delay(10000);
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

export const checkForLargeTransaction = (transactionDetails: ParsedTransactionWithMeta, threshold: number): boolean => {
  if (!transactionDetails || !transactionDetails.meta) return false;

  const preBalance = transactionDetails.meta.preBalances[0] ?? 0;
  const postBalance = transactionDetails.meta.postBalances[0] ?? 0;
  const amountTransferred = Math.abs(postBalance - preBalance) / 1000000000; // Convert lamports to SOL
  console.log(`preBalance: ${preBalance} postBalance : ${postBalance} amountTransferred: ${amountTransferred} threashold: ${threshold}`);
  return amountTransferred >= threshold;
};
