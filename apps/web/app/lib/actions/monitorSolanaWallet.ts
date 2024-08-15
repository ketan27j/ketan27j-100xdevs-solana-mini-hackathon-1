'use server';
import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const THRESHOLD = 1000000000;

export async function monitorSolanaWallet(walletAddress: string): Promise<null> {
  const publicKey = new PublicKey(walletAddress);
  const transactionList = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
  
  for(const transaction of transactionList){
    const details = await connection.getParsedTransaction(transaction.signature)
    if(details){
        const amount = checkForLargeTransaction(details);
        if(amount && amount !=0 && amount > THRESHOLD){
            console.log(`Large transaction detected : ${amount/1000000000} SOL`)
        }
    }
  }
  return null;
};

export const checkForLargeTransaction = (transactionDetails: ParsedTransactionWithMeta): number => {
  if (!transactionDetails || !transactionDetails.meta) return 0;

  const preBalance = transactionDetails.meta.preBalances[0] ?? 0;
  const postBalance = transactionDetails.meta.postBalances[0] ?? 0;
  const amountTransferred = Math.abs(postBalance - preBalance) / 1000000000; // Convert lamports to SOL
  return amountTransferred;
};
