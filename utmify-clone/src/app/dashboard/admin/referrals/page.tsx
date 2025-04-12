"use client";

import { useState, useEffect } from 'react';
import { PermissionGuard } from '@/components/permission-guard';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Share2,
  Users,
  CreditCard,
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  Link as LinkIcon,
  ChevronDown,
  MoreHorizontal,
  Download,
  RefreshCw,
  Settings,
  Award,
  CheckCircle2,
  ClipboardCopy,
  XCircle
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
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminReferralsPage() {
  const { referrals, users, subscriptions } = useAppStore(state => ({
    referrals: state.referrals,
    users: state.users,
    subscriptions: state.subscriptions
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [referralEnabled, setReferralEnabled] = useState(true);

  // Calcular estatísticas de indicações
  const referralStats = {
    total: referrals.length,
    active: referrals.filter(r => r.status === 'active').length,
    inactive: referrals.filter(r => r.status === 'inactive').length,
    totalVisits: referrals.reduce((total, r) => total + r.visits, 0),
    totalSignups: referrals.reduce((total, r) => total + r.signups, 0),
    totalConversions: referrals.reduce((total, r) => total + r.conversions, 0),
    totalEarnings: referrals.reduce((total, r) => total + r.earnings, 0),
    conversionRate: referrals.reduce((total, r) => total + r.conversions, 0) /
                    Math.max(1, referrals.reduce((total, r) => total + r.visits, 0)) * 100
  };

  // Filtrar indicações
  const filteredReferrals = referrals.filter(referral => {
    const user = users.find(u => u.id === referral.userId);
    const userDetails = user ? `${user.name} ${user.email}`.toLowerCase() : '';
    const matchesSearch = searchTerm === '' ||
      userDetails.includes(searchTerm.toLowerCase()) ||
      referral.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calcular top indicadores
  const topReferrers = [...referrals]
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 5);

  // Simular pagamentos pendentes
  const pendingPayments = referrals
    .filter(r => r.earnings > 0)
    .map(referral => {
      const user = users.find(u => u.id === referral.userId);
      return {
        id: `pay-${referral.id}`,
        referralId: referral.id,
        userId: referral.userId,
        userName: user ? user.name : 'Usuário desconhecido',
        userEmail: user ? user.email : 'email@desconhecido.com',
        amount: referral.earnings * 0.3, // Simular que 30% está pendente
        status: Math.random() > 0.5 ? 'pending' : 'processing',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    })
    .slice(0, 7);

  // Função para obter nome do usuário
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário desconhecido';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Email não encontrado';
  };

  const getUserAvatar = (userId: string): string | undefined => {
    const user = users.find(u => u.id === userId);
    return user?.avatar;
  };

  // Função para aprovação de pagamento simulada
  const handleApprovePayment = (id: string): void => {
    toast.success(`Pagamento ${id} aprovado com sucesso!`);
  };

  // Função para desativar/ativar indicação
  const handleToggleReferralStatus = (id: string, currentStatus: string): void => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast.success(`Status da indicação alterado para ${newStatus === 'active' ? 'ativo' : 'inativo'}`);
  };

  // Função para copiar código de indicação
  const handleCopyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => toast.success(`Código ${code} copiado para a área de transferência`))
      .catch((err: unknown) => toast.error('Erro ao copiar código: ' + (err instanceof Error ? err.message : 'Erro desconhecido')));
  };

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="acessar_admin">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Programa de Indicação</h1>
              <p className="text-gray-500 mt-1">
                Gerencie o programa "Indique e Ganhe"
              </p>
            </div>
            <div className="flex items-center mt-4 sm:mt-0 space-x-2">
              <Label htmlFor="airplane-mode" className="mr-2">
                Programa ativo
              </Label>
              <Switch
                id="airplane-mode"
                checked={referralEnabled}
                onCheckedChange={setReferralEnabled}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total de Indicações</p>
                    <h4 className="text-2xl font-bold mt-1">{referralStats.totalSignups}</h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-600 text-sm flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12% este mês
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Conversões</p>
                    <h4 className="text-2xl font-bold mt-1">{referralStats.totalConversions}</h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <LinkIcon className="h-6 w-6 text-green-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-600 text-sm flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Taxa de conversão: {referralStats.conversionRate.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Ganhos</p>
                    <h4 className="text-2xl font-bold mt-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(referralStats.totalEarnings)}
                    </h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-gray-600 text-sm">
                    Média por indicação: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(referralStats.totalEarnings / Math.max(1, referralStats.totalConversions))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Pagamentos Pendentes</p>
                    <h4 className="text-2xl font-bold mt-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pendingPayments.reduce((total, p) => total + p.amount, 0))}
                    </h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-amber-600 text-sm">
                    {pendingPayments.length} pagamentos aguardando
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Referrers */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  Top Indicadores
                </CardTitle>
                <CardDescription>
                  Os melhores indicadores da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topReferrers.map((referral, index) => (
                    <div key={referral.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{getUserName(referral.userId)}</div>
                          <div className="text-sm text-gray-500">{referral.conversions} conversões</div>
                        </div>
                      </div>
                      <div className="font-semibold text-green-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(referral.earnings)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                <Button variant="ghost" className="w-full">Ver todos</Button>
              </CardFooter>
            </Card>

            {/* Tabs for Pending Payments and Program Settings */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="pendingPayments">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pendingPayments">Pagamentos Pendentes</TabsTrigger>
                  <TabsTrigger value="programSettings">Configurações do Programa</TabsTrigger>
                </TabsList>

                <TabsContent value="pendingPayments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pagamentos Pendentes</CardTitle>
                      <CardDescription>
                        Pagamentos aguardando aprovação
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="mr-2 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                                    {getUserAvatar(payment.userId) ? (
                                      <img
                                        src={getUserAvatar(payment.userId)}
                                        alt="Avatar"
                                        className="h-8 w-8 rounded-full"
                                      />
                                    ) : (
                                      <Users className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium">{payment.userName}</div>
                                    <div className="text-xs text-gray-500">{payment.userEmail}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-green-600">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={payment.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                  }
                                >
                                  {payment.status === 'pending' ? 'Pendente' : 'Processando'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Abrir menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleApprovePayment(payment.id)}>
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      <span>Aprovar Pagamento</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Search className="mr-2 h-4 w-4" />
                                      <span>Ver Detalhes</span>
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
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Atualizar
                      </Button>
                      <Button>
                        Aprovar Todos
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="programSettings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações do Programa</CardTitle>
                      <CardDescription>
                        Configure as regras do programa de indicação
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Status do Programa</h4>
                            <p className="text-sm text-gray-500">Ativar ou desativar o programa de indicações</p>
                          </div>
                          <Switch
                            checked={referralEnabled}
                            onCheckedChange={setReferralEnabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Comissão</h4>
                            <p className="text-sm text-gray-500">Porcentagem paga aos indicadores</p>
                          </div>
                          <div className="font-semibold">10%</div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Período para pagamento</h4>
                            <p className="text-sm text-gray-500">Dias até o pagamento ser liberado</p>
                          </div>
                          <div className="font-semibold">30 dias</div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Valor mínimo para saque</h4>
                            <p className="text-sm text-gray-500">Valor mínimo para solicitar pagamento</p>
                          </div>
                          <div className="font-semibold">R$ 100,00</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Salvar Configurações
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* All Referrals */}
          <Card className="mt-8">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Todos os Códigos de Indicação</CardTitle>
                <CardDescription>
                  Lista de todos os códigos de indicação no sistema
                </CardDescription>
              </div>
              <div className="mt-4 md:mt-0 relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar por usuário ou código..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Visitas</TableHead>
                    <TableHead>Inscrições</TableHead>
                    <TableHead>Conversões</TableHead>
                    <TableHead>Ganhos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div className="font-medium">{getUserName(referral.userId)}</div>
                        <div className="text-xs text-gray-500">{getUserEmail(referral.userId)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{referral.code}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyReferralCode(referral.code)}
                          >
                            <ClipboardCopy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{referral.visits}</TableCell>
                      <TableCell>{referral.signups}</TableCell>
                      <TableCell>{referral.conversions}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(referral.earnings)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={referral.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }
                        >
                          {referral.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleReferralStatus(referral.id, referral.status)}>
                              {referral.status === 'active' ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  <span>Desativar</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  <span>Ativar</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyReferralCode(referral.code)}>
                              <ClipboardCopy className="mr-2 h-4 w-4" />
                              <span>Copiar Código</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Search className="mr-2 h-4 w-4" />
                              <span>Ver Estatísticas</span>
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
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
