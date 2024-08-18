import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { threadId } from 'worker_threads';

const connection = new Connection('https://api.mainnet-beta.solana.com');

export async function getLatestTransactions(walletAddress: string): Promise<ParsedTransactionWithMeta[]> {
  const publicKey = new PublicKey(walletAddress);
  const transactionList = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
  const output: ParsedTransactionWithMeta[] = [];
  for(const transaction of transactionList){
    const details = await connection.getParsedTransaction(transaction.signature)
    if(details){
        output.push(details);
    }
  }
  return output;
};

export const checkForLargeTransaction = (transactionDetails: ParsedTransactionWithMeta, threshold: number): boolean => {
  if (!transactionDetails || !transactionDetails.meta) return false;

  const preBalance = transactionDetails.meta.preBalances[0] ?? 0;
  const postBalance = transactionDetails.meta.postBalances[0] ?? 0;
  const amountTransferred = Math.abs(postBalance - preBalance) / 1000000000; // Convert lamports to SOL
  console.log(`preBalance: ${preBalance} postBalance : ${postBalance} amountTransferred: ${amountTransferred} threashold: ${threshold}`);
  return amountTransferred >= threshold;
};
