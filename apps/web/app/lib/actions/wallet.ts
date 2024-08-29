"use server";
import prisma from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function addWalletInDb(walletAddr: string, walletThreshold: number) {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    try {
        const res = await prisma.solanaWallet.create({
            data: {
                address: walletAddr,
                threshold: walletThreshold,
                createdAt: new Date(),
                userId: userId
            }
        })
        return res;
    } catch(error) {
        console.log(error);
    }
};