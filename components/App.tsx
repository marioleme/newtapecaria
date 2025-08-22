import React, { useEffect, useMemo, useState } from "react";

/**
 * App principal – Tapeçaria José Antonio (sem automotivo)
 * Galeria agora usa imagens locais da pasta /public/images.
 */

const COMPANY = {
  name: "Tapeçaria José Antonio",
  slogan: "Reforma de sofás e estofados com acabamento de primeira.",
  phoneDisplay: "(11) 9978-7237",
  phoneE164: "551199787237",
  emailDisplay: "contato@tapecariajoseantonio.com.br",
  email: "contato@tapecariajoseantonio.com.br",
  site: "https://www.tapecariajoseantonio.com.br/",
};

const SOCIAL = {
  instagram: "https://www.instagram.com/estofariajoseantonio",
  facebook: "https://www.facebook.com/profile.php?id=100063638346643",
  fullGalleryLink: "https://www.instagram.com/estofariajoseantonio",
};

const ADDRESS = {
  line1: "  Av. Lacerda Franco, 1995",
  city: "São Paulo",
  state: "SP",
  zip: "01536-001",
  mapsIframe:
    "https://www.google.com/maps/embed?pb=!4v1755821772201!6m8!1m7!1sbsWalTytMKvq_tcD6KNlDg!2m2!1d-23.58024439454404!2d-46.62589280714862!3f117.14023!4f0!5f0.7820865974627469",
};

const BUSINESS_HOURS = [
  { d: "Seg", h: "08:00 – 18:00" },
  { d: "Ter", h: "08:00 – 18:00" },
  { d: "Qua", h: "08:00 – 18:00" },
  { d: "Qui", h: "08:00 – 18:00" },
  { d: "Sex", h: "08:00 – 18:00" },
  { d: "Sáb", h: "09:00 – 13:00" },
  { d: "Dom", h: "Fechado" },
];

const LOCAL_GALLERY = [
    { url: "/images/banner-tapecaria-jose-antonio.jpg", alt: "Fachada da Tapeçaria José Antonio, especialista em estofados" },
    { url: "/images/IMG-20241109-WA0063.jpg", alt: "Antes e depois: sofá bege de dois lugares totalmente reformado" },
    { url: "/images/IMG-20241129-WA0030.jpg", alt: "Antes e depois de um sofá-cama com estofado rosa" },
    { url: "/images/IMG-20241205-WA0032.jpg", alt: "Reforma de poltrona giratória: de estampada para um elegante tecido cinza" },
    { url: "/images/IMG-20250204-WA0036.jpg", alt: "Cadeira de jantar com tecido renovado, de floral antigo para moderno" },
    { url: "/images/upload_-1(6).jpg", alt: "Sofá retrátil de couro preto reformado em sala de estar" },
    { url: "/images/upload_-1(8).jpg", alt: "Detalhe de um sofá de couro preto com o revestimento descascado antes da reforma" },
    { url: "/images/p_0137.jpg", alt: "Poltrona chesterfield em couro marrom com assento vermelho, recém-reformada" },
    { url: "/images/upload_-1(2).jpg", alt: "Sofá com capa de tecido floral em uma sala de estar elegante" },
    { url: "/images/p_0150.jpg", alt: "Sofá de três lugares em tecido terracota com detalhes em capitonê" },
    { url: "/images/20140423_121708.jpg", alt: "Par de poltronas com tecido listrado em tons de cinza e branco" },
    { url: "/images/20140224_171105.jpg", alt: "Duas poltronas de recepção em couro vermelho vivo" },
    { url: "/images/upload_-1(7).jpg", alt: "Cadeiras de jantar modernas com estofado de couro marrom prontas" },
    { url: "/images/20140930_122344.jpg", alt: "Cabeceira de cama estofada em tecido claro, feita sob medida" },
    { url: "/images/Foto0186.jpg", alt: "Pufe redondo grande com estofado em couro dourado e detalhes em capitonê" },
    { url: "/images/Foto0252.jpg", alt: "Estrutura de cadeira antiga sendo preparada para receber novo estofado" },
    { url: "/images/20140920_120639.jpg", alt: "Sofá de canto (chaise) em tecido suede bege claro, antes da reforma" },
    { url: "/images/upload_-1(3).jpg", alt: "Namoradeira antiga com estrutura de madeira escura e estofado branco novo" },
    { url: "/images/20140606_113956.jpg", alt: "Cadeiras de design com tiras de tecido amarelo" },
];

