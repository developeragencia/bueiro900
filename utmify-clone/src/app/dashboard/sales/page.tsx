"use client";

import { useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  LineChart,
  BarChart3,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  CreditCard,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';

// Sample sales data
const SALES_SUMMARY = {
  totalRevenue: 87654.32,
  totalOrders: 1234,
  averageOrderValue: 71.03,
  conversionRate: 3.45,
  returnRate: 2.8,
  revenueGrowth: 15.7
};

const TOP_CAMPAIGNS = [
  { id: 'c001', name: 'Black Friday 2023', orders: 456, revenue: 45678.90, aov: 100.17, conversion: 8.7 },
  { id: 'c002', name: 'Produto Premium', orders: 345, revenue: 32456.78, aov: 94.08, conversion: 6.2 },
  { id: 'c003', name: 'Remarketing Geral', orders: 213, revenue: 16789.45, aov: 78.82, conversion: 4.8 },
  { id: 'c004', name: 'E-mail Marketing', orders: 189, revenue: 11234.56, aov: 59.44, conversion: 9.5 },
  { id: 'c005', name: 'Campanha Afiliados', orders: 176, revenue: 10987.65, aov: 62.43, conversion: 5.1 },
];

const SALES_BY_SOURCE = [
  { id: 's001', name: 'Google', orders: 456, revenue: 32456.78, percentage: 37.0 },
  { id: 's002', name: 'Facebook', orders: 321, revenue: 24567.89, percentage: 28.0 },
  { id: 's003', name: 'Instagram', orders: 234, revenue: 12345.67, percentage: 14.1 },
  { id: 's004', name: 'Email', orders: 189, revenue: 11234.56, percentage: 12.8 },
  { id: 's005', name: 'Direct', orders: 156, revenue: 7123.45, percentage: 8.1 },
];

const RECENT_ORDERS = [
  { id: 'ord001', date: '2023-09-15 13:45:22', customer: 'João Silva', total: 345.67, items: 3, status: 'completed', source: 'facebook' },
  { id: 'ord002', date: '2023-09-15 11:23:45', customer: 'Maria Oliveira', total: 789.90, items: 5, status: 'completed', source: 'google' },
  { id: 'ord003', date: '2023-09-15 10:15:33', customer: 'Carlos Santos', total: 123.45, items: 2, status: 'processing', source: 'instagram' },
  { id: 'ord004', date: '2023-09-15 09:05:12', customer: 'Ana Pereira', total: 456.78, items: 4, status: 'completed', source: 'email' },
  { id: 'ord005', date: '2023-09-15 08:34:56', customer: 'Pedro Souza', total: 234.56, items: 1, status: 'processing', source: 'facebook' },
];

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 45678.90 },
  { month: 'Fev', revenue: 54321.87 },
  { month: 'Mar', revenue: 67890.12 },
  { month: 'Abr', revenue: 78901.23 },
  { month: 'Mai', revenue: 65432.10 },
  { month: 'Jun', revenue: 76543.21 },
  { month: 'Jul', revenue: 87654.32 },
  { month: 'Ago', revenue: 98765.43 },
  { month: 'Set', revenue: 87654.32 },
  { month: 'Out', revenue: 76543.21 },
  { month: 'Nov', revenue: 87654.32 },
  { month: 'Dez', revenue: 109876.54 },
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

