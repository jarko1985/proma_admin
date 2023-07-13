import { useSession } from "next-auth/react";
export default function UserInfo(){
    const {data:session} = useSession();
    return(
        <>
        <div className="text-blue-900 flex justify-between">
        <h2>
        Hello <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black gap-2 p-2 rounded-sm">
        <img src={session?.user?.image} alt="user Image" className="h-8 w-8 rounded-full"/>
        <span>{session?.user?.email}</span>
        </div>
      </div>
      </>
    )
}