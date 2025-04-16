"use client";

import { useState } from 'react';
import { PermissionGuard } from '@/components/permission-guard';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Users,
  Calendar,
  Search,
  Filter,
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
  Hourglass,
  Edit,
  Trash2,
  ChevronDown,
  DownloadCloud,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminSubscriptionsPage() {
  const { subscriptions, users, updateSubscription, cancelSubscription } = useAppStore(state => ({
    subscriptions: state.subscriptions,
    users: state.users,
    updateSubscription: state.updateSubscription,
    cancelSubscription: state.cancelSubscription
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Estatísticas das assinaturas
  const subscriptionStats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
    pending: subscriptions.filter(s => s.status === 'pending').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
    free: subscriptions.filter(s => s.plan === 'free').length,
    basic: subscriptions.filter(s => s.plan === 'basic').length,
    pro: subscriptions.filter(s => s.plan === 'pro').length,
    enterprise: subscriptions.filter(s => s.plan === 'enterprise').length,
    revenue: subscriptions
      .filter(s => s.status === 'active')
      .reduce((total, sub) => total + sub.amount, 0),
  };

  // Filtrar assinaturas
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const user = users.find(u => u.id === subscription.userId);
    const userDetails = user ? `${user.name} ${user.email}`.toLowerCase() : '';
    const matchesSearch = searchTerm === '' ||
      userDetails.includes(searchTerm.toLowerCase()) ||
      subscription.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    const matchesPlan = planFilter === 'all' || subscription.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Função para renderizar o status da assinatura
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Ativa</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelada</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Expirada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Função para renderizar o plano
  const renderPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Gratuito</Badge>;
      case 'basic':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Básico</Badge>;
      case 'pro':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Pro</Badge>;
      case 'enterprise':
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Enterprise</Badge>;
      default:
        return <Badge>{plan}</Badge>;
    }
  };

  // Função para obter o nome do usuário
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário não encontrado';
  };

  // Função para obter o email do usuário
  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Email não encontrado';
  };

  // Funções para gerenciar assinaturas
  const handleCancelSubscription = async (id: string) => {
    try {
      await cancelSubscription(id);
      toast.success('Assinatura cancelada com sucesso!');
    } catch (error: unknown) {
      toast.error('Erro ao cancelar assinatura: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleActivateSubscription = async (id: string) => {
    try {
      await updateSubscription(id, { status: 'active' });
      toast.success('Assinatura ativada com sucesso!');
    } catch (error: unknown) {
      toast.error('Erro ao ativar assinatura: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleChangePlan = async (id: string, plan: 'free' | 'basic' | 'pro' | 'enterprise') => {
    try {
      await updateSubscription(id, { plan });
      toast.success(`Plano alterado para ${plan} com sucesso!`);
    } catch (error: unknown) {
      toast.error('Erro ao alterar plano: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="acessar_admin">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Assinaturas</h1>
              <p className="text-gray-500 mt-1">
                Administre assinaturas, planos e pagamentos
              </p>
            </div>
            <Button className="mt-4 sm:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Assinatura
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex flex-row items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total de Assinaturas</p>
                  <h4 className="text-2xl font-bold">{subscriptionStats.total}</h4>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-gray-700" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-row items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Assinantes Ativos</p>
                  <h4 className="text-2xl font-bold text-green-600">{subscriptionStats.active}</h4>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-row items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Receita Mensal</p>
                  <h4 className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subscriptionStats.revenue)}
                  </h4>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-700" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-row items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Vencendo este mês</p>
                  <h4 className="text-2xl font-bold text-amber-600">12</h4>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-700" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Buscar assinatura ou usuário..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="active">Ativas</SelectItem>
                      <SelectItem value="cancelled">Canceladas</SelectItem>
                      <SelectItem value="expired">Expiradas</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os planos</SelectItem>
                      <SelectItem value="free">Gratuito</SelectItem>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="px-3 py-1 cursor-pointer">
                  <Filter className="h-3 w-3 mr-1" />
                  Todos ({subscriptionStats.total})
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-800 px-3 py-1 cursor-pointer">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ativas ({subscriptionStats.active})
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-800 px-3 py-1 cursor-pointer">
                  <XCircle className="h-3 w-3 mr-1" />
                  Canceladas ({subscriptionStats.cancelled})
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-800 px-3 py-1 cursor-pointer">
                  <Clock className="h-3 w-3 mr-1" />
                  Expiradas ({subscriptionStats.expired})
                </Badge>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 px-3 py-1 cursor-pointer">
                  <Hourglass className="h-3 w-3 mr-1" />
                  Pendentes ({subscriptionStats.pending})
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Assinaturas</CardTitle>
              <CardDescription>
                {filteredSubscriptions.length} assinaturas encontradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data de Início</TableHead>
                    <TableHead>Data de Término</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-mono text-sm">{subscription.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getUserName(subscription.userId)}</div>
                          <div className="text-sm text-gray-500">{getUserEmail(subscription.userId)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{renderPlanBadge(subscription.plan)}</TableCell>
                      <TableCell>{renderStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subscription.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(subscription.startDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {new Date(subscription.endDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.success('Detalhes abertos')}>
                              <Search className="mr-2 h-4 w-4" />
                              <span>Ver detalhes</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info('Edição não implementada ainda')}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            {subscription.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleCancelSubscription(subscription.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Cancelar</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivateSubscription(subscription.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Ativar</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Alterar Plano</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleChangePlan(subscription.id, 'free')}>
                              <span>Gratuito</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangePlan(subscription.id, 'basic')}>
                              <span>Básico</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangePlan(subscription.id, 'pro')}>
                              <span>Pro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangePlan(subscription.id, 'enterprise')}>
                              <span>Enterprise</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <Button variant="outline" className="gap-1">
                <DownloadCloud className="h-4 w-4" />
                Exportar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