const SERVICES = [
  { title: "Reforma de Sofás", desc: "Deixe seu sofá antigo como novo! Trocamos espumas, molas e tecidos para restaurar o conforto e a beleza da sua peça.", icon: "🛋️" },
  { title: "Poltronas e Cadeiras", desc: "Renove suas poltronas e cadeiras favoritas. Cuidamos da restauração completa, com costuras reforçadas e revestimentos que combinam com seu estilo.", icon: "🪑" },
  { title: "Cabeceiras e Painéis", desc: "Crie um ambiente único. Projetamos e fabricamos cabeceiras e painéis sob medida, com acabamentos em botonê e capitonê.", icon: "🧵" },
  { title: "Estofados Comerciais", desc: "Atendemos seu negócio com bancos fixos (booths), estofados para restaurantes, clínicas e escritórios, unindo durabilidade e design.", icon: "🏢" },
  { title: "Acabamentos Detalhados", desc: "A perfeição está nos detalhes. Somos especialistas em botonê e capitonê para um acabamento de luxo em suas peças.", icon: "💎" },
  { title: "Retirada & Entrega", desc: "Oferecemos logística prática para retirar e entregar seu estofado em São Paulo e região. Consulte a cobertura.", icon: "📦" },
];

function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

function SectionTitle({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10">
      {kicker && <p className="uppercase tracking-widest text-sm font-semibold text-gray-500">{kicker}</p>}
      <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-3">{subtitle}</p>}
    </div>
  );
}

