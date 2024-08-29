import { Button } from "./button";

interface AppbarProps {
    user? : {
        name? : string | null;
    }
    onSignin : any,
    onSignout : any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b-2 border-b-gray-300 px-4">
        <div className="text-lg flex flex-col justify-center">
            Whale Alert
        </div>
        <div className="flex flex-col justify-center pt-2">
            <Button onClick={user ? onSignout : onSignin} >{user ? "Logout" : "Login"}</Button>
        </div>
    </div>
}