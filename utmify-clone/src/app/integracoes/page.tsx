"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Definição dos tipos
interface Platform {
  id: number;
  name: string;
  imgUrl: string;
  category: string[];
  popular: boolean;
}

interface CategoryType {
  id: string;
  name: string;
}

// Função para gerar cores baseadas no nome da plataforma
const generateColors = (name: string) => {
  // Cores predefinidas para plataformas populares para maior consistência visual
  const predefinedColors: Record<string, {from: string, to: string}> = {
    "Lastlink": {from: "hsl(160, 70%, 60%)", to: "hsl(180, 70%, 50%)"},
    "Greenn": {from: "hsl(170, 70%, 60%)", to: "hsl(190, 70%, 50%)"},
    "WeGate": {from: "hsl(35, 70%, 60%)", to: "hsl(25, 70%, 50%)"},
    "PerfectPay": {from: "hsl(220, 70%, 60%)", to: "hsl(240, 70%, 50%)"},
    "Monetizze": {from: "hsl(340, 70%, 60%)", to: "hsl(320, 70%, 50%)"},
    "Shopify": {from: "hsl(145, 70%, 40%)", to: "hsl(145, 70%, 30%)"},
    "Kirvano": {from: "hsl(280, 70%, 60%)", to: "hsl(300, 70%, 50%)"},
    "Guru": {from: "hsl(200, 70%, 60%)", to: "hsl(220, 70%, 50%)"},
    "IExperience": {from: "hsl(260, 70%, 60%)", to: "hsl(280, 70%, 50%)"},
    "Doppus": {from: "hsl(190, 70%, 60%)", to: "hsl(210, 70%, 50%)"},
    "VittaPay": {from: "hsl(30, 70%, 60%)", to: "hsl(50, 70%, 50%)"},
    "Appmax": {from: "hsl(10, 70%, 60%)", to: "hsl(30, 70%, 50%)"},
    "TriboPay": {from: "hsl(120, 70%, 60%)", to: "hsl(140, 70%, 50%)"},
    "Woocommerce": {from: "hsl(270, 70%, 60%)", to: "hsl(290, 70%, 50%)"},
  };

  // Se a plataforma tem uma cor predefinida, use-a
  if (predefinedColors[name]) {
    return predefinedColors[name];
  }

  // Caso contrário, gera uma cor baseada no nome
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 1.5) % 360;

  return {
    from: `hsl(${hue1}, 70%, 60%)`,
    to: `hsl(${hue2}, 70%, 50%)`
  };
};

// Definição das categorias de integração
const categories: CategoryType[] = [
  { id: "all", name: "Todas" },
  { id: "gateways", name: "Gateways de Pagamento" },
  { id: "marketplaces", name: "Marketplaces" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "crm", name: "CRM e Automação" },
];

// Lista de plataformas integradas
const platforms: Platform[] = [
  {
    id: 1,
    name: "PerfectPay",
    imgUrl: "/assets/perfectpay-logo.png",
    category: ["gateways"],
    popular: true,
  },
  {
    id: 2,
    name: "Kiwify",
    imgUrl: "/assets/kiwify-logo.png",
    category: ["gateways"],
    popular: true,
  },
  {
    id: 3,
    name: "Hotmart",
    imgUrl: "/assets/hotmart-logo.png",
    category: ["marketplaces"],
    popular: true,
  },
  {
    id: 4,
    name: "Eduzz",
    imgUrl: "/assets/eduzz-logo.png",
    category: ["marketplaces"],
    popular: false,
  },
  {
    id: 5,
    name: "Monetizze",
    imgUrl: "/assets/monetizze-logo.png",
    category: ["marketplaces"],
    popular: false,
  },
  {
    id: 6,
    name: "Shopify",
    imgUrl: "/assets/shopify-logo.png",
    category: ["ecommerce"],
    popular: true,
  },
  {
    id: 7,
    name: "Kirvano",
    imgUrl: "/assets/kirvano-logo.png",
    category: ["gateways"],
    popular: true,
  },
  {
    id: 8,
    name: "Guru",
    imgUrl: "/assets/guru-logo.png",
    category: ["crm"],
    popular: true,
  },
  {
    id: 9,
    name: "IExperience",
    imgUrl: "/assets/iexperience-logo.png",
    category: ["crm"],
    popular: true,
  },
  {
    id: 10,
    name: "Doppus",
    imgUrl: "/assets/doppus-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 11,
    name: "VittaPay",
    imgUrl: "/assets/vittapay-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 12,
    name: "Lastlink",
    imgUrl: "/assets/lastlink-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 13,
    name: "Greenn",
    imgUrl: "/assets/greenn-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 14,
    name: "Zouti",
    imgUrl: "/assets/zouti-logo.png",
    category: ["crm"],
    popular: false,
  },
  {
    id: 15,
    name: "Appmax",
    imgUrl: "/assets/appmax-logo.png",
    category: ["ecommerce"],
    popular: false,
  },
  {
    id: 16,
    name: "TriboPay",
    imgUrl: "/assets/tribopay-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 17,
    name: "WeGate",
    imgUrl: "/assets/wegate-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 18,
    name: "Woocommerce",
    imgUrl: "/assets/woocommerce-logo.png",
    category: ["ecommerce"],
    popular: false,
  },
  {
    id: 19,
    name: "Digistore",
    imgUrl: "/assets/digistore-logo.png",
    category: ["marketplaces"],
    popular: false,
  },
  {
    id: 20,
    name: "Clickbank",
    imgUrl: "/assets/clickbank-logo.png",
    category: ["marketplaces"],
    popular: false,
  },
  {
    id: 21,
    name: "Adoorei",
    imgUrl: "/assets/adoorei-logo.png",
    category: ["ecommerce"],
    popular: false,
  },
  {
    id: 22,
    name: "OctusPay",
    imgUrl: "/assets/octuspay-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 23,
    name: "PMHMPay",
    imgUrl: "/assets/pmhmpay-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 24,
    name: "BuyGoods",
    imgUrl: "/assets/buygoods-logo.png",
    category: ["marketplaces"],
    popular: false,
  },
  {
    id: 25,
    name: "Systeme",
    imgUrl: "/assets/systeme-logo.png",
    category: ["marketplaces"],
    popular: true,
  },
  {
    id: 26,
    name: "Pepper",
    imgUrl: "/assets/pepper-logo.png",
    category: ["marketplaces"],
    popular: false,
  },
  {
    id: 27,
    name: "Payt",
    imgUrl: "/assets/payt-logo.png",
    category: ["gateways"],
    popular: false,
  },
  {
    id: 28,
    name: "InovaPag",
    imgUrl: "/assets/inovapag-logo.png",
    category: ["gateways"],
    popular: false,
  },
];

