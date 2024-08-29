"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { useState } from "react";
import { TextInput } from "@repo/ui/textInput";
import { addWalletInDb } from "../app/lib/actions/wallet";
import { toast } from "react-hot-toast"

export const AddWallet = () => {
    const [walletAddr, setWalletAddr] = useState<string>("");
    const [walletThreshold, setWalletThreshold] = useState<number>();
    return <Card title="Add Wallet Details">
        <div className="w-full">
            <TextInput label="Wallet Address" placeholder="Wallet Address" value={walletAddr} onChange={(value) => {setWalletAddr(value)}} />
            <TextInput label="Wallet Threshold" placeholder="Wallet Threshold" value={walletThreshold?.toString()??""} onChange={(value) => {setWalletThreshold(Number(value))}} />
            <div className="flex justify-center pt-4">               
                <Button onClick={async () => {
                    const res = await addWalletInDb(walletAddr, walletThreshold as number)
                    if(res) {
                        toast.success("Wallet Added Successfully");
                        setWalletAddr("");
                        setWalletThreshold(undefined);
                    } else {
                        toast.error("Something went wrong");
                    }
                }}>Add Wallet</Button>
            </div> 
        </div>


    </Card>
}
