import { AddWallet } from "../../../components/AddWallet";

export default function() {
    return <div className="w-full">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Wallets
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
            <AddWallet></AddWallet>
        </div>
        <div></div>
        </div>
    </div>
}