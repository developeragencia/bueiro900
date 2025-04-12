"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import {
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Settings,
  HelpCircle,
  RefreshCw,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';

// Dashboard activities
const ACTIVITIES = [
  {
    id: 'act-1',
    text: 'Campanha atualizada',
    time: 'Há 1 hora atrás',
    icon: <RefreshCw className="h-5 w-5 text-primary" />
  },
  {
    id: 'act-2',
    text: 'Nova venda registrada',
    time: 'Há 2 horas atrás',
    icon: <DollarSign className="h-5 w-5 text-primary" />
  },
  {
    id: 'act-3',
    text: 'Novo usuário criado',
    time: 'Há 3 horas atrás',
    icon: <Users className="h-5 w-5 text-primary" />
  },
  {
    id: 'act-4',
    text: 'Integração configurada',
    time: 'Há 4 horas atrás',
    icon: <Settings className="h-5 w-5 text-primary" />
  },
  {
    id: 'act-5',
    text: 'Relatório exportado',
    time: 'Há 5 horas atrás',
    icon: <BarChart3 className="h-5 w-5 text-primary" />
  }
];

export default function Dashboard() {
  const router = useRouter();

  // Handler for "Ver todas" button in recent activities
  const handleViewAllActivities = () => {
    router.push('/dashboard/notifications');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao seu painel de controle, Usuário!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Vendas"
            value="R$ 45.678,00"
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Campanhas Ativas"
            value="24"
            change="+3"
            trend="up"
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Taxa de Conversão"
            value="3.2%"
            change="+0.5%"
            trend="up"
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Novos Usuários"
            value="187"
            change="-14"
            trend="down"
            icon={<Users className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Campanha</CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                <BarChart3 className="h-10 w-10 text-gray-400" />
                <span className="ml-2 text-gray-500">Gráfico de Vendas</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance por Canal</CardTitle>
              <CardDescription>Distribuição atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                <PieChart className="h-10 w-10 text-gray-400" />
                <span className="ml-2 text-gray-500">Gráfico de Canais</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>As últimas 10 atividades no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-start p-2 rounded-lg hover:bg-gray-50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 flex justify-between">
            <p className="text-sm text-gray-500">Mostrando 5 de 10 atividades</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewAllActivities}
            >
              Ver todas
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatsCard({ title, value, change, trend, icon }: {
  title: string,
  value: string,
  change: string,
  trend: 'up' | 'down',
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
            )}
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
