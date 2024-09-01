import { TransactionDetails } from "../../../components/TransactionDetails";

export default function() {
    return <div className="w-full">
        <div className="text-3xl text-black pt-8 mb-8 font-bold">
            Wallet Transactions
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 p-4">
            <div>
                <TransactionDetails></TransactionDetails>
            </div>
        </div>
    </div>
}