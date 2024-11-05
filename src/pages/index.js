import HomeBody from "@/component/index/Body";
import Navbar from "@/component/Navbar";
import Head from "next/head";


export default function Home() {
  return (<>
    <Head>
      <title>Study Jams Progress Tracker</title>
      <meta name="description" content="Study Jams Progress Tracker" />
    </Head>

    <Navbar />
    <HomeBody />

  </>);
}
