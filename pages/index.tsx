import Head from "next/head";
import App from "@/components/App";

export default function Home() {
  const companyName = "Tapeçaria José Antonio";
  const description = "Reforma de sofás, poltronas e cadeiras em São Paulo, SP. Orçamento rápido por WhatsApp. Especialistas em estofaria residencial e comercial com acabamento de primeira.";

  return (
    <>
      <Head>
        <title>{`${companyName} | Reforma de Sofás e Estofados em SP`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="tapeçaria, estofaria, reforma de sofá, reforma de poltrona, são paulo, sp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Tags para Redes Sociais (Open Graph) */}
        <meta property="og:title" content={`${companyName} | Reforma de Sofás e Estofados`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/images/banner-tapecaria-jose-antonio.jpg" />
        <meta property="og:type" content="website" />
        
        {/* Tailwind via CDN para agilizar */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <App />
    </>
  );
} 