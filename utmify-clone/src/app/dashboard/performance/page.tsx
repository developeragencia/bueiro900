"use client";

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  FileDown,
  Users,
  Layers,
  CreditCard,
  Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';

// Sample performance data
const PERFORMANCE_DATA = {
  totalClicks: 87654,
  totalImpressions: 1456789,
  clickThroughRate: 6.02,
  conversionRate: 3.45,
  averageCPC: 0.87,
  costPerConversion: 25.34,
};

const CHANNEL_PERFORMANCE = [
  {
    id: 'ch001',
    name: 'Facebook Ads',
    clicks: 32156,
    impressions: 587654,
    ctr: 5.47,
    conversions: 986,
    convRate: 3.07,
    cost: 27542.67,
    cpc: 0.86,
    cpa: 27.93,
    trend: 'up'
  },
  {
    id: 'ch002',
    name: 'Google Ads',
    clicks: 28765,
    impressions: 456789,
    ctr: 6.30,
    conversions: 1432,
    convRate: 4.98,
    cost: 23456.78,
    cpc: 0.82,
    cpa: 16.38,
    trend: 'up'
  },
  {
    id: 'ch003',
    name: 'Instagram Ads',
    clicks: 15432,
    impressions: 234567,
    ctr: 6.58,
    conversions: 432,
    convRate: 2.80,
    cost: 12345.67,
    cpc: 0.80,
    cpa: 28.58,
    trend: 'down'
  },
  {
    id: 'ch004',
    name: 'Email Marketing',
    clicks: 7654,
    impressions: 98765,
    ctr: 7.75,
    conversions: 234,
    convRate: 3.06,
    cost: 3456.78,
    cpc: 0.45,
    cpa: 14.77,
    trend: 'up'
  },
  {
    id: 'ch005',
    name: 'Organic Search',
    clicks: 3647,
    impressions: 79014,
    ctr: 4.62,
    conversions: 143,
    convRate: 3.92,
    cost: 0,
    cpc: 0,
    cpa: 0,
    trend: 'up'
  },
];

// Funnel data
const FUNNEL_STAGES = [
  { id: 1, name: 'Visitas', value: 45678, percent: 100 },
  { id: 2, name: 'Cadastros', value: 7865, percent: 17.2 },
  { id: 3, name: 'Adicionou ao Carrinho', value: 4532, percent: 9.9 },
  { id: 4, name: 'Iniciou Checkout', value: 3245, percent: 7.1 },
  { id: 5, name: 'Compras', value: 2345, percent: 5.1 },
];

const DATE_RANGES = [
  { label: 'Hoje', value: 'today' },
  { label: 'Ontem', value: 'yesterday' },
  { label: 'Últimos 7 dias', value: '7days' },
  { label: 'Últimos 30 dias', value: '30days' },
  { label: 'Este mês', value: 'thisMonth' },
  { label: 'Mês passado', value: 'lastMonth' },
  { label: 'Personalizado', value: 'custom' },
];

export default function PerformancePage() {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Filter channels based on selection
  const filteredChannels = selectedChannel === 'all'
    ? CHANNEL_PERFORMANCE
    : CHANNEL_PERFORMANCE.filter(channel => channel.id === selectedChannel);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
            <p className="text-gray-500 mt-1">Análise detalhada do desempenho das suas campanhas</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <div className="relative">
              <select
                className="appearance-none w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {DATE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Performance Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <PerformanceMetricCard
            title="Total de Cliques"
            value={PERFORMANCE_DATA.totalClicks.toLocaleString('pt-BR')}
            icon={<Activity className="h-6 w-6 text-primary" />}
            change="+8.7%"
            trend="up"
          />
          <PerformanceMetricCard
            title="Impressões"
            value={PERFORMANCE_DATA.totalImpressions.toLocaleString('pt-BR')}
            icon={<Users className="h-6 w-6 text-primary" />}
            change="+12.3%"
            trend="up"
          />
          <PerformanceMetricCard
            title="CTR (Taxa de Cliques)"
            value={`${PERFORMANCE_DATA.clickThroughRate.toFixed(2)}%`}
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            change="-0.4%"
            trend="down"
          />
          <PerformanceMetricCard
            title="Taxa de Conversão"
            value={`${PERFORMANCE_DATA.conversionRate.toFixed(2)}%`}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            change="+1.2%"
            trend="up"
          />
          <PerformanceMetricCard
            title="CPC Médio"
            value={`R$ ${PERFORMANCE_DATA.averageCPC.toFixed(2)}`}
            icon={<Layers className="h-6 w-6 text-primary" />}
            change="-0.08%"
            trend="up"
            invertTrend
          />
          <PerformanceMetricCard
            title="Custo por Conversão"
            value={`R$ ${PERFORMANCE_DATA.costPerConversion.toFixed(2)}`}
            icon={<CreditCard className="h-6 w-6 text-primary" />}
            change="-2.1%"
            trend="down"
            invertTrend
          />
        </div>

        {/* Conversion Funnel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
            <CardDescription>Análise do progresso dos usuários em cada fase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FUNNEL_STAGES.map((stage, index) => (
                <div key={stage.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{stage.name}</span>
                    <span className="text-gray-500">
                      {stage.value.toLocaleString('pt-BR')} ({stage.percent}%)
                    </span>
                  </div>
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all rounded-full"
                      style={{ width: `${stage.percent}%` }}
                    />
                  </div>
                  {index < FUNNEL_STAGES.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowDownRight className="h-4 w-4 text-gray-400 rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-gray-700">Taxa de Conversão Total</p>
                <p className="text-2xl font-bold text-primary">
                  {((FUNNEL_STAGES[FUNNEL_STAGES.length - 1].value / FUNNEL_STAGES[0].value) * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500">
                  {FUNNEL_STAGES[FUNNEL_STAGES.length - 1].value.toLocaleString('pt-BR')} conversões de {FUNNEL_STAGES[0].value.toLocaleString('pt-BR')} visitas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle>Performance por Canal</CardTitle>
              <CardDescription>Comparativo de desempenho entre canais de marketing</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="text-sm border border-gray-200 rounded-md px-2 py-1"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
              >
                <option value="all">Todos os Canais</option>
                {CHANNEL_PERFORMANCE.map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>
              <Button variant="ghost" size="sm">
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Canal
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliques
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Impressões
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversões
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conv. Rate
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Custo
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPC
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPA
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tendência
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChannels.map((channel) => (
                    <tr key={channel.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {channel.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {channel.clicks.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {channel.impressions.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {channel.ctr.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {channel.conversions.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {channel.convRate.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        R$ {channel.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {channel.cpc > 0 ? `R$ ${channel.cpc.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {channel.cpa > 0 ? `R$ ${channel.cpa.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            channel.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {channel.trend === 'up' ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {channel.trend === 'up' ? 'Alta' : 'Baixa'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 py-3 px-6">
            <div className="text-sm text-gray-500">
              Dados atualizados em: 10/04/2025 às 18:45
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function PerformanceMetricCard({ title, value, icon, change, trend, invertTrend = false }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  invertTrend?: boolean;
}) {
  // Determine if the trend is positive or negative based on the trend and invertTrend flag
  const isPositive = invertTrend ? trend === 'down' : trend === 'up';

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
              isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
