"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { useEffect, useState } from "react";
import { getWhaleAlertEngineStaus } from "../app/lib/actions/whaleAlert";

export const WhaleAlertEngineStatus = () => {
    const [status, setStatus] = useState<string>("Offline");
    const [click, setClick] = useState<boolean>(false);
    useEffect(() => {
        getWhaleAlertEngineStaus().then((res) => {
          setStatus(res);
        });
      }, [click]);
    const getColorClass = () => {
        if (status.includes('Online')) {
          return 'text-3xl font-bold text-green-500';
        } else if (status.includes('Offline')) {
          return 'text-3xl font-bold text-red-500';
        } else {
          return 'text-3xl font-bold text-black';
        }
    };
    return <Card title="Whale Alert Engine Status">
        <div className="flex justify-left pt-4">
            <div className={getColorClass()}>{status}</div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={() => setClick(!click)}>Refresh status</Button>
        </div>
    </Card>
}