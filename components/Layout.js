import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "./Nav";
import { useState } from "react";

export default function Layout({ children }) {
  const [showNav,setShowNav] = useState(false)
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="flex bg-blue-900 w-screen h-screen items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen ">
      <div className="block md:hidden">
      <button type="button" onClick={()=>setShowNav(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>
      </button>
      </div>
      <div className="bg-blue-900 min-h-screen flex">
        <Nav show={showNav}/>
        <div className="flex-grow bg-white mr-2 my-2 rounded-lg p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
