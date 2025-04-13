"use client";

import { useState } from 'react';
import { format, parseISO, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CreditCard,
  Clock,
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  RefreshCw,
  BarChart3,
  Users,
  FileText,
  Code,
  Paintbrush,
  Rocket,
  Tag
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';

// Plan feature descriptions and details
type PlanFeature = {
  name: string;
  description: string;
  icon: React.ReactNode;
};

type PlanFeatureMap = {
  [key: string]: PlanFeature;
};

const PLAN_FEATURES: PlanFeatureMap = {
  unlimited_campaigns: {
    name: 'Campanhas Ilimitadas',
    description: 'Crie e gerencie quantas campanhas precisar sem restrições.',
    icon: <Rocket className="h-5 w-5 text-indigo-600" />
  },
  priority_support: {
    name: 'Suporte Prioritário',
    description: 'Acesso a suporte técnico prioritário com tempo de resposta reduzido.',
    icon: <Shield className="h-5 w-5 text-indigo-600" />
  },
  advanced_analytics: {
    name: 'Análises Avançadas',
    description: 'Relatórios detalhados e insights avançados sobre suas campanhas.',
    icon: <BarChart3 className="h-5 w-5 text-indigo-600" />
  },
  team_access: {
    name: 'Acesso em Equipe',
    description: 'Adicione membros da sua equipe para colaborar na plataforma.',
    icon: <Users className="h-5 w-5 text-indigo-600" />
  },
  white_label: {
    name: 'White Label',
    description: 'Personalize a plataforma com sua marca e identidade visual.',
    icon: <Paintbrush className="h-5 w-5 text-indigo-600" />
  },
  api_access: {
    name: 'Acesso à API',
    description: 'Integre seus sistemas com nossa API completa.',
    icon: <Code className="h-5 w-5 text-indigo-600" />
  },
  '10_campaigns': {
    name: '10 Campanhas',
    description: 'Crie e gerencie até 10 campanhas simultâneas.',
    icon: <Tag className="h-5 w-5 text-indigo-600" />
  },
  '3_campaigns': {
    name: '3 Campanhas',
    description: 'Crie e gerencie até 3 campanhas simultâneas.',
    icon: <Tag className="h-5 w-5 text-indigo-600" />
  },
  basic_support: {
    name: 'Suporte Básico',
    description: 'Acesso ao suporte técnico padrão via tickets.',
    icon: <Shield className="h-5 w-5 text-indigo-600" />
  },
  community_support: {
    name: 'Suporte Comunitário',
    description: 'Acesso ao fórum da comunidade para suporte.',
    icon: <Users className="h-5 w-5 text-indigo-600" />
  },
  standard_analytics: {
    name: 'Análises Padrão',
    description: 'Relatórios básicos sobre o desempenho das suas campanhas.',
    icon: <BarChart3 className="h-5 w-5 text-indigo-600" />
  },
  basic_analytics: {
    name: 'Análises Básicas',
    description: 'Métricas essenciais sobre suas campanhas.',
    icon: <BarChart3 className="h-5 w-5 text-indigo-600" />
  },
  premium_analytics: {
    name: 'Análises Premium',
    description: 'Relatórios avançados, dashboards personalizados e previsões.',
    icon: <BarChart3 className="h-5 w-5 text-indigo-600" />
  },
  vip_support: {
    name: 'Suporte VIP',
    description: 'Acesso direto a um gerente de conta dedicado.',
    icon: <Shield className="h-5 w-5 text-indigo-600" />
  }
};

// Plan pricing details
const PLAN_PRICING = {
  free: {
    name: 'Gratuito',
    price: 0,
    period: 'mensal',
    description: 'Para quem está começando',
    features: ['3_campaigns', 'community_support', 'basic_analytics'],
    cta: 'Usar plano gratuito',
    popular: false,
    color: 'bg-gray-100'
  },
  basic: {
    name: 'Básico',
    price: 497,
    period: 'mensal',
    description: 'Para profissionais individuais',
    features: ['10_campaigns', 'basic_support', 'standard_analytics'],
    cta: 'Assinar plano básico',
    popular: false,
    color: 'bg-blue-100'
  },
  pro: {
    name: 'Profissional',
    price: 997,
    period: 'mensal',
    description: 'Para empresas em crescimento',
    features: ['unlimited_campaigns', 'priority_support', 'advanced_analytics', 'team_access'],
    cta: 'Assinar plano profissional',
    popular: true,
    color: 'bg-indigo-100'
  },
  enterprise: {
    name: 'Empresarial',
    price: 1997,
    period: 'mensal',
    description: 'Para grandes operações',
    features: ['unlimited_campaigns', 'vip_support', 'premium_analytics', 'team_access', 'white_label', 'api_access'],
    cta: 'Entrar em contato',
    popular: false,
    color: 'bg-purple-100'
  }
};

// Payment method icons and labels
const PAYMENT_METHODS = {
  credit_card: {
    icon: <CreditCard className="h-5 w-5" />,
    label: 'Cartão de Crédito'
  },
  pix: {
    icon: <Zap className="h-5 w-5" />,
    label: 'PIX'
  },
  bank_transfer: {
    icon: <FileText className="h-5 w-5" />,
    label: 'Transferência Bancária'
  },
  other: {
    icon: <CreditCard className="h-5 w-5" />,
    label: 'Outro método'
  }
};

export default function SubscriptionsPage() {
  const { subscriptions, cancelSubscription, updateSubscription, user } = useAppStore(state => ({
    subscriptions: state.subscriptions,
    cancelSubscription: state.cancelSubscription,
    updateSubscription: state.updateSubscription,
    user: state.auth.user
  }));

  // Validar acesso e dados do usuário
  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
              <p className="text-gray-600">Você precisa estar autenticado para acessar esta página.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Obter assinatura ativa do usuário
  const activeSubscription = subscriptions.find(
    sub => sub.userId === user.id && sub.status === 'active'
  );

  const currentUser = useAppStore(state => state.auth.user);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);

  // Get the user's subscriptions
  const userSubscriptions = subscriptions.filter(sub => sub.userId === currentUser?.id);

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  // Calculate days remaining in subscription
  const getDaysRemaining = (endDate: string) => {
    const end = parseISO(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate progress percentage for subscription timeline
  const getProgressPercentage = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const now = new Date();

    if (isBefore(now, start)) return 0;
    if (isBefore(end, now)) return 100;

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    return Math.round((elapsed / totalDuration) * 100);
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;

    try {
      await cancelSubscription(selectedSubscription);
      setCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  // Handle subscription renewal (toggle autoRenew)
  const handleToggleAutoRenew = async () => {
    if (!selectedSubscription) return;

    const subscription = userSubscriptions.find(sub => sub.id === selectedSubscription);
    if (!subscription) return;

    try {
      await updateSubscription(selectedSubscription, {
        autoRenew: !subscription.autoRenew
      });
      setRenewDialogOpen(false);
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  // Get status badge for subscription
  const getStatusBadge = (status: string, daysRemaining: number, autoRenew: boolean) => {
    switch (status) {
      case 'active':
        if (daysRemaining <= 7) {
          return (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Expirando em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Check className="h-3 w-3 mr-1" />
            Ativa {autoRenew ? '(Renovação automática)' : ''}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <X className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            <Clock className="h-3 w-3 mr-1" />
            Expirada
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            {status}
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-primary" />
            Assinaturas
          </h1>
          <p className="text-gray-500">Gerencie seus planos e assinaturas.</p>
        </div>

        {userSubscriptions.length > 0 ? (
          <div className="space-y-6">
            {userSubscriptions.map(subscription => {
              const planDetails = PLAN_PRICING[subscription.plan];
              const daysRemaining = getDaysRemaining(subscription.endDate);
              const progress = getProgressPercentage(subscription.startDate, subscription.endDate);

              return (
                <Card key={subscription.id} className={`overflow-hidden border-t-4 ${planDetails?.color || 'border-gray-200'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center">
                          Plano {planDetails?.name || subscription.plan}
                          {planDetails?.popular && (
                            <Badge className="ml-2 bg-primary">Popular</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{planDetails?.description || 'Detalhes do plano'}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {subscription.amount === 0
                            ? 'Gratuito'
                            : `R$ ${subscription.amount.toFixed(2).replace('.', ',')}`}
                        </div>
                        <span className="text-sm text-gray-500">
                          {subscription.amount > 0 ? 'por mês' : ''}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Status information */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        {getStatusBadge(subscription.status, daysRemaining, subscription.autoRenew)}

                        {subscription.status === 'active' && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Válido até {formatDate(subscription.endDate)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center">
                        {PAYMENT_METHODS[subscription.paymentMethod].icon}
                        <span className="ml-1 text-sm text-gray-600">
                          {PAYMENT_METHODS[subscription.paymentMethod].label}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar for subscription time */}
                    {subscription.status === 'active' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{formatDate(subscription.startDate)}</span>
                          <span>{formatDate(subscription.endDate)}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    {/* Features included */}
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="features">
                        <AccordionTrigger className="text-sm font-medium">
                          Recursos Incluídos
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            {subscription.features.map(feature => {
                              const featureDetails = PLAN_FEATURES[feature];
                              return (
                                <div key={feature} className="flex items-start p-2 rounded-md bg-gray-50">
                                  {featureDetails?.icon || <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />}
                                  <div className="ml-2">
                                    <div className="font-medium text-sm">
                                      {featureDetails?.name || feature}
                                    </div>
                                    {featureDetails?.description && (
                                      <div className="text-xs text-gray-500">
                                        {featureDetails.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>

                  <CardFooter className="flex flex-wrap justify-between gap-4 bg-gray-50 py-4 px-6 border-t">
                    {subscription.status === 'active' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSubscription(subscription.id);
                            setRenewDialogOpen(true);
                          }}
                        >
                          {subscription.autoRenew ? (
                            <>
                              <X className="mr-2 h-4 w-4" />
                              Desativar renovação automática
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Ativar renovação automática
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            setSelectedSubscription(subscription.id);
                            setCancelDialogOpen(true);
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancelar assinatura
                        </Button>
                      </>
                    )}

                    {subscription.status === 'cancelled' && (
                      <Button className="ml-auto">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Renovar assinatura
                      </Button>
                    )}

                    {subscription.status === 'expired' && (
                      <Button className="ml-auto">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Renovar assinatura
                      </Button>
                    )}

                    {subscription.status === 'pending' && (
                      <div className="flex items-center text-amber-600">
                        <Clock className="mr-2 h-4 w-4" />
                        Aguardando confirmação de pagamento
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma assinatura ativa</h3>
              <p className="text-gray-500 mb-6">
                Você ainda não possui nenhuma assinatura. Escolha um plano para começar.
              </p>
              <Button>Ver planos disponíveis</Button>
            </CardContent>
          </Card>
        )}

        {/* Available Plans Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Planos Disponíveis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(PLAN_PRICING).map(([planId, plan]) => (
              <Card
                key={planId}
                className={`overflow-hidden border-t-4 ${plan.color} ${plan.popular ? 'ring-2 ring-primary ring-offset-2' : ''} relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-bl-md rounded-tr-md rounded-br-none rounded-tl-none px-3">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-gray-500">/{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map(feature => {
                      const featureDetails = PLAN_FEATURES[feature];
                      return (
                        <div key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm">{featureDetails?.name || feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Cancel Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar assinatura</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja cancelar esta assinatura? Você continuará com acesso até o final do período atual, mas não será renovada.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
              >
                Confirmar cancelamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Auto-renew Dialog */}
        <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {userSubscriptions.find(s => s.id === selectedSubscription)?.autoRenew
                  ? 'Desativar renovação automática'
                  : 'Ativar renovação automática'}
              </DialogTitle>
              <DialogDescription>
                {userSubscriptions.find(s => s.id === selectedSubscription)?.autoRenew
                  ? 'Sua assinatura não será renovada automaticamente ao final do período atual. Você precisará renovar manualmente para continuar usando o serviço.'
                  : 'Sua assinatura será renovada automaticamente ao final de cada período para garantir acesso ininterrupto aos recursos.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenewDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleToggleAutoRenew}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