// Componente de Card da Plataforma
const PlatformCard = ({ platform }: { platform: Platform }) => {
  const colors = generateColors(platform.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex flex-col items-center">
        <div className="h-16 flex items-center justify-center mb-6">
          {platform.imgUrl ? (
            <div className="bg-white p-2 rounded-md w-full h-full flex items-center justify-center">
              <img
                src={platform.imgUrl}
                alt={platform.name}
                className="h-12 max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div
              className="h-12 w-36 rounded-md flex items-center justify-center text-white font-semibold"
              style={{ background: `linear-gradient(to right, ${colors.from}, ${colors.to})` }}
            >
              {platform.name}
            </div>
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
        {platform.popular && (
          <span className="mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Popular</span>
        )}
      </div>
    </motion.div>
  );
};

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<{ id: string; top: string; left: string; width: string; height: string; opacity: number }[]>([]);

  // Efeito para geração de estrelas e definir montagem
  useEffect(() => {
    // Gerar estrelas aleatórias para o background
    const generatedStars = Array.from({ length: 30 }).map((_, i) => ({
      id: `star-${i}-${Math.random()}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.7 + 0.3
    }));

    setStars(generatedStars);
    setMounted(true);
  }, []);

  // Filtra as plataformas com base na categoria e na pesquisa
  const filteredPlatforms = platforms.filter(platform => {
    const matchesCategory = activeCategory === "all" || platform.category.includes(activeCategory);
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Separar plataformas populares para destaque
  const popularPlatforms = platforms.filter(p => p.popular);

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Navbar />

      {/* Hero Section com tema espacial */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white py-20 overflow-hidden">
        {/* Animações só aparecem depois que o componente está montado no cliente */}
        {mounted && (
          <>
            {/* Animated stars in background */}
            <div className="absolute inset-0">
              {stars.map((star) => (
                <div
                  key={star.id}
                  className="star absolute bg-white rounded-full"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: star.width,
                    height: star.height,
                    opacity: star.opacity,
                  }}
                />
              ))}
            </div>

            {/* Decorative planet shapes */}
            <div className="absolute top-[15%] left-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 opacity-20 blur-md" />
            <div className="absolute bottom-[10%] right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 opacity-20 blur-md" />
          </>
        )}

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Centralize suas ferramentas</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Aumente sua produtividade reunindo seus dados em um só lugar.
          </p>

          {/* Destacar algumas plataformas no topo */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {popularPlatforms.slice(0, 6).map((platform) => (
              <div key={platform.id} className="flex justify-center">
                {platform.imgUrl ? (
                  <div className="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow w-40 h-20 flex items-center justify-center">
                    <img
                      src={platform.imgUrl}
                      alt={platform.name}
                      className="h-12 max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="h-20 w-40 rounded-md flex items-center justify-center text-white font-semibold shadow-sm hover:shadow-md transition-shadow"
                    style={{ background: `linear-gradient(to right, ${generateColors(platform.name).from}, ${generateColors(platform.name).to})` }}
                  >
                    {platform.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#fff">
            <path d="M0,96L60,85.3C120,75,240,53,360,58.7C480,64,600,96,720,96C840,96,960,64,1080,53.3C1200,43,1320,53,1380,58.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z">
            </path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Plataformas disponíveis hoje</h2>

          {/* Filtros e Pesquisa */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-colors`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar plataforma..."
                className="w-full px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Grid de plataformas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredPlatforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>

          {/* Mensagem quando nenhuma plataforma for encontrada */}
          {filteredPlatforms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhuma plataforma encontrada com esses critérios.</p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Em breve */}
        <div className="text-center my-12">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Em breve integraremos com mais plataformas</h3>
          <p className="text-gray-600">
            Não encontrou a plataforma que precisa? Entre em contato conosco e podemos priorizar sua integração.
          </p>
          <a
            href="https://wa.me/5524992281288?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20integrações%20do%20Bueiro%20Digital!"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Falar com um especialista
          </a>
        </div>
      </div>

      {/* Custom CSS para as animações de estrelas */}
      {mounted && (
        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }

          .star {
            animation: twinkle linear infinite;
            animation-duration: calc(5s + (var(--i, 0) * 0.5s));
          }
        `}</style>
      )}

      <Footer />
    </main>
  );
}
