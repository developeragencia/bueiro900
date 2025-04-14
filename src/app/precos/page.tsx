"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: {
    included: string[];
    notIncluded: string[];
  };
  recommended?: boolean;
  maxCampaigns: number;
  maxUsers: number;
  analyticsRetention: number;
}

interface CheckoutFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfeito para começar a rastrear suas campanhas',
    price: 49.90,
    billingPeriod: 'monthly',
    features: {
      included: [
        'Até 5 campanhas ativas',
        'Até 2 usuários',
        '30 dias de retenção de dados',
        'Relatórios básicos',
        'Integrações básicas',
        'Suporte por email'
      ],
      notIncluded: [
        'API personalizada',
        'Relatórios avançados',
        'Suporte prioritário',
        'Treinamento personalizado'
      ]
    },
    maxCampaigns: 5,
    maxUsers: 2,
    analyticsRetention: 30
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Para equipes que precisam de mais recursos',
    price: 99.90,
    billingPeriod: 'monthly',
    features: {
      included: [
        'Até 20 campanhas ativas',
        'Até 5 usuários',
        '90 dias de retenção de dados',
        'Relatórios avançados',
        'Todas as integrações',
        'Suporte prioritário',
        'API personalizada'
      ],
      notIncluded: [
        'Treinamento personalizado',
        'Gerenciador de conta dedicado'
      ]
    },
    recommended: true,
    maxCampaigns: 20,
    maxUsers: 5,
    analyticsRetention: 90
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solução completa para grandes empresas',
    price: 299.90,
    billingPeriod: 'monthly',
    features: {
      included: [
        'Campanhas ilimitadas',
        'Usuários ilimitados',
        '12 meses de retenção de dados',
        'Relatórios personalizados',
        'Todas as integrações',
        'Suporte 24/7',
        'API personalizada',
        'Treinamento personalizado',
        'Gerenciador de conta dedicado'
      ],
      notIncluded: []
    },
    maxCampaigns: Infinity,
    maxUsers: Infinity,
    analyticsRetention: 365
  }
];

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutData, setCheckoutData] = useState<CheckoutFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSelectPlan = (plan: Plan) => {
    if (!user) {
      router.push('/auth/login?redirect=/precos');
      return;
    }
    setSelectedPlan(plan);
    setShowCheckoutDialog(true);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substr(0, 5);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (checkoutData.cardNumber.replace(/\s/g, '').length !== 16) {
      errors.push('Número do cartão inválido');
    }

    if (!checkoutData.cardHolder) {
      errors.push('Nome do titular é obrigatório');
    }

    if (!checkoutData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      errors.push('Data de validade inválida');
    }

    if (checkoutData.cvv.length !== 3) {
      errors.push('CVV inválido');
    }

    return errors;
  };

  const handleCheckout = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      // Simulando integração com gateway de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Assinatura realizada com sucesso!');
      setShowCheckoutDialog(false);
      router.push('/dashboard');
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12;
    const discount = 0.2; // 20% de desconto
    return yearlyPrice * (1 - discount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Escolha o plano ideal para seu negócio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Comece grátis e atualize conforme seu crescimento
          </motion.p>

          <div className="mt-8 flex justify-center items-center gap-4">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-primary' : 'text-gray-500'}`}>
                Mensal
            </span>
            <Button
              variant="outline"
              className="relative"
              onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            >
              <div
                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-primary transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-full' : ''
                }`}
              />
              <div className="w-12 h-6" />
            </Button>
            <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-primary' : 'text-gray-500'}`}>
              Anual
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                20% OFF
              </Badge>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative p-6 ${plan.recommended ? 'border-primary' : ''}`}>
                {plan.recommended && (
                  <Badge
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white"
                  >
                    Mais Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      R$ {billingPeriod === 'monthly' 
                        ? plan.price.toFixed(2) 
                        : (getYearlyPrice(plan.price) / 12).toFixed(2)}
                    </span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="mt-2 text-green-600 text-sm">
                      Economia de R$ {((plan.price * 12) - getYearlyPrice(plan.price)).toFixed(2)} por ano
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  {plan.features.included.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.features.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-400">
                      <X className="h-5 w-5" />
                      <span>{feature}</span>
              </div>
            ))}
      </div>

                <Button
                  className="w-full"
                  variant={plan.recommended ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Começar agora
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finalizar Assinatura</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{selectedPlan?.name}</h4>
                    <p className="text-sm text-gray-600">
                      Cobrança {billingPeriod === 'monthly' ? 'mensal' : 'anual'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      R$ {billingPeriod === 'monthly'
                        ? selectedPlan?.price.toFixed(2)
                        : (getYearlyPrice(selectedPlan?.price || 0) / 12).toFixed(2)}
                      /mês
                    </div>
                    {billingPeriod === 'yearly' && (
                      <div className="text-sm text-green-600">
                        20% de desconto aplicado
          </div>
                    )}
          </div>
        </div>
      </div>

              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Número do cartão"
                    value={checkoutData.cardNumber}
                    onChange={e => setCheckoutData(prev => ({
                      ...prev,
                      cardNumber: formatCardNumber(e.target.value)
                    }))}
                    maxLength={19}
                  />
              </div>
                <div>
                  <Input
                    placeholder="Nome do titular"
                    value={checkoutData.cardHolder}
                    onChange={e => setCheckoutData(prev => ({
                      ...prev,
                      cardHolder: e.target.value
                    }))}
                  />
            </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="MM/AA"
                    value={checkoutData.expiryDate}
                    onChange={e => setCheckoutData(prev => ({
                      ...prev,
                      expiryDate: formatExpiryDate(e.target.value)
                    }))}
                    maxLength={5}
                  />
                  <Input
                    placeholder="CVV"
                    type="password"
                    value={checkoutData.cvv}
                    onChange={e => setCheckoutData(prev => ({
                      ...prev,
                      cvv: e.target.value.replace(/\D/g, '').substr(0, 3)
                    }))}
                    maxLength={3}
                  />
              </div>
            </div>

              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Assinar agora
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Ao assinar, você concorda com nossos{' '}
                <a href="/terms" className="text-primary hover:underline">
                  termos de serviço
                </a>
                {' '}e{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  política de privacidade
                </a>
              </p>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
  );
}
