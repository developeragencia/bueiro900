"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    growth: number;
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    growth: number;
  };
  performance: {
    loadTime: number;
    uptime: number;
    errorRate: number;
  };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

const mockMetrics: PerformanceMetrics = {
  revenue: {
    current: 125000,
    previous: 100000,
    growth: 25
  },
  users: {
    total: 15000,
    active: 8500,
    growth: 12
  },
  orders: {
    total: 2500,
    completed: 2200,
    pending: 300,
    growth: 8
  },
  performance: {
    loadTime: 1.2,
    uptime: 99.9,
    errorRate: 0.5
  }
};

const mockChartData: ChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Receita',
      data: [65000, 75000, 85000, 95000, 110000, 125000]
    },
    {
      label: 'Usuários',
      data: [12000, 12500, 13000, 13800, 14500, 15000]
    }
  ]
};

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(mockMetrics);
  const [chartData, setChartData] = useState<ChartData>(mockChartData);
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simular atualização de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExportData = () => {
    // Implementar exportação de dados
    console.log('Exportando dados...');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
            <p className="text-gray-500 mt-1">
              Análise de desempenho e métricas do sistema
            </p>
          </div>
          <div className="flex space-x-4">
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="12m">Último ano</option>
            </select>
            <button
              onClick={handleRefreshData}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportData}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Receita</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(metrics.revenue.current)}
              </p>
              <div className="flex items-center mt-2">
                <span className={`flex items-center text-sm ${
                  metrics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.revenue.growth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(metrics.revenue.growth)}%
                </span>
                <span className="text-gray-500 text-sm ml-2">vs. período anterior</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Usuários</h3>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900">{metrics.users.total}</p>
              <div className="flex items-center mt-2">
                <span className={`flex items-center text-sm ${
                  metrics.users.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.users.growth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(metrics.users.growth)}%
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {metrics.users.active} ativos
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Pedidos</h3>
              <ShoppingCart className="h-5 w-5 text-purple-500" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900">{metrics.orders.total}</p>
              <div className="flex items-center mt-2">
                <span className={`flex items-center text-sm ${
                  metrics.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.orders.growth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(metrics.orders.growth)}%
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {metrics.orders.pending} pendentes
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Performance</h3>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.performance.loadTime}s
              </p>
              <div className="flex items-center mt-2">
                <span className="text-green-600 text-sm">
                  {metrics.performance.uptime}% uptime
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {metrics.performance.errorRate}% erros
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Receita x Tempo</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-80 flex items-center justify-center text-gray-500">
              Gráfico de Receita
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Usuários Ativos</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-80 flex items-center justify-center text-gray-500">
              Gráfico de Usuários
            </div>
          </div>
        </div>

        {/* Tabela de Métricas Detalhadas */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Métricas Detalhadas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Métrica
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Anterior
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Receita Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(metrics.revenue.current)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(metrics.revenue.previous)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center ${
                      metrics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metrics.revenue.growth >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(metrics.revenue.growth)}%
                    </span>
                  </td>
                </tr>
                {/* Adicionar mais linhas conforme necessário */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
