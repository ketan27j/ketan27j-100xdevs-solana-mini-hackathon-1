import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@repo/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        wallet: true,
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
