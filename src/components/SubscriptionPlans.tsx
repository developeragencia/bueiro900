'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: {
      credit: 299.90,
      pix: 279.90
    },
    features: [
      'Até 10 bueiros monitorados',
      'Alertas básicos',
      'Relatórios mensais',
      'Suporte por email'
    ]
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: {
      credit: 599.90,
      pix: 569.90
    },
    features: [
      'Até 50 bueiros monitorados',
      'Alertas em tempo real',
      'Relatórios semanais',
      'Suporte prioritário',
      'Dashboard personalizado',
      'API de integração'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: {
      credit: 999.90,
      pix: 949.90
    },
    features: [
      'Bueiros ilimitados',
      'Sistema de previsão avançado',
      'Relatórios personalizados',
      'Suporte 24/7',
      'Dashboard white-label',
      'API dedicada',
      'Gerenciamento de equipe'
    ]
  }
];

export default function SubscriptionPlans() {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento');
      }

      const data = await response.json();
      // Aqui você pode redirecionar para uma página de sucesso
      console.log('Pagamento processado:', data);
    } catch (error) {
      console.error('Erro:', error);
      // Aqui você pode mostrar uma mensagem de erro
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="mb-8 flex justify-center gap-4">
        <button
          onClick={() => setPaymentMethod('credit')}
          className={`px-4 py-2 rounded-lg ${
            paymentMethod === 'credit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Cartão de Crédito
        </button>
        <button
          onClick={() => setPaymentMethod('pix')}
          className={`px-4 py-2 rounded-lg ${
            paymentMethod === 'pix'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          PIX (5% de desconto)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 ${
              plan.popular
                ? 'border-2 border-blue-500 relative bg-white shadow-xl'
                : 'border border-gray-200 bg-white shadow-lg'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                Mais Popular
              </span>
            )}

            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">
                R$ {paymentMethod === 'credit' ? plan.price.credit.toFixed(2) : plan.price.pix.toFixed(2)}
              </span>
              <span className="text-gray-500">/mês</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaCheck className="text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-3 px-6 rounded-lg font-semibold ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Assinar Agora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 