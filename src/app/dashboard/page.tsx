"use client";

import { useState, useEffect } from 'react';
import {
  BarChart2,
  Users,
  DollarSign,
  ShoppingCart,
  Bell,
  Settings,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardMetrics {
  revenue: {
    total: number;
    growth: number;
    lastUpdate: Date;
  };
  customers: {
    total: number;
    active: number;
    new: number;
  };
  sales: {
    total: number;
    average: number;
    conversion: number;
  };
  integrations: {
    total: number;
    active: number;
    pending: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'integration' | 'alert' | 'notification';
  title: string;
  description: string;
  date: Date;
  status?: 'success' | 'warning' | 'error';
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsResponse, activitiesResponse] = await Promise.all([
        fetch('/api/dashboard/metrics'),
        fetch('/api/dashboard/activities'),
      ]);

      const [metricsData, activitiesData] = await Promise.all([
        metricsResponse.json(),
        activitiesResponse.json(),
      ]);

      setMetrics(metricsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          Erro ao carregar métricas do dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Última atualização: {new Date(metrics.revenue.lastUpdate).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/notifications"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <Link
            href="/dashboard/settings"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
        </div>

      {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Receita Total</h3>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            R$ {metrics.revenue.total.toLocaleString('pt-BR')}
          </p>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              +{metrics.revenue.growth}% este mês
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Clientes Ativos</h3>
            <Users className="w-5 h-5 text-blue-500" />
              </div>
          <p className="text-2xl font-semibold text-gray-900">
            {metrics.customers.active.toLocaleString('pt-BR')}
          </p>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-600">
              +{metrics.customers.new} novos hoje
            </span>
              </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Vendas</h3>
            <ShoppingCart className="w-5 h-5 text-blue-500" />
                  </div>
          <p className="text-2xl font-semibold text-gray-900">
            {metrics.sales.total.toLocaleString('pt-BR')}
          </p>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-600">
              {metrics.sales.conversion}% taxa de conversão
            </span>
                  </div>
                </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Integrações</h3>
            <BarChart2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {metrics.integrations.active}/{metrics.integrations.total}
          </p>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-600">
              {metrics.integrations.pending} pendentes
            </span>
          </div>
        </div>
      </div>

      {/* Links Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Link
          href="/dashboard/sales"
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <ShoppingCart className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-900">Vendas</span>
        </Link>

        <Link
          href="/dashboard/customers"
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <Users className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-900">Clientes</span>
        </Link>

        <Link
          href="/dashboard/integrations"
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <BarChart2 className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-900">Integrações</span>
        </Link>

        <Link
          href="/dashboard/reports"
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <Calendar className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-900">Relatórios</span>
        </Link>

        <Link
          href="/dashboard/settings"
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <Settings className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-900">Configurações</span>
        </Link>

        <Link
          href="/dashboard/support"
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <AlertTriangle className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-900">Suporte</span>
        </Link>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Atividades Recentes</h2>
          <Link
            href="/dashboard/activities"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Ver todas
          </Link>
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50"
            >
              {activity.type === 'sale' && (
                <ShoppingCart className="w-5 h-5 text-green-500" />
              )}
              {activity.type === 'integration' && (
                <BarChart2 className="w-5 h-5 text-blue-500" />
              )}
              {activity.type === 'alert' && (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              {activity.type === 'notification' && (
                <Bell className="w-5 h-5 text-purple-500" />
              )}

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.date).toLocaleString('pt-BR')}
                </p>
              </div>

              {activity.status && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {activity.status === 'success'
                    ? 'Sucesso'
                    : activity.status === 'warning'
                    ? 'Atenção'
                    : 'Erro'}
          </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
