"use client";
import React, { useEffect, useState } from 'react';
import { Table } from '@repo/ui/table';
import { ColumnDef } from '@tanstack/react-table';
import { getTransactionDetails } from "../app/lib/actions/wallet";
import {type Transaction} from "@prisma/client";
import { Card } from '@repo/ui/card';

const columns: ColumnDef<Transaction>[] = [
  {
    header: 'Id',
    accessorKey: 'id',
  },
  {
    header: 'Signature',
    accessorKey: 'signature',
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
  },
  {
    header: 'Time',
    accessorKey: 'timestamp',
  },
  {
    header: 'Tweeted',
    accessorKey: 'tweeted',
  },
];
export const TransactionDetails = () => {
  const [transactionDetails, setTransactionDetails] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactionDetails().then((res) => {
      const data = res as Transaction[];
      console.log(data);
      setTransactionDetails(data);
    });
  }, []);

  return (
    <Card title="Whale Transactions">
        <div>
          <Table data={transactionDetails} columns={columns} />
        </div>
    </Card>
  );
};


