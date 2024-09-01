import { AddWallet } from "../../../components/AddWallet";
import { WalletDetails } from "../../../components/WalletDetails";

export default function() {
    return <div className="w-full">
        <div className="text-3xl text-black pt-8 mb-8 font-bold">
            Wallets
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 p-4">
        <div>
            <AddWallet></AddWallet>
        </div>
        <div>
            <WalletDetails></WalletDetails>
        </div>
        <div></div>
        </div>
    </div>
}