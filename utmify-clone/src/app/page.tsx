"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RocketIcon, ChevronDown, CheckCircle, Clock, Target, Zap, BarChart2, Send, Layout, Bell, Shield, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import LogoCarousel from "@/components/LogoCarousel";
import "./animations.css";

export default function Home() {
  // Gerar estrelas com IDs únicos durante a renderização no cliente
  const [stars, setStars] = useState<{ id: string; top: string; left: string; width: string; height: string; opacity: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    // Apenas gerar estrelas e ativar animações após a montagem completa no cliente
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
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

  // Componente de hero section que só renderiza elementos animados após a montagem completa
  const HeroSection = () => (
    <div className="relative bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white py-32 overflow-hidden">
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
        <div className="absolute top-[15%] left-[10%] w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 opacity-20 blur-md" />
        <div className="absolute bottom-[10%] right-[15%] w-60 h-60 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 opacity-20 blur-md" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0 animate-slide-up">
              <div className="flex items-center justify-center lg:justify-start mb-8">
                <img
                  src="/logo/rocket-logo.svg"
                  alt="Bueiro Digital logo"
                  className="h-28 w-auto animate-float hover-glow"
                  crossOrigin="anonymous"
                />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{animationDelay: '0.3s'}}>
                Rastreie suas vendas <br />
                <span className="gradient-text bg-clip-text">e aumente seu lucro em até 40%</span>
              </h1>
              <p className="text-xl text-blue-100 mb-10 max-w-xl">
                Transforme seu modo de escalar, sem medo de errar,
                <br className="hidden lg:block" /> com nossa plataforma de rastreamento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{animationDelay: '0.6s'}}>
                <Link href="/register" className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-4 rounded-full font-medium text-lg transition-all hover-scale hover-glow flex items-center">
                  <span>Testar gratuitamente</span>
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  Testar gratuitamente
                </Link>
                <Link href="#features" className="bg-transparent border border-white/30 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-4 rounded-full font-medium text-lg flex items-center justify-center group">
                  Saiba mais
                  <ChevronDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="relative h-96 w-96">
                  <div className="flex items-center justify-center h-full w-full relative">
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full ${mounted ? 'animate-pulse' : ''}`} />
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full ${mounted ? 'animate-pulse' : ''}`} style={{ animationDelay: '1s' }} />

                    <RocketIcon
                      className={`text-white h-40 w-40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${mounted ? 'animate-float' : ''}`}
                    />

                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-28 bg-gradient-to-t from-orange-500 to-transparent rounded-full ${mounted ? 'animate-flame' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#fff">
            <path d="M0,96L60,85.3C120,75,240,53,360,58.7C480,64,600,96,720,96C840,96,960,64,1080,53.3C1200,43,1320,53,1380,58.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z">
            </path>
          </svg>
        </div>
      </>
    </div>
  );

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section como componente separado */}
      <HeroSection />

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Principais Recursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{perspective: '1000px'}}>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-all hover-lift hover-glow animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="bg-blue-100 h-16 w-16 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Não tenha medo de escalar</h3>
            <p className="text-gray-600">
              Saiba exatamente quantas vendas cada campanha teve e escale as campanhas certas sem medo de errar.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-all hover-lift hover-glow animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="bg-blue-100 h-16 w-16 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Economize seu tempo</h3>
            <p className="text-gray-600">
              Escale ou desative suas campanhas direto pelo relatório, sem precisar perder tempo abrindo o Gerenciador do Facebook.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-all hover-lift hover-glow animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="bg-blue-100 h-16 w-16 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Para Tráfego Direto</h3>
            <p className="text-gray-600">
              Criada por infoprodutores, a Bueiro Digital é a solução perfeita para quem trabalha com tráfego direto e precisa escalar com precisão.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-none md:rounded-2xl max-w-6xl mx-auto my-20 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center md:items-start order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-medium text-center md:text-left">
              Ainda na dúvida?
              <br className="md:hidden" />
              Você tem 7 dias de garantia!
            </h3>
            <p className="mt-4 text-blue-100 text-center md:text-left">
              Se não estiver satisfeito com a plataforma você pode pedir reembolso em até 7 dias.
            </p>
            <Link href="/precos" className="bg-white text-blue-800 hover:bg-blue-50 mt-6 px-8 py-3 rounded-full text-lg font-medium">
              Escolher plano
            </Link>
          </div>
          <div className="md:w-1/2 bg-blue-800/30 p-8 lg:p-12 flex justify-center items-center order-1 md:order-2">
            <img
              src="https://ext.same-assets.com/1066365303/1249628806.svg"
              alt="Garantia de 7 dias"
              className="w-64 lg:w-72"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Image Section */}
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 pr-0 md:pr-8 mb-12 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Dashboard inteligente</h2>
          <p className="mb-6 text-gray-600 text-lg">
            Obtenha uma visão completa e intuitiva de todas as métricas da sua operação,
            com um dashboard minimalista e eficiente.
          </p>
          <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full inline-block transform transition hover:scale-105">
            Testar gratuitamente
          </Link>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://ext.same-assets.com/1066365303/2476789674.png"
            alt="Dashboard Bueiro Digital"
            className="rounded-xl shadow-lg w-full hover:shadow-xl transition-shadow"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Otimização Rápida Section */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2">
            <img
              src="https://ext.same-assets.com/1066365303/1203701436.png"
              alt="Otimização Rápida"
              className="rounded-xl shadow-lg w-full hover:shadow-xl transition-shadow"
              crossOrigin="anonymous"
            />
          </div>
          <div className="md:w-1/2 pl-0 md:pl-12 mb-12 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Otimização rápida</h2>
            <p className="mb-6 text-gray-600 text-lg">
              Saiba exatamente quantas vendas cada campanha teve e já faça as otimizações
              pelo próprio relatório, sem precisar abrir o Facebook.
            </p>
            <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full inline-block transform transition hover:scale-105">
              Testar gratuitamente
            </Link>
          </div>
        </div>
      </div>

      {/* Múltiplos Dashboards */}
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 pr-0 md:pr-12 mb-12 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Múltiplos Dashboards</h2>
          <p className="mb-6 text-gray-600 text-lg">
            Utilize múltiplos dashboards para organizar as métricas da operação
            do <strong>seu jeito</strong>, seja criando um dashboard para cada produto,
            seja da forma que achar melhor. <strong>É você</strong> quem manda.
          </p>
          <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full inline-block transform transition hover:scale-105">
            Testar gratuitamente
          </Link>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://ext.same-assets.com/1066365303/3662336286.svg"
            alt="Múltiplos Dashboards"
            className="rounded-xl shadow-lg w-full hover:shadow-xl transition-shadow"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* WhatsApp Integration */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2">
            <div className="max-w-md mx-auto md:mx-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium">Bueiro Digital</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 p-3 rounded-lg rounded-tl-none max-w-xs">
                  Olá! Como posso ajudar com seu rastreamento hoje?
                </div>
                <div className="bg-white/20 p-3 rounded-lg rounded-tr-none max-w-xs ml-auto">
                  Preciso integrar com a plataforma X.
                </div>
                <div className="bg-white/10 p-3 rounded-lg rounded-tl-none max-w-xs">
                  Claro! Vou te ajudar com esse processo. É bem simples...
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 pl-0 md:pl-12 mb-12 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Integração com o WhatsApp</h2>
            <p className="mb-6 text-gray-600 text-lg">
              Aumente suas conversões com um atendimento mais ágil e personalizado.
              Leve seus leads diretamente para onde a venda acontece.
            </p>
            <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full inline-block transform transition hover:scale-105">
              Testar gratuitamente
            </Link>
          </div>
        </div>
      </div>

      {/* Regras Automatizadas */}
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 pr-0 md:pr-12 mb-12 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Regras automatizadas</h2>
          <p className="mb-6 text-gray-600 text-lg">
            Crie regras para otimizar suas campanhas de forma automática e não
            fique preso ao computador. Defina condições e ações para que o sistema
            trabalhe por você.
          </p>
          <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full inline-block transform transition hover:scale-105">
            Testar gratuitamente
          </Link>
        </div>
        <div className="md:w-1/2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="font-medium text-lg mb-4 border-b pb-2">Configurar nova regra</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da regra</label>
                <div className="border rounded-md p-2 bg-gray-50">Pausar campanhas com ROAS baixo</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condição</label>
                <div className="border rounded-md p-2 bg-gray-50">ROAS &lt; 1 por 2 dias consecutivos</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
                <div className="border rounded-md p-2 bg-gray-50">Pausar campanha</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notificação</label>
                <div className="border rounded-md p-2 bg-gray-50">Enviar e-mail e WhatsApp</div>
              </div>
              <div className="pt-2">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">Salvar regra</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-center mb-4">Integramos com as melhores plataformas do mercado!</h2>
            <p className="text-gray-600 text-lg">
              O Bueiro Digital se conecta com as principais plataformas de pagamento, marketplaces e ferramentas de marketing,
              permitindo que você tenha uma visão completa do seu negócio em um só lugar.
            </p>
          </div>

          {/* Logo Carousel */}
          <LogoCarousel
            logos={[
              { src: "/assets/eduzz-logo.png", alt: "Eduzz" },
              { src: "/assets/lastlink-logo.png", alt: "Lastlink" },
              { src: "/assets/greenn-logo.png", alt: "Greenn" },
              { src: "/assets/zouti-logo.png", alt: "Zouti" },
              { src: "/assets/hotmart-logo.png", alt: "Hotmart" },
              { src: "/assets/digistore-logo.png", alt: "Digistore" },
              { src: "/assets/wegate-logo.png", alt: "WeGate" },
              { src: "/assets/kiwify-logo.png", alt: "Kiwify" },
              { src: "/assets/perfectpay-logo.png", alt: "PerfectPay" },
              { src: "/assets/monetizze-logo.png", alt: "Monetizze" },
              { src: "/assets/kirvano-logo.png", alt: "Kirvano" },
              { src: "/assets/systeme-logo.png", alt: "Systeme" },
              { src: "/assets/guru-logo.png", alt: "Guru" },
              { src: "/assets/shopify-logo.png", alt: "Shopify" },
              { src: "/assets/iexperience-logo.png", alt: "IExperience" },
              { src: "/assets/doppus-logo.png", alt: "Doppus" },
              { src: "/assets/adoorei-logo.png", alt: "Adoorei" },
              { src: "/assets/octuspay-logo.png", alt: "OctusPay" },
              { src: "/assets/pmhmpay-logo.png", alt: "PMHMPay" },
              { src: "/assets/inovapag-logo.png", alt: "InovaPag" },
            ]}
            className="mb-10"
            speed={25}
          />

          <div className="text-center mt-8">
            <Link href="/integracoes" className="text-blue-600 font-medium hover:underline text-lg inline-flex items-center gap-1">
              Ver todas as integrações
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Ficou com alguma dúvida?</h2>
        <p className="text-center mb-12 text-gray-600">Dê uma olhada nas perguntas mais frequentes abaixo:</p>

        <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium">
                Quais plataformas estão disponíveis para integração?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Atualmente oferecemos integração com o Meta Ads, Kiwify, IExperience, PerfectPay, Doppus, Orbita,
                  Hotmart, Eduzz, Kirvano, Vega, Pepper, Ticto, Monetizze, Payt, Zippify, Guru, Greenn, Yampi, Adoorei,
                  Braip, BuyGoods, OctusPay, Appmax, Cartpanda, TriboPay, Woocommerce, Lastlink, Hubla, Digistore, Logzz,
                  MundPay, Clickbank, StrivPay, Systeme, Disrupty, Pantherfy, CinqPay, Zouti, NitroPagamentos, SoutPay,
                  Maxweb, Frendz, FortPay, Shopify, PagTrust, WolfPay, BullPay, FluxionPay, Hebreus, VittaPay, InovaPag,
                  WeGate, PMHMPay e GoatPay.
                </p>
                <p className="mb-2">Em breve teremos e Ativopay.</p>
                <p>
                  Se precisar de outra específica, entre em contato conosco para que possamos priorizar a integração dessa plataforma.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium">
                Vendas recusadas ou reembolsadas também consomem limite?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Não. Se uma venda for recusada, reembolsada ou sofrer chargeback no período de cobrança,
                  ela não será contabilizada no limite de vendas do seu plano. Contamos apenas as vendas aprovadas.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-medium">
                É muito difícil configurar a integração?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Não, é muito fácil! O processo de integração foi projetado para ser extremamente simples e fácil.
                  Basta seguir o passo a passo disponibilzado que você irá terminar em menos de 5 minutos.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-medium">
                E se um dia eu não precisar mais da plataforma?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Sem problemas! Se um dia nossa plataforma não fizer mais sentido para a sua situação,
                  você pode cancelar a qualquer momento, sem multas ou taxas adicionais.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-medium">
                A plataforma terá acesso aos meus criativos?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Não. A plataforma não usa os criativos para nada, apenas os dados de identificação da campanha
                  necessários para rastrear as vendas. Pode ficar tranquilo que seus criativos estão seguros.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left font-medium">
                Não encontrei minha dúvida aqui, o que fazer?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Sem problemas, estamos aqui para te ajudar! Entre em contato conosco pelo WhatsApp (24) 99310-5374
                  e iremos te ajudar com qualquer dúvida que você tenha.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Nunca mais tenha medo de escalar!</h2>
          <p className="mb-10 max-w-2xl mx-auto text-xl text-blue-100">
            Uma plataforma minimalista que transforma a escala em uma tarefa simples e segura.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-900 hover:bg-blue-50 px-10 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 inline-block"
          >
            Testar gratuitamente
          </Link>
        </div>
      </div>

      <Footer />

      {/* Custom CSS para animações que só serão aplicadas quando o componente estiver montado */}
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

          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          @keyframes flame {
            0%, 100% { height: 20px; opacity: 0.8; }
            50% { height: 30px; opacity: 1; }
          }

          .animate-flame {
            animation: flame 0.5s ease-in-out infinite;
          }
        `}</style>
      )}
    </main>
  );
}
