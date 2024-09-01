"use client";
import React, { useEffect, useState } from 'react';
import { Table } from '@repo/ui/table';
import { ColumnDef } from '@tanstack/react-table';
import { getWalletDetails } from "../app/lib/actions/wallet";
import {type SolanaWallet} from "@prisma/client";
import { Card } from '@repo/ui/card';
import { walletAddState } from "../app/store/walletAddState";
import { useRecoilState } from 'recoil';

const columns: ColumnDef<SolanaWallet>[] = [
  {
    header: 'Id',
    accessorKey: 'id',
  },
  {
    header: 'Wallet Address',
    accessorKey: 'address',
  },
  {
    header: 'Wallet Threshold',
    accessorKey: 'threshold',
  },
  {
    header: 'User',
    accessorKey: 'userId',
  },
];
export const WalletDetails = () => {
  const [walletDetails, setWalletDetails] = useState<SolanaWallet[]>([]);
  const [walletState, setWalletState] = useRecoilState(walletAddState);

  useEffect(() => {
    getWalletDetails().then((res) => {
      const data = res as SolanaWallet[];
      console.log(data);
      setWalletDetails(data);
      setWalletState(false)
    });
  }, [walletState]);

  return (
    <Card title="Wallets">
        <div>
          <Table data={walletDetails} columns={columns} />
        </div>
    </Card>
  );
};


