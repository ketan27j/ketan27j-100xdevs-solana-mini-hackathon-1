"use server";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

export async function getWhaleAlertEngineStaus(): Promise<string> {
    try {
        const res = await axios.get(process.env.WHALE_ALERT_ENGINE_URL || "http://localhost:3003/status")
        if (res.status === 200 && res.data.message === "Ok") {
            return 'Online';
        } else {
            return 'Offline';
        }
    } catch(error) {
        console.log(error);
        return 'Offline';
    }
};