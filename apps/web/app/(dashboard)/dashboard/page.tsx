import { WhaleAlertEngineStatus } from "../../../components/WhaleAlertEngineStatus";

export default function() {
    return <div className="w-full">
        <div className="text-3xl text-black pt-8 mb-8 font-bold">
            Dashboard
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div className="w-full">
                <WhaleAlertEngineStatus></WhaleAlertEngineStatus>
            </div>
        </div>
    </div>
}