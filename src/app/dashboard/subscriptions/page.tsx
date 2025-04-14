"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  ArrowUpDown,
  ChevronDown,
  Shield,
  Zap,
  Users,
  Star,
  AlertCircle,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  number: string;
}

interface Usage {
  used: number;
  limit: number;
  feature: string;
}

interface Subscription {
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  plan: Plan;
  cancelAtPeriodEnd: boolean;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49.90,
    interval: 'monthly',
    features: [
      'Até 1.000 transações/mês',
      '2 usuários',
      'Suporte por email',
      'Relatórios básicos',
      'API limitada'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99.90,
    interval: 'monthly',
    features: [
      'Até 10.000 transações/mês',
      '5 usuários',
      'Suporte prioritário',
      'Relatórios avançados',
      'API completa',
      'Integrações premium'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199.90,
    interval: 'monthly',
    features: [
      'Transações ilimitadas',
      'Usuários ilimitados',
      'Suporte 24/7',
      'Relatórios personalizados',
      'API dedicada',
      'Integrações customizadas',
      'SLA garantido'
    ]
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    date: '2024-03-18',
    amount: 99.90,
    status: 'paid',
    number: 'INV-2024-001'
  },
  {
    id: 'inv_002',
    date: '2024-02-18',
    amount: 99.90,
    status: 'paid',
    number: 'INV-2024-002'
  },
  {
    id: 'inv_003',
    date: '2024-01-18',
    amount: 99.90,
    status: 'paid',
    number: 'INV-2024-003'
  }
];

const mockUsage: Usage[] = [
  {
    feature: 'Transações',
    used: 7500,
    limit: 10000
  },
  {
    feature: 'Usuários',
    used: 3,
    limit: 5
  },
  {
    feature: 'Armazenamento',
    used: 75,
    limit: 100
  }
];

const mockSubscription: Subscription = {
  status: 'active',
  currentPeriodEnd: '2024-04-18',
  plan: plans[1], // Professional
  cancelAtPeriodEnd: false
};

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [usage] = useState<Usage[]>(mockUsage);
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      // Simula download da fatura
      toast.success('Fatura baixada com sucesso');
    } catch (error) {
      toast.error('Erro ao baixar fatura');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // Simula cancelamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscription(prev => ({
        ...prev,
        cancelAtPeriodEnd: true
      }));
      toast.success('Assinatura será cancelada ao fim do período');
    } catch (error) {
      toast.error('Erro ao cancelar assinatura');
    }
  };

  const handleResumeSubscription = async () => {
    try {
      // Simula reativação
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscription(prev => ({
        ...prev,
        cancelAtPeriodEnd: false
      }));
      toast.success('Assinatura reativada com sucesso');
    } catch (error) {
      toast.error('Erro ao reativar assinatura');
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Assinatura</h1>
          <p className="text-gray-500">Gerencie sua assinatura e faturas</p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Plano Atual</CardTitle>
                <CardDescription>Seu plano e status da assinatura</CardDescription>
              </div>
              <Badge
                className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              >
                {subscription.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{subscription.plan.name}</h3>
                <p className="text-3xl font-bold mb-4">
                  R$ {subscription.plan.price.toFixed(2)}
                  <span className="text-sm text-gray-500 font-normal">/mês</span>
                </p>
                <div className="space-y-2">
                  {subscription.plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Próxima cobrança</span>
                    <span className="text-sm text-gray-500">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {subscription.cancelAtPeriodEnd ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Cancelamento Agendado</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Sua assinatura será cancelada em {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                          </p>
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={handleResumeSubscription}
                          >
                            Reativar Assinatura
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCancelSubscription}
                    >
                      Cancelar Assinatura
                    </Button>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Uso do Plano</h4>
                  <div className="space-y-4">
                    {usage.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.feature}</span>
                          <span>{item.used}/{item.limit}</span>
                        </div>
                        <Progress value={(item.used / item.limit) * 100} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Planos Disponíveis</CardTitle>
            <CardDescription>Escolha o melhor plano para seu negócio</CardDescription>
            <div className="flex items-center justify-end mt-4">
              <div className="bg-gray-100 rounded-lg p-1">
                <Button
                  variant={selectedInterval === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedInterval('monthly')}
                >
                  Mensal
                </Button>
                <Button
                  variant={selectedInterval === 'yearly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedInterval('yearly')}
                >
                  Anual
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-primary' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                      Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      R$ {selectedInterval === 'yearly' 
                        ? (plan.price * 0.9 * 12).toFixed(2)
                        : plan.price.toFixed(2)}
                      <span className="text-sm">/mês</span>
                      {selectedInterval === 'yearly' && (
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          Economize 10%
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.id === subscription.plan.id ? 'outline' : 'default'}
                      disabled={plan.id === subscription.plan.id}
                    >
                      {plan.id === subscription.plan.id ? 'Plano Atual' : 'Escolher Plano'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Faturas</CardTitle>
            <CardDescription>Visualize e baixe suas faturas anteriores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Número</th>
                    <th className="text-left py-3 px-4">Data</th>
                    <th className="text-left py-3 px-4">Valor</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="py-3 px-4">{invoice.number}</td>
                      <td className="py-3 px-4">
                        {new Date(invoice.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        R$ {invoice.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status === 'paid' ? 'Pago' : 
                           invoice.status === 'pending' ? 'Pendente' : 'Falhou'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
