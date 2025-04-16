"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, RocketIcon } from "lucide-react";

export default function PricingPage() {
  const [annualBilling, setAnnualBilling] = useState(false);
  const [stars, setStars] = useState<{ id: string; top: string; left: string; width: string; height: string; opacity: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  // Gerar estrelas para o fundo
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

  // Função para aplicar desconto anual (2 meses grátis = 16.67% de desconto)
  const applyDiscount = (price: number) => {
    return annualBilling ? Math.round(price * 0.8333 * 100) / 100 : price;
  };

  const plans = [
    {
      name: "Gratuito",
      description: "Recomendado para quem está começando agora.",
      price: 0,
      features: [
        "100% Gratuito",
        "Até 50 Vendas Aprovadas / mês*",
        "1 Conta de Anúncio",
        "1 Webhook",
        "1 Dashboard",
        "1 Pixel de Otimização",
        "Suporte por email",
      ],
      notIncluded: [
        "Trackeamento para WhatsApp**",
        "Regras Programadas",
        "Suporte VIP",
      ],
      footnotes: "* Sem cobranças adicionais\n** Disponível apenas em planos pagos",
      cta: "Começar Agora",
      popular: false,
      ctaLink: "/register",
      color: "from-gray-500 to-gray-700",
      textColor: "text-gray-700",
    },
    {
      name: "Premium",
      description: "Recomendado para quem já possui uma operação.",
      price: 99.9,
      features: [
        "Tudo do plano Gratuito",
        "Até 1.000 Vendas Aprovadas / mês*",
        "3 Contas de Anúncio",
        "3 Webhooks",
        "3 Dashboards",
        "3 Pixels de Otimização",
        "1 Número de WhatsApp**",
        "3 Regras Programadas",
        "Suporte VIP",
      ],
      notIncluded: [],
      footnotes: "* R$0,18 por venda extra aprovada\n** R$ 49,90 por WhatsApp adicional",
      cta: "Escolher Premium",
      popular: true,
      ctaLink: "/register?plan=premium",
      color: "from-blue-600 to-indigo-700",
      textColor: "text-blue-700",
    },
    {
      name: "Avançado",
      description: "Recomendado para quem possui alta escala.",
      price: 199.9,
      features: [
        "Tudo do plano Premium",
        "Até 2.500 Vendas Aprovadas / mês*",
        "7 Contas de Anúncio",
        "7 Webhooks",
        "7 Dashboards",
        "7 Pixels de Otimização",
        "2 Números de WhatsApp**",
        "7 Regras Programadas",
        "Suporte VIP Prioritário",
      ],
      notIncluded: [],
      footnotes: "* R$0,15 por venda extra aprovada\n** R$ 49,90 por WhatsApp adicional",
      cta: "Escolher Avançado",
      popular: false,
      ctaLink: "/register?plan=advanced",
      color: "from-purple-600 to-purple-800",
      textColor: "text-purple-700",
    },
    {
      name: "Monster",
      description: "Recomendado para quem já é um monstro da escala.",
      price: 299.9,
      features: [
        "Tudo do plano Avançado",
        "Até 5.000 Vendas Aprovadas / mês*",
        "Contas de Anúncio ILIMITADAS",
        "Webhooks ILIMITADOS",
        "Dashboards ILIMITADOS",
        "Pixels de Otimização ILIMITADOS",
        "3 Números de WhatsApp**",
        "Regras Programadas ILIMITADAS",
        "Suporte VIP Dedicado",
      ],
      notIncluded: [],
      footnotes: "* R$0,10 por venda extra aprovada\n** R$ 49,90 por WhatsApp adicional",
      cta: "Escolher Monster",
      popular: false,
      ctaLink: "/register?plan=monster",
      color: "from-green-600 to-emerald-700",
      textColor: "text-emerald-700",
    },
  ];

  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20 overflow-hidden">
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

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex flex-col items-center mb-12">
            {/* Animated rocket logo */}
            <div className="relative h-24 w-24 mb-6">
              <div className="flex items-center justify-center h-full w-full relative">
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/20 rounded-full ${mounted ? 'animate-pulse' : ''}`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-500/20 rounded-full ${mounted ? 'animate-pulse' : ''}`} style={{ animationDelay: '1s' }} />

                <RocketIcon
                  className={`text-white h-12 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${mounted ? 'animate-float' : ''}`}
                />

                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-10 bg-gradient-to-t from-orange-500 to-transparent rounded-full ${mounted ? 'animate-flame' : ''}`} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Quatro opções para aumentar suas vendas</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Todos os planos incluem rastreio das vendas em tempo real.
            Escolha o plano que é melhor para você!
          </p>

          {/* Toggle Anual/Mensal */}
          <div className="flex justify-center items-center mt-12 mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-1 rounded-full inline-flex">
              <button
                onClick={() => setAnnualBilling(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !annualBilling
                    ? "bg-white text-blue-900"
                    : "text-blue-100 hover:bg-white/5"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setAnnualBilling(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  annualBilling
                    ? "bg-white text-blue-900"
                    : "text-blue-100 hover:bg-white/5"
                }`}
              >
                Anual <span className="text-xs font-normal ml-1 opacity-80">(-16,67%)</span>
              </button>
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
      </div>

      {/* Pricing Cards */}
      <div className="-mt-5 relative z-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular ? "ring-2 ring-blue-500 ring-offset-2" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-1 font-medium text-sm">
                    Mais vendido
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.textColor}`}>{plan.name}</h3>
                  <p className="text-gray-600 mb-6 min-h-[50px]">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? (
                        "R$0"
                      ) : (
                        <>
                          R${applyDiscount(plan.price).toFixed(2).replace(".", ",")}
                        </>
                      )}
                    </span>
                    <span className="text-gray-500 ml-1">/mês</span>

                    {annualBilling && plan.price > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        Cobrança anual de R${(applyDiscount(plan.price) * 12).toFixed(2).replace(".", ",")}
                      </div>
                    )}
                  </div>

                  <Link
                    href={plan.ctaLink}
                    className={`bg-gradient-to-r ${plan.color} text-white rounded-full py-3 px-6 w-full block text-center font-medium transition-all hover:opacity-90`}
                  >
                    {plan.cta}
                  </Link>
                </div>

                <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-4">O que está incluído:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={`${plan.name}-feature-${feature}`} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-medium text-gray-900 mt-8 mb-4">Não incluso:</h4>
                      <ul className="space-y-3">
                        {plan.notIncluded.map((feature) => (
                          <li key={`${plan.name}-not-included-${feature}`} className="flex items-start">
                            <span className="h-5 w-5 text-gray-400 flex-shrink-0 mr-2">—</span>
                            <span className="text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {plan.footnotes && (
                    <div className="mt-8 text-xs text-gray-500 whitespace-pre-line">
                      {plan.footnotes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Garantia Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-none md:rounded-2xl max-w-6xl mx-auto my-20 overflow-hidden relative">
        {/* Star background in guarantee section */}
        <div className="absolute inset-0 opacity-50">
          {stars.slice(0, 20).map((star) => (
            <div
              key={`guarantee-${star.id}`}
              className="star absolute bg-white rounded-full"
              style={{
                top: star.top,
                left: star.left,
                width: star.width,
                height: star.height,
                opacity: star.opacity * 0.7,
              }}
            />
          ))}
        </div>
        <div className="flex flex-col md:flex-row relative z-10">
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center md:items-start order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-medium text-center md:text-left">
              Ainda na dúvida?
              <br className="md:hidden" />
              Você tem 7 dias de garantia!
            </h3>
            <p className="mt-4 text-blue-100 text-center md:text-left">
              Se não estiver satisfeito com a plataforma você pode pedir reembolso em até 7 dias.
            </p>
            <button className="bg-white text-blue-800 hover:bg-blue-50 mt-6 px-8 py-3 rounded-full text-lg font-medium">
              Escolher plano
            </button>
          </div>
          <div className="md:w-1/2 bg-blue-800/30 p-8 lg:p-12 flex justify-center items-center order-1 md:order-2">
            <img
              src="/images/landing/free-trial-utmify.svg"
              alt="Garantia de 7 dias"
              className="object-contain max-w-full h-auto"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Ficou com alguma dúvida?</h2>
        <p className="text-center mb-12 text-gray-600">Dê uma olhada nas perguntas mais frequentes abaixo:</p>

        <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Quais plataformas estão disponíveis para integração?
              </h3>
              <div className="text-gray-600">
                <p className="mb-2">
                  Atualmente oferecemos integração com o Meta Ads, Kiwify, IExperience, PerfectPay,
                  Hotmart, Eduzz, Kirvano, Vega, Pepper, Monetizze e muitas outras plataformas
                  populares do mercado.
                </p>
                <p>
                  Se precisar de uma integração específica, entre em contato conosco para que
                  possamos priorizar a integração dessa plataforma.
                </p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Vendas recusadas ou reembolsadas também consomem limite?
              </h3>
              <div className="text-gray-600">
                <p>
                  Não. Se uma venda for recusada, reembolsada ou sofrer chargeback no período
                  de cobrança, ela não será contabilizada no limite de vendas do seu plano.
                  Contamos apenas as vendas aprovadas.
                </p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                É muito difícil configurar a integração?
              </h3>
              <div className="text-gray-600">
                <p>
                  Não, é muito fácil! O processo de integração foi projetado para ser extremamente
                  simples e intuitivo. Basta seguir o passo a passo disponibilizado que você irá
                  terminar em menos de 5 minutos.
                </p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                E se um dia eu não precisar mais da plataforma?
              </h3>
              <div className="text-gray-600">
                <p>
                  Sem problemas! Se um dia nossa plataforma não fizer mais sentido para a sua
                  situação, você pode cancelar a qualquer momento, sem multas ou taxas adicionais.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Não encontrei minha dúvida aqui, o que fazer?
              </h3>
              <div className="text-gray-600">
                <p>
                  Estamos aqui para ajudar! Entre em contato conosco pelo WhatsApp (24) 99310-5374
                  e iremos te ajudar com qualquer dúvida que você tenha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-24 text-center relative overflow-hidden">
        {/* Star background in CTA section */}
        <div className="absolute inset-0">
          {stars.slice(20, 40).map((star) => (
            <div
              key={`cta-${star.id}`}
              className="star absolute bg-white rounded-full"
              style={{
                top: star.top,
                left: star.left,
                width: star.width,
                height: star.height,
                opacity: star.opacity * 0.7,
              }}
            />
          ))}
        </div>

        {/* Decorative planet shape */}
        <div className="absolute top-[20%] right-[10%] w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-700 opacity-20 blur-md" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-6">Comece a escalar seu negócio hoje mesmo!</h2>
          <p className="mb-10 max-w-2xl mx-auto text-xl text-blue-100">
            Escolha o plano ideal para o seu momento e transforme a forma como você gerencia e amplia sua operação.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-900 hover:bg-blue-50 px-10 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 inline-block"
          >
            Testar gratuitamente por 7 dias
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
            0%, 100% { height: 10px; opacity: 0.8; }
            50% { height: 14px; opacity: 1; }
          }

          .animate-flame {
            animation: flame 0.5s ease-in-out infinite;
          }
        `}</style>
      )}
    </main>
  );
}
