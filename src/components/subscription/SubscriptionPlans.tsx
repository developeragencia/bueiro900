"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import PaymentModal from "./PaymentModal";

const plans = [
  {
    id: "basic",
    name: "Básico",
    price: "97,00",
    features: [
      "Até 10 bueiros monitorados",
      "Alertas básicos",
      "Relatórios mensais",
      "Suporte por email"
    ]
  },
  {
    id: "pro",
    name: "Profissional",
    price: "197,00",
    features: [
      "Até 50 bueiros monitorados",
      "Alertas em tempo real",
      "Relatórios semanais",
      "Suporte prioritário",
      "Dashboard personalizado"
    ]
  },
  {
    id: "enterprise",
    name: "Empresarial",
    price: "497,00",
    features: [
      "Bueiros ilimitados",
      "Alertas customizados",
      "Relatórios diários",
      "Suporte 24/7",
      "API dedicada",
      "Treinamento da equipe"
    ]
  }
];

export default function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal para Sua Cidade
          </h2>
          <p className="text-lg text-gray-600">
            Monitoramento inteligente para cada necessidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-6">
                  R$ {plan.price}
                  <span className="text-sm text-gray-500">/mês</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Assinar Agora
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planId={selectedPlan}
        planDetails={plans.find((p) => p.id === selectedPlan)}
      />
    </div>
  );
} 