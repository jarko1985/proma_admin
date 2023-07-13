import HomeStats from "@/components/HomeStats";
import Layout from "@/components/Layout";
import UserInfo from "@/components/UserInfo";
import { useSession } from "next-auth/react";


export default function Home() {
  const {data:session} = useSession();
  return(
    <Layout>
     <UserInfo/>
     <HomeStats/>
    </Layout>
  )
}
