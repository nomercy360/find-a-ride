import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.getAll"]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Hello" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        {hello.data?.map((item) => (
          <div key={item.id.toString()}>{item.title}</div>
        ))}
      </main>
    </>
  );
};

export default Home;