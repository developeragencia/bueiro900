"use client";

import { useState } from 'react';
import { PermissionGuard } from '@/components/permission-guard';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Settings,
  Shield,
  FileText,
  ServerCrash,
  Database,
  Globe,
  Activity,
  Key,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Share2,
  HelpCircle,
  Pencil,
  Code,
  Layout,
  Palette
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { users, systemStatus, subscriptions, referrals, supportTickets } = useAppStore(state => ({
    users: state.users,
    systemStatus: state.systemStatus,
    subscriptions: state.subscriptions,
    referrals: state.referrals,
    supportTickets: state.supportTickets
  }));

  // Estatísticas dos usuários
  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
    admins: users.filter(u => u.role === 'admin').length,
    editors: users.filter(u => u.role === 'editor').length,
    viewers: users.filter(u => u.role === 'viewer').length,
    recentlyActive: users.filter(u => {
      const lastActive = new Date(u.lastActive);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return lastActive > oneWeekAgo;
    }).length
  };

  // Estatísticas das assinaturas
  const subscriptionStats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
    pending: subscriptions.filter(s => s.status === 'pending').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
    free: subscriptions.filter(s => s.plan === 'free').length,
    paid: subscriptions.filter(s => s.plan !== 'free').length,
    revenue: subscriptions
      .filter(s => s.status === 'active')
      .reduce((total, sub) => total + sub.amount, 0),
  };

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="acessar_admin">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-500 mt-1">
                Gerencie usuários, permissões e configurações do sistema
              </p>
            </div>
          </div>

          {/* Admin Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard/admin/users" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-blue-700">
                    <Users className="mr-2 h-5 w-5" />
                    Gerenciar Usuários
                  </CardTitle>
                  <CardDescription>
                    Adicione, edite e gerencie usuários do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {userStats.total} Usuários
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {userStats.active} Ativos
                    </div>
                    <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                      {userStats.admins} Admins
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/admin/permissions" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-purple-700">
                    <Shield className="mr-2 h-5 w-5" />
                    Perfis e Permissões
                  </CardTitle>
                  <CardDescription>
                    Configure perfis de acesso e permissões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                      Admin
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      Editor
                    </div>
                    <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      Visualizador
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/admin/settings" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-gray-700">
                    <Settings className="mr-2 h-5 w-5" />
                    Configurações do Sistema
                  </CardTitle>
                  <CardDescription>
                    Configure parâmetros globais do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      <Globe className="h-3 w-3 inline mr-1" />
                      Regional
                    </div>
                    <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      <Database className="h-3 w-3 inline mr-1" />
                      Dados
                    </div>
                    <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      <Key className="h-3 w-3 inline mr-1" />
                      Segurança
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* New Admin Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard/admin/subscriptions" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-blue-700">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Gerenciar Assinaturas
                  </CardTitle>
                  <CardDescription>
                    Administre assinaturas, planos e pagamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {subscriptionStats.total} Assinaturas
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {subscriptionStats.active} Ativas
                    </div>
                    <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subscriptionStats.revenue)} Receita
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/admin/referrals" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-green-700">
                    <Share2 className="mr-2 h-5 w-5" />
                    Programa de Indicação
                  </CardTitle>
                  <CardDescription>
                    Gerencie o programa "Indique e Ganhe"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {referrals.length} Códigos
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {referrals.reduce((total, r) => total + r.conversions, 0)} Conversões
                    </div>
                    <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(referrals.reduce((total, r) => total + r.earnings, 0))} Ganhos
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/admin/support" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-purple-700">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Suporte ao Cliente
                  </CardTitle>
                  <CardDescription>
                    Gerenciar tickets e requisições de suporte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {supportTickets.filter(t => t.status === 'open').length} Abertos
                    </div>
                    <div className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      {supportTickets.filter(t => t.status === 'in_progress').length} Em andamento
                    </div>
                    <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      {supportTickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length} Alta prioridade
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Site Editor Section */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Pencil className="mr-2 h-5 w-5" />
                  Editor do Site
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Configure e personalize completamente o site
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/dashboard/admin/site-editor">
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <Layout className="h-10 w-10 text-blue-600 mb-2 mt-2" />
                        <h3 className="font-medium">Editor de Layout</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Modifique a estrutura e layout de páginas</p>
                        <Button className="mt-auto w-full" variant="outline">Acessar</Button>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dashboard/admin/site-editor?tab=style">
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <Palette className="h-10 w-10 text-purple-600 mb-2 mt-2" />
                        <h3 className="font-medium">Estilos e Temas</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Personalize cores, fontes e aparência visual</p>
                        <Button className="mt-auto w-full" variant="outline">Personalizar</Button>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dashboard/admin/site-editor?tab=code">
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <Code className="h-10 w-10 text-green-600 mb-2 mt-2" />
                        <h3 className="font-medium">Editor de Código</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Edite diretamente o HTML, CSS e JavaScript</p>
                        <Button className="mt-auto w-full" variant="outline">Editar Código</Button>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dashboard/admin/site-editor?tab=settings">
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <Globe className="h-10 w-10 text-amber-600 mb-2 mt-2" />
                        <h3 className="font-medium">Configurações do Site</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Ajuste meta tags, SEO e configurações gerais</p>
                        <Button className="mt-auto w-full" variant="outline">Configurar</Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/admin/site-editor" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Abrir Editor Completo do Site
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Grid with Status and Subscription sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Status do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-gray-600" />
                  Status do Sistema
                </CardTitle>
                <CardDescription>
                  Status atual de todos os serviços
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {systemStatus.map((status) => (
                    <div key={status.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {status.status === 'operational' && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        )}
                        {status.status === 'degraded' && (
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        )}
                        {status.status === 'outage' && (
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        {status.status === 'maintenance' && (
                          <Clock className="h-5 w-5 text-blue-500 mr-2" />
                        )}
                        <div>
                          <div className="font-medium">{status.service}</div>
                          <div className="text-xs text-gray-500">{status.message}</div>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status.status === 'operational' ? 'bg-green-100 text-green-800' :
                          status.status === 'degraded' ? 'bg-amber-100 text-amber-800' :
                          status.status === 'outage' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {status.status === 'operational' && 'Operacional'}
                          {status.status === 'degraded' && 'Degradado'}
                          {status.status === 'outage' && 'Fora do ar'}
                          {status.status === 'maintenance' && 'Manutenção'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full">
                  Gerenciar Status do Sistema
                </Button>
              </CardFooter>
            </Card>

            {/* Estatísticas de Assinaturas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-gray-600" />
                  Assinaturas e Faturamento
                </CardTitle>
                <CardDescription>
                  Visão geral das assinaturas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Total de Assinaturas</div>
                    <div className="text-2xl font-bold">{subscriptionStats.total}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Assinaturas Ativas</div>
                    <div className="text-2xl font-bold text-green-700">{subscriptionStats.active}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Planos Pagos</div>
                    <div className="text-2xl font-bold text-blue-700">{subscriptionStats.paid}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Receita Mensal</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subscriptionStats.revenue)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Detalhes de Faturamento
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Logs e Auditoria */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ServerCrash className="mr-2 h-5 w-5 text-gray-600" />
                Logs e Auditoria
              </CardTitle>
              <CardDescription>
                Logs recentes do sistema e atividades dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-3 ${
                        i % 3 === 0 ? 'bg-amber-500' :
                        i % 3 === 1 ? 'bg-green-500' :
                        'bg-gray-500'
                      }`} />
                      <div>
                        <div className="font-medium">
                          {i % 3 === 0 ? 'Login realizado' :
                           i % 3 === 1 ? 'Novo usuário registrado' :
                           'Configuração alterada'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {i % 3 === 0 ? 'João Silva' :
                           i % 3 === 1 ? 'Maria Oliveira' :
                           'Admin Master'} - IP: 192.168.{i}.{i+10}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(Date.now() - i * 3600000).toLocaleString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver Todos os Logs
              </Button>
            </CardFooter>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Ações administrativas comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Novo Usuário</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Exportar Relatórios</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Database className="h-6 w-6 mb-2" />
                  <span>Backup do Sistema</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Activity className="h-6 w-6 mb-2" />
                  <span>Atualizar Status</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
