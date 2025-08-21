import React, { useEffect, useMemo, useState } from "react";

/**
 * App principal – Tapeçaria José Antonio (sem automotivo)
 * Galeria consome /api/photos (OAuth Google Photos com shared + debug; fallback estático).
 */

const COMPANY = {
  name: "Tapeçaria José Antonio",
  slogan: "Estofaria e reforma com acabamento de primeira.",
  phoneDisplay: "(11) 99999-9999",
  phoneE164: "5511999999999",
  email: "contato@tapecariajoseantonio.com.br",
  site: "https://www.tapecariajoseantonio.com.br/",
};

const SOCIAL = {
  instagram: "https://www.instagram.com/estofariajoseantonio",
  facebook: "https://www.facebook.com/profile.php?id=100063638346643",
  googlePhotosAlbum:
    "https://photos.google.com/share/AF1QipM6GdjEInGzMSd8tsp_3Md1HtYK-0haxgveakG5b1EDWjy1fBRBiiP0p8HlBfsmjQ?key=d3NVWHhPa3BDcUpMVExqRjNzcDdnR3RMNHdmWVZB",
};

const ADDRESS = {
  line1: "Rua Exemplo, 123",
  city: "São Paulo",
  state: "SP",
  zip: "00000-000",
  mapsIframe:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.7!2d-46.65!3d-23.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTapeçaria%20José%20Antonio!5e0!3m2!1spt-BR!2sBR!4v1690000000000",
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

const PHOTOS_API_ENDPOINT = "/api/photos";

const SERVICES = [
  { title: "Reforma de Sofás", desc: "Troca de espuma, molas, cintas e tecido. Acabamento premium.", icon: "🛋️" },
  { title: "Poltronas e Cadeiras", desc: "Restauração, retrabalho em costura e revestimento sob medida.", icon: "🪑" },
  { title: "Cabeceiras e Painéis", desc: "Projetos sob medida para quartos e salas, com botone e capitonê.", icon: "🧵" },
  { title: "Comercial e Corporativo", desc: "Bancos fixos (booths), estofados para restaurantes, clínicas e escritórios.", icon: "🏢" },
  { title: "Retirada & Entrega", desc: "Logística prática na cidade e região. Consulte cobertura.", icon: "📦" },
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

function useClientGallery() {
  const [photos, setPhotos] = useState<{url:string, alt:string}[] | null>(null);
  const fallback = [
    { url: "https://images.unsplash.com/photo-1582582621952-e0d4ba01f3a5?q=80&w=1600", alt: "Reforma de sofá – antes e depois" },
    { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600", alt: "Estofaria residencial – poltrona" },
    { url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600", alt: "Cadeiras restauradas" },
  ];
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch(`${PHOTOS_API_ENDPOINT}?limit=12`, { headers: { Accept: "application/json" } });
        const data = await res.json();
        if (!aborted) {
          if (Array.isArray(data) && data.length > 0) {
            setPhotos(data);
          } else {
            // ⚠️ Se vier [] ou formato não esperado, usa fallback
            setPhotos(fallback);
          }
        }
      } catch (e) {
        console.warn("API photos falhou; usando fallback.", e);
        if (!aborted) setPhotos(fallback);
      }
    })();
    return () => { aborted = true; };
  }, []);
  // Enquanto carrega, retorna fallback para não deixar UI vazia
  return photos ?? fallback;
}