function Header() {
  const items = [
    { href: "#servicos", label: "Serviços" },
    { href: "#galeria", label: "Galeria" },
    { href: "#sobre", label: "Sobre" },
    { href: "#contato", label: "Contato" },
  ];
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#home" className="font-extrabold text-lg">{COMPANY.name}</a>
        <nav className="hidden md:flex gap-6">
          {items.map(it => <a key={it.href} href={it.href} className="hover:text-gray-900 text-gray-700">{it.label}</a>)}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`https://wa.me/${COMPANY.phoneE164}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de um orçamento.")}`}
            target="_blank" rel="noreferrer"
            className="px-4 py-2 rounded-2xl bg-green-600 text-white font-semibold shadow hover:shadow-md"
          >WhatsApp</a>
        </div>
        <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={() => setOpen(v => !v)} aria-label="Abrir menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-3">
            {items.map(it => <a key={it.href} href={it.href} className="py-2" onClick={() => setOpen(false)}>{it.label}</a>)}
            <a
              href={`https://wa.me/${COMPANY.phoneE164}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de um orçamento.")}`}
              target="_blank" rel="noreferrer"
              className="px-4 py-2 rounded-2xl bg-green-600 text-white font-semibold text-center"
            >Falar no WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="pt-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center px-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">{COMPANY.slogan}</h1>
          <p className="mt-4 text-lg text-gray-600">
            Somos especialistas em estofaria residencial e comercial. Reformamos seu sofá, poltrona ou cadeira com atendimento personalizado e orçamento rápido pelo WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#servicos" className="px-5 py-3 rounded-2xl bg-black text-white font-semibold shadow hover:shadow-md">Conheça os Serviços</a>
            <a
              href={`https://wa.me/${COMPANY.phoneE164}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de um orçamento com retirada/entrega.")}`}
              target="_blank" rel="noreferrer" className="px-5 py-3 rounded-2xl border font-semibold"
            >Orçamento Rápido no WhatsApp</a>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
            <a className="underline" href={SOCIAL.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="underline" href={SOCIAL.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a className="underline" href={COMPANY.site} target="_blank" rel="noreferrer">Site oficial</a>
          </div>
        </div>
        <div className="relative group">
          <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5">
            <img src={LOCAL_GALLERY[0]?.url} alt={LOCAL_GALLERY[0]?.alt} className="h-full w-full object-cover group-hover:scale-105 transition" loading="lazy" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow p-4 border">
            <p className="text-sm font-semibold">Atendimento rápido</p>
            <p className="text-xs text-gray-600">Retirada e entrega sob consulta</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="py-16">
      <SectionTitle kicker="O que fazemos" title="Serviços de Tapeçaria e Estofaria" subtitle="Qualidade de fábrica com o cuidado artesanal que sua peça merece." />
      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map(s => (
          <div key={s.title} className="border rounded-3xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <div className="text-3xl">{s.icon}</div>
            <h3 className="mt-3 font-bold text-lg">{s.title}</h3>
            <p className="text-gray-600 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

function GallerySlider() {
  const [idx, setIdx] = useState(0);
  const total = LOCAL_GALLERY.length;
  const prev = () => setIdx(v => (v - 1 + total) % total);
  const next = () => setIdx(v => (v + 1) % total);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="galeria" className="py-16 bg-gray-50">
      <SectionTitle kicker="Nosso Portfólio" title="Antes & Depois e Projetos Finalizados" subtitle="Veja a transformação que podemos fazer no seu estofado." />
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden ring-1 ring-black/5 shadow">
            <img src={LOCAL_GALLERY[idx]?.url} alt={LOCAL_GALLERY[idx]?.alt} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <button onClick={prev} className="absolute top-1/2 -translate-y-1/2 left-3 md:left-5 p-2 bg-white/90 rounded-full shadow border" aria-label="Anterior">‹</button>
          <button onClick={next} className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 p-2 bg-white/90 rounded-full shadow border" aria-label="Próximo">›</button>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {LOCAL_GALLERY.map((g, i) => (
            <button
              key={g.url} onClick={() => setIdx(i)}
              className={classNames("shrink-0 w-28 h-20 rounded-xl overflow-hidden border", i === idx ? "ring-2 ring-black" : "opacity-80 hover:opacity-100")}
              aria-label={`Selecionar imagem ${i + 1}`}
            >
              <img src={g.url} alt={g.alt} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href={SOCIAL.fullGalleryLink} target="_blank" rel="noreferrer" className="inline-block px-5 py-3 rounded-2xl border font-semibold">Veja mais trabalhos no Instagram</a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" className="py-16">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <SectionTitle kicker="Quem somos" title={COMPANY.name} subtitle="Tradição, acabamento e materiais de qualidade." />
          <div className="max-w-none">
            <p>
              Com mais de 20 anos de tradição, a Tapeçaria José Antonio une a experiência artesanal com materiais de alta qualidade para renovar seus estofados. Somos especialistas em reforma de sofás, poltronas e cadeiras, atendendo residências e empresas com prazos combinados e acabamento cuidadoso.
            </p>
            <ul className="list-disc pl-6 mt-3 text-gray-700">
              <li>Orçamento por foto: envie imagens pelo WhatsApp para uma avaliação rápida e precisa.</li>
              <li>Ampla variedade de tecidos, couros e espumas para cada necessidade e estilo.</li>
              <li>Serviço de retirada e entrega para sua total comodidade (consulte disponibilidade).</li>
            </ul>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border">
              <p className="text-sm text-gray-500">Endereço</p>
              <p className="font-semibold">{ADDRESS.line1}</p>
              <p className="text-gray-700">{ADDRESS.city} – {ADDRESS.state} • {ADDRESS.zip}</p>
            </div>
            <div className="p-4 rounded-2xl border">
              <p className="text-sm text-gray-500">Contato</p>
              <p className="font-semibold">{COMPANY.phoneDisplay}</p>
              <p className="text-gray-700">{COMPANY.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Horário de atendimento</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {BUSINESS_HOURS.map(h => (
                <div key={h.d} className="p-3 rounded-xl border text-sm flex items-center justify-between gap-4">
                  <span className="font-semibold">{h.d}</span>
                  <span className="text-gray-600">{h.h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-3xl overflow-hidden shadow ring-1 ring-black/5 bg-white">
            <iframe title="Mapa" src={ADDRESS.mapsIframe} width="100%" height="420" loading="lazy" className="block" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const FORMSPREE_ID = "meqwyzkn"; // Troque!
  return (
    <section id="contato" className="py-16 bg-gray-50">
      <SectionTitle kicker="Fale conosco" title="Peça seu Orçamento Grátis" subtitle="Envie fotos do seu estofado para uma estimativa mais precisa e rápida." />
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-start">
        <form action={`https://formspree.io/f/${FORMSPREE_ID}`} method="POST" className="bg-white p-6 rounded-3xl border shadow-sm grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <input name="name" required className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="Seu nome" />
            </div>
            <div>
              <label className="block text-sm font-medium">Telefone</label>
              <input name="phone" className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="(11) 9 0000-0000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="voce@exemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mensagem</label>
            <textarea name="message" rows={5} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="Fale um pouco sobre a peça que deseja reformar (medidas, tipo de tecido, etc.)." />
          </div>
          <button className="mt-2 px-5 py-3 rounded-2xl bg-black text-white font-semibold">Enviar Mensagem</button>
          <p className="text-xs text-gray-500">Seus dados estão seguros. Usaremos apenas para o orçamento.</p>
        </form>
        <div className="grid gap-4">
          <div className="p-6 rounded-3xl border bg-white">
            <h3 className="font-bold text-lg">WhatsApp é Mais Rápido!</h3>
            <p className="text-gray-600 mt-1">Clique no botão, envie as fotos do seu móvel e receba uma prévia do orçamento em poucos minutos.</p>
            <a
              href={`https://wa.me/${COMPANY.phoneE164}?text=${encodeURIComponent("Olá! Gostaria de um orçamento para reforma.")}`}
              target="_blank" rel="noreferrer"
              className="inline-block mt-3 px-5 py-3 rounded-2xl bg-green-600 text-white font-semibold"
            >Falar no WhatsApp</a>
          </div>
          <div className="p-6 rounded-3xl border bg-white">
            <h3 className="font-bold text-lg">Siga nosso Trabalho</h3>
            <p className="text-gray-600 mt-1">Acompanhe nossos últimos projetos e inspire-se nas nossas redes sociais.</p>
            <div className="flex gap-4 mt-2">
              <a className="underline" href={SOCIAL.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a className="underline" href={SOCIAL.facebook} target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <p className="font-bold">{COMPANY.name}</p>
          <p className="text-gray-600 text-sm">{COMPANY.slogan}</p>
        </div>
        <div className="md:text-right text-sm text-gray-600">
          © {year} {COMPANY.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${COMPANY.phoneE164}?text=${encodeURIComponent("Olá! Vim pelo site e quero um orçamento.")}`}
      target="_blank" rel="noreferrer"
      className="fixed bottom-5 right-5 p-4 rounded-full bg-green-600 text-white shadow-2xl ring-1 ring-black/5 hover:scale-105 transition"
      aria-label="WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M19.05 4.94A10.003 10.003 0 0012 2C6.477 2 2 6.477 2 12c0 1.723.44 3.352 1.228 4.795L2 22l5.205-1.228A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10a9.953 9.953 0 00-2.95-7.06zM12 20.25c-1.54 0-2.992-.41-4.242-1.132L12 18.25v-2.5l-2.5-1.5V12l-2-1.25v-1.5L12 8.5v-2.5l2.5 1.5V10l2 1.25v1.5L12 13.5v2.5l4.242.868A8.204 8.204 0 0112 20.25z"/>
      </svg>
    </a>
  );
}

function SeoJsonLd() {
  const json = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    description: "Especialistas em reforma de sofás, poltronas, cadeiras e estofados em geral. Atendimento residencial e comercial em São Paulo.",
    url: COMPANY.site,
    telephone: "+" + COMPANY.phoneE164,
    image: LOCAL_GALLERY[0]?.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.line1,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.state,
      postalCode: ADDRESS.zip,
      addressCountry: "BR",
    },
    openingHoursSpecification: BUSINESS_HOURS.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.d,
      opens: h.h.includes("Fechado") ? undefined : h.h.split(" – ")[0],
      closes: h.h.includes("Fechado") ? undefined : h.h.split(" – ")[1],
    })),
    sameAs: [SOCIAL.instagram, SOCIAL.facebook],
  }), []);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SeoJsonLd />
      <Header />
      <main>
        <Hero />
        <Services />
        <GallerySlider />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
