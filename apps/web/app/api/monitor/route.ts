import prisma from '@repo/db';
import { getLatestTransactions, checkForLargeTransaction } from '../../utils/solana';
import { tweetMessage } from '../../utils/twitter';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const wallets = await prisma.solanaWallet.findMany();

    for (const wallet of wallets) {
      const transactions = await getLatestTransactions(wallet.address);
      console.log(transactions);
        for (const transaction of transactions) {
            if (transaction && checkForLargeTransaction(transaction, wallet.threshold)) {
                
                const amountTransferred = (Math.abs((transaction?.meta?.postBalances?.[0] ?? 0) - (transaction?.meta?.preBalances?.[0] ?? 0)) / 1e9);
                const message = `Whale Alert! A transaction of ${amountTransferred} SOL was detected in wallet ${wallet.address}. Signature: ${transaction.transaction.signatures[0]}`;
                console.log(message);
                //await tweetMessage(message);

                await prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: amountTransferred,
                    signature: transaction.transaction.signatures[0] ?? '',
                },
                });
            }
        }
    }

    return NextResponse.json({ message: 'Monitoring completed.' }, {
        status: 200
    });
  } catch (error) {
    console.error('Error in monitoring:', error);
    NextResponse.json({ error: 'Internal server error' }, {
        status: 500
    });
  }
}
