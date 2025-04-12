"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner'; // Corrected import

// Sample report data
const REPORT_METRICS = {
  totalVisits: 45678,
  uniqueVisitors: 23456,
  conversions: 2345,
  conversionRate: 10.0,
  avgTimeOnSite: "2m 34s",
  bounceRate: 32.5,
};

const TOP_CAMPAIGNS = [
  { id: 'c001', name: 'Black Friday 2023', visits: 12543, conversions: 753, revenue: 45678.90 },
  { id: 'c002', name: 'Produto Premium', visits: 8976, conversions: 534, revenue: 32456.78 },
  { id: 'c003', name: 'Remarketing Geral', visits: 7654, conversions: 342, revenue: 21345.67 },
  { id: 'c004', name: 'E-mail Marketing', visits: 5432, conversions: 231, revenue: 15678.90 },
  { id: 'c005', name: 'Campanha Afiliados', visits: 4321, conversions: 176, revenue: 10987.65 },
];

const TOP_SOURCES = [
  { id: 's001', name: 'Google', visits: 15678, conversions: 876, conversionRate: 5.6 },
  { id: 's002', name: 'Facebook', visits: 12345, conversions: 654, conversionRate: 5.3 },
  { id: 's003', name: 'Instagram', visits: 9876, conversions: 432, conversionRate: 4.4 },
  { id: 's004', name: 'Email', visits: 6543, conversions: 345, conversionRate: 5.3 },
  { id: 's005', name: 'Direct', visits: 5432, conversions: 234, conversionRate: 4.3 },
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

export default function ReportsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleReport, setVisibleReport] = useState('overview');

  // Handlers para os botões "Ver Todas"
  const handleViewAllCampaigns = () => {
    router.push('/dashboard/campaigns');
  };

  const handleViewAllSources = () => {
    router.push('/dashboard/search?filter=sources');
  };

  // Handler para o botão de exportar
  const handleExport = () => {
    // Implementação de exportação
    alert('Exportando relatório...');
  };

  // Handler para filtrar resultados
  const handleFilterResults = (section: string) => {
    // Implementação de filtro
    alert(`Filtrando resultados de ${section}...`);
    // Aqui poderia abrir um modal ou expandir uma seção de filtros
  };

  // Handler para gerar relatório personalizado
  const handleGenerateCustomReport = () => {
    // Implementação de geração de relatório personalizado
    toast.success('Gerando relatório personalizado...', {
      description: 'Seu relatório será enviado para o seu email quando estiver pronto.'
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-500 mt-1">Visualize seus dados de desempenho e performance</p>
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
            <Button variant="outline" className="flex items-center" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Report Navigation */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            <Button
              variant={visibleReport === 'overview' ? "default" : "outline"}
              onClick={() => setVisibleReport('overview')}
              className="whitespace-nowrap"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Visão Geral
            </Button>
            <Button
              variant={visibleReport === 'campaigns' ? "default" : "outline"}
              onClick={() => setVisibleReport('campaigns')}
              className="whitespace-nowrap"
            >
              <LineChart className="mr-2 h-4 w-4" />
              Campanhas
            </Button>
            <Button
              variant={visibleReport === 'sources' ? "default" : "outline"}
              onClick={() => setVisibleReport('sources')}
              className="whitespace-nowrap"
            >
              <Layers className="mr-2 h-4 w-4" />
              Fontes
            </Button>
            <Button
              variant={visibleReport === 'conversions' ? "default" : "outline"}
              onClick={() => setVisibleReport('conversions')}
              className="whitespace-nowrap"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Conversões
            </Button>
            <Button
              variant={visibleReport === 'custom' ? "default" : "outline"}
              onClick={() => setVisibleReport('custom')}
              className="whitespace-nowrap"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Relatório Personalizado
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        {visibleReport === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Total de Visitas"
                value={REPORT_METRICS.totalVisits.toLocaleString('pt-BR')}
                change="+12.5%"
                trend="up"
              />
              <MetricCard
                title="Visitantes Únicos"
                value={REPORT_METRICS.uniqueVisitors.toLocaleString('pt-BR')}
                change="+8.3%"
                trend="up"
              />
              <MetricCard
                title="Conversões"
                value={REPORT_METRICS.conversions.toLocaleString('pt-BR')}
                change="+15.2%"
                trend="up"
              />
              <MetricCard
                title="Taxa de Conversão"
                value={`${REPORT_METRICS.conversionRate.toFixed(1)}%`}
                change="+2.8%"
                trend="up"
              />
              <MetricCard
                title="Tempo Médio no Site"
                value={REPORT_METRICS.avgTimeOnSite}
                change="-0.5%"
                trend="down"
              />
              <MetricCard
                title="Taxa de Rejeição"
                value={`${REPORT_METRICS.bounceRate}%`}
                change="-1.2%"
                trend="up"
                invertTrend
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Visitantes por Dia</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                    <LineChart className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Gráfico de Visitantes</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fontes de Tráfego</CardTitle>
                  <CardDescription>Distribuição atual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                    <PieChart className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Gráfico de Fontes</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Campaigns and Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg">Top Campanhas</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    onClick={handleViewAllCampaigns}
                  >
                    Ver Todas
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {TOP_CAMPAIGNS.map((campaign) => (
                      <div key={campaign.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="font-medium text-gray-800">{campaign.name}</div>
                          <div className="text-xs flex space-x-3 text-gray-500 mt-1">
                            <span>{campaign.visits.toLocaleString('pt-BR')} visitas</span>
                            <span>{campaign.conversions.toLocaleString('pt-BR')} conversões</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-800">
                            R$ {campaign.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            {(campaign.conversions / campaign.visits * 100).toFixed(1)}% conversão
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-2">
                  <div className="text-sm text-gray-500 w-full text-center">
                    Dados dos últimos 30 dias
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg">Top Fontes</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    onClick={handleViewAllSources}
                  >
                    Ver Todas
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {TOP_SOURCES.map((source) => (
                      <div key={source.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="font-medium text-gray-800">{source.name}</div>
                          <div className="text-xs flex space-x-3 text-gray-500 mt-1">
                            <span>{source.visits.toLocaleString('pt-BR')} visitas</span>
                            <span>{source.conversions.toLocaleString('pt-BR')} conversões</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-800">
                            {source.conversionRate.toFixed(1)}% conversão
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            {(source.conversions / TOP_SOURCES.reduce((sum, s) => sum + s.conversions, 0) * 100).toFixed(1)}% do total
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-2">
                  <div className="text-sm text-gray-500 w-full text-center">
                    Dados dos últimos 30 dias
                  </div>
                </CardFooter>
              </Card>
            </div>
          </>
        )}

        {/* Campaigns Section */}
        {visibleReport === 'campaigns' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar campanhas..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center whitespace-nowrap"
                  onClick={() => handleFilterResults('campanhas')}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar Resultados
                </Button>
              </div>

              <div className="mt-8 text-center text-gray-500">
                <LineChart className="h-20 w-20 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Gráfico de Desempenho de Campanhas</h3>
                <p className="mt-1">Selecione uma data e campanha específica para visualizar o relatório detalhado</p>
              </div>
            </div>
          </div>
        )}

        {/* Sources Section */}
        {visibleReport === 'sources' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar fontes..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center whitespace-nowrap"
                  onClick={() => handleFilterResults('fontes')}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar Resultados
                </Button>
              </div>

              <div className="mt-8 text-center text-gray-500">
                <PieChart className="h-20 w-20 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Distribuição de Tráfego por Fonte</h3>
                <p className="mt-1">Selecione um período para visualizar a distribuição detalhada de fontes</p>
              </div>
            </div>
          </div>
        )}

        {/* Conversions Section */}
        {visibleReport === 'conversions' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar conversões..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center whitespace-nowrap"
                  onClick={() => handleFilterResults('conversões')}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar Resultados
                </Button>
              </div>

              <div className="mt-8 text-center text-gray-500">
                <TrendingUp className="h-20 w-20 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Análise de Conversões</h3>
                <p className="mt-1">Selecione um período para visualizar a análise detalhada de conversões</p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Report Section */}
        {visibleReport === 'custom' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Crie seu Relatório Personalizado</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                    {DATE_RANGES.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agrupar por</label>
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                    <option value="day">Dia</option>
                    <option value="week">Semana</option>
                    <option value="month">Mês</option>
                    <option value="campaign">Campanha</option>
                    <option value="source">Fonte</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Métricas</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="metric-visits" className="mr-2" defaultChecked />
                    <label htmlFor="metric-visits">Visitas</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="metric-unique" className="mr-2" defaultChecked />
                    <label htmlFor="metric-unique">Visitantes Únicos</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="metric-conversions" className="mr-2" defaultChecked />
                    <label htmlFor="metric-conversions">Conversões</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="metric-rate" className="mr-2" defaultChecked />
                    <label htmlFor="metric-rate">Taxa de Conversão</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="metric-revenue" className="mr-2" defaultChecked />
                    <label htmlFor="metric-revenue">Receita</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="metric-roi" className="mr-2" />
                    <label htmlFor="metric-roi">ROI</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  className="bg-primary text-white"
                  onClick={handleGenerateCustomReport}
                >
                  Gerar Relatório
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ title, value, change, trend, invertTrend = false }: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  invertTrend?: boolean;
}) {
  // Determine if the trend is positive or negative based on the trend and invertTrend flag
  const isPositive = invertTrend ? trend === 'down' : trend === 'up';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
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
        </div>
      </CardContent>
    </Card>
  );
}
