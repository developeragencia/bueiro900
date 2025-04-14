"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SummaryMetrics {
  revenue: {
    total: number;
    growth: number;
    lastPeriod: number;
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

const mockMetrics: SummaryMetrics = {
  revenue: {
    total: 125678.90,
    growth: 15.7,
    lastPeriod: 108765.43
  },
  customers: {
    total: 1234,
    active: 987,
    new: 45
  },
  sales: {
    total: 3456,
    average: 289.50,
    conversion: 3.2
  },
  integrations: {
    total: 15,
    active: 12,
    pending: 3
  }
};

interface RecentActivity {
  id: string;
  type: 'sale' | 'customer' | 'integration' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'pending' | 'error';
  amount?: number;
}

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Nova venda realizada',
    description: 'Venda #12345 concluída com sucesso',
    timestamp: '2024-03-18T14:30:00',
    status: 'success',
    amount: 299.99
  },
  {
    id: '2',
    type: 'customer',
    title: 'Novo cliente cadastrado',
    description: 'Cliente João Silva criou uma conta',
    timestamp: '2024-03-18T13:15:00',
    status: 'success'
  },
  {
    id: '3',
    type: 'integration',
    title: 'Integração atualizada',
    description: 'Facebook Business Manager sincronizado',
    timestamp: '2024-03-18T12:45:00',
    status: 'success'
  },
  {
    id: '4',
    type: 'alert',
    title: 'Alerta de sistema',
    description: 'Falha na sincronização com gateway de pagamento',
    timestamp: '2024-03-18T11:30:00',
    status: 'error'
  }
];

export default function SummaryPage() {
  const [metrics] = useState<SummaryMetrics>(mockMetrics);
  const [activities] = useState<RecentActivity[]>(mockActivities);
  const [dateRange, setDateRange] = useState('today');

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return '💰';
      case 'customer':
        return '👤';
      case 'integration':
        return '🔄';
      case 'alert':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resumo</h1>
            <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="week">Últimos 7 dias</option>
            <option value="month">Este mês</option>
            <option value="year">Este ano</option>
          </select>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-gray-500 text-sm font-medium">Receita Total</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(metrics.revenue.total)}
              </p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                +{metrics.revenue.growth}%
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              vs {formatCurrency(metrics.revenue.lastPeriod)} último período
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-gray-500 text-sm font-medium">Clientes</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.customers.active}
              </p>
              <p className="ml-2 text-sm text-gray-500">
                de {metrics.customers.total}
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {metrics.customers.new} novos clientes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-gray-500 text-sm font-medium">Vendas</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.sales.total}
              </p>
              <p className="ml-2 text-sm text-gray-500">
                {metrics.sales.conversion}% conversão
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Média de {formatCurrency(metrics.sales.average)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-gray-500 text-sm font-medium">Integrações</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.integrations.active}
              </p>
              <p className="ml-2 text-sm text-gray-500">
                de {metrics.integrations.total}
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {metrics.integrations.pending} pendentes
            </p>
          </motion.div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Atividades Recentes
            </h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50"
                >
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                      {activity.amount && (
                        <span className="font-medium text-gray-900">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 