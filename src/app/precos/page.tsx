import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Planos e Preços
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para sua cidade e comece a monitorar seus bueiros de forma inteligente
            </p>
          </div>

          <SubscriptionPlans />

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Dúvidas Frequentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">
                  Como funciona o período de teste?
                </h3>
                <p className="text-gray-600">
                  Você tem 7 dias para testar todas as funcionalidades do plano Profissional, sem compromisso.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">
                  Posso mudar de plano depois?
                </h3>
                <p className="text-gray-600">
                  Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">
                  Preciso de equipamento especial?
                </h3>
                <p className="text-gray-600">
                  Fornecemos todos os sensores e equipamentos necessários, incluídos no valor da assinatura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 