function Hero() {
  const GALLERY = useClientGallery();
  return (
    <section id="home" className="pt-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center px-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">{COMPANY.slogan}</h1>
          <p className="mt-4 text-lg text-gray-600">
            Tapeçaria e estofaria residencial. Reformamos sofás, poltronas e cadeiras,
            projetos sob medida – sem e-commerce: atendimento personalizado e orçamento
            rápido pelo WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#servicos" className="px-5 py-3 rounded-2xl bg-black text-white font-semibold shadow hover:shadow-md">Ver serviços</a>
            <a
              href={`https://wa.me/${COMPANY.phoneE164}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de um orçamento com retirada/entrega.")}`}
              target="_blank" rel="noreferrer" className="px-5 py-3 rounded-2xl border font-semibold"
            >Pedir orçamento</a>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
            <a className="underline" href={SOCIAL.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="underline" href={SOCIAL.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a className="underline" href={COMPANY.site} target="_blank" rel="noreferrer">Site oficial</a>
          </div>
        </div>
        <div className="relative group">
          <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5">
            <img src={GALLERY[0]?.url} alt={GALLERY[0]?.alt} className="h-full w-full object-cover group-hover:scale-105 transition" loading="lazy" />
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
      <SectionTitle kicker="O que fazemos" title="Serviços de tapeçaria e estofaria" subtitle="Qualidade de fábrica com toque artesanal." />
      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map(s => (
          <div key={s.title} className="border rounded-3xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <div className="text-3xl">{s.icon}</div>
            <h3 className="mt-3 font-bold text-lg">{s.title}</h3>
            <p className="text-gray-600 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mt-8 p-4 rounded-2xl border bg-yellow-50 text-yellow-800">
          <p className="text-sm"><strong>Aviso:</strong> não realizamos serviços automotivos.</p>
        </div>
      </div>
    </section>
  );
}

function GallerySlider() {
  const GALLERY = useClientGallery();
  const [idx, setIdx] = useState(0);
  const total = GALLERY.length;
  const prev = () => setIdx(v => (v - 1 + total) % total);
  const next = () => setIdx(v => (v + 1) % total);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="galeria" className="py-16 bg-gray-50">
      <SectionTitle kicker="Portfólio" title="Antes & Depois, projetos e peças" subtitle="Alguns trabalhos recentes." />
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden ring-1 ring-black/5 shadow">
            <img src={GALLERY[idx]?.url} alt={GALLERY[idx]?.alt} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <button onClick={prev} className="absolute top-1/2 -translate-y-1/2 left-3 md:left-5 p-2 bg-white/90 rounded-full shadow border" aria-label="Anterior">‹</button>
          <button onClick={next} className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 p-2 bg-white/90 rounded-full shadow border" aria-label="Próximo">›</button>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {GALLERY.map((g, i) => (
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
          <a href={SOCIAL.googlePhotosAlbum} target="_blank" rel="noreferrer" className="inline-block px-5 py-3 rounded-2xl border font-semibold">Ver álbum completo</a>
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
              Somos especialistas em tapeçaria e estofaria, com foco em reforma de sofás,
              poltronas e cadeiras. Atendemos residências e empresas, com prazos combinados
              e acabamento cuidadoso.
            </p>
            <ul className="list-disc pl-6 mt-3 text-gray-700">
              <li>Orçamento por foto: envie imagens pelo WhatsApp para agilizar.</li>
              <li>Opções de tecidos, couros e espumas para cada necessidade.</li>
              <li>Retirada e entrega (consulte disponibilidade na sua região).</li>
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
      <SectionTitle kicker="Fale conosco" title="Orçamento rápido" subtitle="Envie fotos do seu estofado para uma estimativa mais precisa." />
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
            <textarea name="message" rows={5} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="Fale um pouco sobre a peça (medidas, tecido desejado, etc.)" />
          </div>
          <button className="mt-2 px-5 py-3 rounded-2xl bg-black text-white font-semibold">Enviar</button>
          <p className="text-xs text-gray-500">Ao enviar você concorda com nosso contato para orçamento.</p>
        </form>
        <div className="grid gap-4">
          <div className="p-6 rounded-3xl border bg-white">
            <h3 className="font-bold text-lg">WhatsApp</h3>
            <p className="text-gray-600 mt-1">Atendimento rápido por mensagem. Envie fotos e medidas.</p>
            <a
              href={`https://wa.me/${COMPANY.phoneE164}?text=${encodeURIComponent("Olá! Gostaria de um orçamento para reforma.")}`}
              target="_blank" rel="noreferrer"
              className="inline-block mt-3 px-5 py-3 rounded-2xl bg-green-600 text-white font-semibold"
            >Falar no WhatsApp</a>
          </div>
          <div className="p-6 rounded-3xl border bg-white">
            <h3 className="font-bold text-lg">Redes sociais</h3>
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
      {/* Ícone leve para evitar SVG gigante */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="Arial, sans-serif">W</text>
      </svg>
    </a>
  );
}

function SeoJsonLd() {
  const gallery = useClientGallery();
  const json = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    url: COMPANY.site,
    telephone: "+" + COMPANY.phoneE164,
    image: gallery[0]?.url,
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
  }), [gallery]);
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
