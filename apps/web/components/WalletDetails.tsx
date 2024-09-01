"use client";
import React, { useEffect, useState } from 'react';
import { Table } from '@repo/ui/table';
import { ColumnDef } from '@tanstack/react-table';
import { deleteWallet, getWalletDetails } from "../app/lib/actions/wallet";
import {type SolanaWallet} from "@prisma/client";
import { Card } from '@repo/ui/card';
import { walletAddState } from "../app/store/walletAddState";
import { useRecoilState } from 'recoil';
import toast from 'react-hot-toast';

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

  const handleDelete = async (id: number) => {
    const success = await deleteWallet(id);
    if (success) {
      toast.success("Wallet deleted successfully");
      setWalletState(true);
    }
  };

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
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button onClick={() => handleDelete(row.original.id)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <Card title="Wallets">
        <div>
          <Table data={walletDetails} columns={columns} />
        </div>
    </Card>
  );
};