export default function SalesPage() {
  const [dateRange, setDateRange] = useState('30days');
  const [activePeriod, setActivePeriod] = useState('monthly');

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
            <p className="text-gray-500 mt-1">Acompanhe todos os dados de receita e vendas</p>
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

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SalesMetricCard
            title="Receita Total"
            value={`R$ ${SALES_SUMMARY.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<DollarSign className="h-6 w-6 text-primary" />}
            change={`+${SALES_SUMMARY.revenueGrowth}%`}
            trend="up"
          />
          <SalesMetricCard
            title="Total de Pedidos"
            value={SALES_SUMMARY.totalOrders.toLocaleString('pt-BR')}
            icon={<ShoppingCart className="h-6 w-6 text-primary" />}
            change="+8.2%"
            trend="up"
          />
          <SalesMetricCard
            title="Valor Médio do Pedido"
            value={`R$ ${SALES_SUMMARY.averageOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<CreditCard className="h-6 w-6 text-primary" />}
            change="+5.4%"
            trend="up"
          />
          <SalesMetricCard
            title="Taxa de Conversão"
            value={`${SALES_SUMMARY.conversionRate.toFixed(2)}%`}
            icon={<Users className="h-6 w-6 text-primary" />}
            change="+1.2%"
            trend="up"
          />
          <SalesMetricCard
            title="Taxa de Devolução"
            value={`${SALES_SUMMARY.returnRate.toFixed(2)}%`}
            icon={<LineChart className="h-6 w-6 text-primary" />}
            change="-0.5%"
            trend="down"
            invertTrend
          />
          <SalesMetricCard
            title="Crescimento da Receita"
            value={`${SALES_SUMMARY.revenueGrowth.toFixed(1)}%`}
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            change="+3.2%"
            trend="up"
          />
        </div>

        {/* Revenue Chart */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle>Receita por Período</CardTitle>
              <CardDescription>Análise de receita ao longo do tempo</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-md p-1">
                <Button
                  variant={activePeriod === 'daily' ? "default" : "ghost"}
                  onClick={() => setActivePeriod('daily')}
                  size="sm"
                  className="text-xs"
                >
                  Diário
                </Button>
                <Button
                  variant={activePeriod === 'weekly' ? "default" : "ghost"}
                  onClick={() => setActivePeriod('weekly')}
                  size="sm"
                  className="text-xs"
                >
                  Semanal
                </Button>
                <Button
                  variant={activePeriod === 'monthly' ? "default" : "ghost"}
                  onClick={() => setActivePeriod('monthly')}
                  size="sm"
                  className="text-xs"
                >
                  Mensal
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
              <LineChart className="h-10 w-10 text-gray-400" />
              <span className="ml-2 text-gray-500">Gráfico de Receita</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-gray-50 border-t py-3">
            <div className="text-sm text-gray-500">
              Período: {activePeriod === 'daily' ? 'Últimos 30 dias' : activePeriod === 'weekly' ? 'Últimas 12 semanas' : 'Últimos 12 meses'}
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          </CardFooter>
        </Card>

        {/* Top Campaigns and Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg">Top Campanhas por Receita</CardTitle>
              <Button variant="ghost" size="sm" className="text-sm">Ver Todas</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TOP_CAMPAIGNS.map((campaign) => (
                  <div key={campaign.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="font-medium text-gray-800">{campaign.name}</div>
                      <div className="text-xs flex space-x-3 text-gray-500 mt-1">
                        <span>{campaign.orders} pedidos</span>
                        <span>{campaign.conversion.toFixed(1)}% conversão</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-800">
                        R$ {campaign.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        AOV: R$ {campaign.aov.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 py-2 flex justify-end">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exportar CSV
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg">Receita por Fonte</CardTitle>
              <Button variant="ghost" size="sm" className="text-sm">Ver Detalhes</Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4 h-48">
                <PieChart className="h-20 w-20 text-gray-300" />
              </div>
              <div className="space-y-2">
                {SALES_BY_SOURCE.map((source) => (
                  <div key={source.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 bg-primary opacity-${Math.floor(source.percentage / 10) * 10}`} />
                      <span className="text-sm font-medium">{source.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">
                        R$ {source.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500 ml-2">({source.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 py-2 flex justify-between">
              <div className="text-sm text-gray-500">
                Total: R$ {SALES_SUMMARY.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>Os últimos pedidos recebidos na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID do Pedido
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Itens
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fonte
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.items}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status === 'completed' ? 'Concluído' : 'Processando'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {order.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 flex justify-between">
            <div className="text-sm text-gray-500">
              Exibindo 5 de 125 pedidos
            </div>
            <Button variant="outline" size="sm">Ver Todos os Pedidos</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function SalesMetricCard({ title, value, icon, change, trend, invertTrend = false }: {
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
