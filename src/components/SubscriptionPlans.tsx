'use client';

import { useState } from 'react';
import { FaCheck, FaCreditCard, FaBarcode, FaPix } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: {
      credit: 299.90,
      pix: 279.90,
      boleto: 289.90
    },
    features: [
      'Até 10 bueiros monitorados',
      'Alertas básicos',
      'Relatórios mensais',
      'Suporte por email',
      'Acesso ao app mobile',
      'Dados em tempo real',
      'Histórico de 3 meses'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: {
      credit: 599.90,
      pix: 569.90,
      boleto: 589.90
    },
    features: [
      'Até 50 bueiros monitorados',
      'Alertas em tempo real',
      'Relatórios semanais',
      'Suporte prioritário',
      'Dashboard personalizado',
      'API de integração',
      'App mobile premium',
      'Histórico de 12 meses',
      'Exportação de dados',
      'Multi-usuários (até 5)'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: {
      credit: 999.90,
      pix: 949.90,
      boleto: 979.90
    },
    features: [
      'Bueiros ilimitados',
      'Sistema de previsão avançado',
      'Relatórios personalizados',
      'Suporte 24/7 dedicado',
      'Dashboard white-label',
      'API dedicada',
      'Gerenciamento de equipe',
      'Histórico ilimitado',
      'Backup dedicado',
      'Multi-usuários ilimitados',
      'Treinamento personalizado',
      'SLA garantido'
    ],
    recommended: false
  }
];

type PaymentMethod = 'credit' | 'pix' | 'boleto';

export default function SubscriptionPlans() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();
  const { user } = useAppStore(state => state.auth);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Faça login para assinar um plano');
      router.push('/login');
      return;
    }

    setSelectedPlan(planId);
    setShowDialog(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return;

    try {
      setLoading(true);
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (paymentMethod === 'credit') {
        router.push(`/checkout/${selectedPlan}?method=credit`);
      } else if (paymentMethod === 'pix') {
        toast.success('QR Code PIX gerado! Verifique seu email.');
        setShowDialog(false);
      } else {
        toast.success('Boleto gerado! Verifique seu email.');
        setShowDialog(false);
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'credit':
        return <FaCreditCard className="w-4 h-4" />;
      case 'pix':
        return <FaPix className="w-4 h-4" />;
      case 'boleto':
        return <FaBarcode className="w-4 h-4" />;
    }
  };

  const getDiscountMessage = (method: PaymentMethod) => {
    switch (method) {
      case 'credit':
        return 'Em até 12x';
      case 'pix':
        return '5% de desconto';
      case 'boleto':
        return '3% de desconto';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Escolha o Plano Ideal</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Todos os planos incluem período gratuito de 7 dias para teste. Cancele a qualquer momento sem compromisso.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {(['credit', 'pix', 'boleto'] as PaymentMethod[]).map((method) => (
          <Button
            key={method}
            onClick={() => setPaymentMethod(method)}
            variant={paymentMethod === method ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            {getPaymentIcon(method)}
            <span className="capitalize">{method}</span>
            <span className="text-xs">({getDiscountMessage(method)})</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 ${
              plan.recommended
                ? 'border-2 border-primary relative bg-white shadow-xl'
                : 'border border-gray-200 bg-white shadow-lg'
            }`}
          >
            {plan.recommended && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Recomendado
              </span>
            )}

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">
                  R$ {plan.price[paymentMethod].toFixed(2)}
              </span>
              <span className="text-gray-500">/mês</span>
              </div>
              {paymentMethod === 'credit' && (
                <p className="text-sm text-gray-500 mt-1">
                  ou 12x de R$ {(plan.price.credit / 12).toFixed(2)}
                </p>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleSubscribe(plan.id)}
              className="w-full"
              variant={plan.recommended ? 'default' : 'outline'}
              size="lg"
            >
              Começar Agora
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Assinatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>
              Você selecionou o plano{' '}
              <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong> com
              pagamento via {paymentMethod}.
            </p>
            <p className="text-sm text-gray-500">
              Ao confirmar, você concorda com nossos termos de serviço e política de privacidade.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmSubscription} disabled={loading}>
                {loading ? 'Processando...' : 'Confirmar Assinatura'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 