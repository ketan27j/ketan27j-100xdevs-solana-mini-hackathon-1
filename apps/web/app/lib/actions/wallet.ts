"use server";
import prisma from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { type SolanaWallet, Transaction } from "@prisma/client";

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

export async function getWalletDetails(): Promise<SolanaWallet[]> {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    try {
        const res = await prisma.solanaWallet.findMany({
            where: {
                userId: userId
            }
        })
        return res;
    } catch(error) {
        console.log(error);
        return [];
    }
}

export async function deleteWallet(id: number): Promise<boolean> {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    try {
        if(userId == null) {
            return false;
        }
        await prisma.solanaWallet.delete({
            where: {
                id: id
            }
        })
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

export async function getTransactionDetails(): Promise<Transaction[]> {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    try {
        const res = await prisma.transaction.findMany({})
        return res;
    } catch(error) {
        console.log(error);
        return [];
    }
}