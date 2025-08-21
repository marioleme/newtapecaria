import Head from "next/head";
import App from "@/components/App";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tapeçaria José Antonio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Tailwind via CDN para agilizar */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <App />
    </>
  );
}
