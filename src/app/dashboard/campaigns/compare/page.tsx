"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronDown, X, BarChart3, LineChart, PieChart, Download, Search } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/DashboardLayout';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
} from 'recharts';

// Helper function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Metrics to compare
const metrics = [
  { id: 'visits', name: 'Visitas', type: 'number' },
  { id: 'conversions', name: 'Conversões', type: 'number' },
  { id: 'conversionRate', name: 'Taxa de Conversão', type: 'percentage' },
  { id: 'revenue', name: 'Receita', type: 'currency' },
  { id: 'spend', name: 'Custo', type: 'currency' },
  { id: 'profit', name: 'Lucro', type: 'currency' },
  { id: 'roi', name: 'ROI', type: 'percentage' },
  { id: 'cpc', name: 'CPC', type: 'currency' },
  { id: 'cpa', name: 'CPA', type: 'currency' },
];

export default function CampaignComparisonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { campaigns } = useAppStore();

  // Get campaign IDs from URL
  const campaignIdsParam = searchParams.get('ids');
  const initialCampaignIds = campaignIdsParam ? campaignIdsParam.split(',') : [];

  // State
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>(initialCampaignIds);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['visits', 'conversions', 'revenue', 'conversionRate']);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  const [selectedCampaigns, setSelectedCampaigns] = useState<any[]>([]);
  const [chartType, setChartType] = useState('bar');
  const [activePeriod, setActivePeriod] = useState('month');

  // Filter campaigns based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.utmSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.utmMedium.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.utmCampaign.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    } else {
      setFilteredCampaigns(campaigns);
    }
  }, [searchTerm, campaigns]);

  // Update selected campaigns when IDs change
  useEffect(() => {
    const selected = campaigns.filter(campaign => selectedCampaignIds.includes(campaign.id));

    // Enhance campaigns with calculated metrics
    const enhancedCampaigns = selected.map(campaign => {
      const visits = campaign.visits || 0;
      const conversions = campaign.conversions || 0;
      const revenue = campaign.revenue || 0;
      const spend = campaign.spend || 0;

      return {
        ...campaign,
        conversionRate: visits > 0 ? (conversions / visits) * 100 : 0,
        profit: revenue - spend,
        roi: spend > 0 ? ((revenue - spend) / spend) * 100 : 0,
        cpc: visits > 0 ? spend / visits : 0,
        cpa: conversions > 0 ? spend / conversions : 0,
      };
    });

    setSelectedCampaigns(enhancedCampaigns);

    // Update URL with selected campaign IDs
    if (selectedCampaignIds.length > 0) {
      const params = new URLSearchParams();
      params.set('ids', selectedCampaignIds.join(','));
      router.push(`/dashboard/campaigns/compare?${params.toString()}`);
    }
  }, [selectedCampaignIds, campaigns, router]);

  // Handle selecting/deselecting a campaign
  const toggleCampaignSelection = (campaignId: string) => {
    if (selectedCampaignIds.includes(campaignId)) {
      setSelectedCampaignIds(prev => prev.filter(id => id !== campaignId));
    } else {
      // Limit to max 5 campaigns for comparison
      if (selectedCampaignIds.length < 5) {
        setSelectedCampaignIds(prev => [...prev, campaignId]);
      }
    }
  };

  // Handle selecting/deselecting a metric
  const toggleMetricSelection = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(prev => prev.filter(id => id !== metricId));
    } else {
      setSelectedMetrics(prev => [...prev, metricId]);
    }
  };

  // Clear all selected campaigns
  const clearSelection = () => {
    setSelectedCampaignIds([]);
    router.push('/dashboard/campaigns/compare');
  };

  // Generate comparison chart data
  const generateChartData = () => {
    if (selectedCampaigns.length === 0 || selectedMetrics.length === 0) return [];

    return selectedMetrics.map(metricId => {
      const metric = metrics.find(m => m.id === metricId);
      const data = {
        name: metric?.name || metricId,
        ...selectedCampaigns.reduce((acc, campaign) => {
          acc[campaign.name] = campaign[metricId];
          return acc;
        }, {})
      };
      return data;
    });
  };

  // Generate chart for a specific metric
  const generateMetricChartData = (metricId: string) => {
    if (selectedCampaigns.length === 0) return [];

    return selectedCampaigns.map(campaign => ({
      name: campaign.name,
      value: campaign[metricId] || 0
    }));
  };

  // Format metric value based on type
  const formatMetricValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return value.toFixed(2) + '%';
      default:
        return value.toLocaleString('pt-BR');
    }
  };

  // Get colors for charts based on index
  const getColor = (index: number) => {
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    return colors[index % colors.length];
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comparar Campanhas</h1>
            <p className="text-gray-500 mt-1">Compare métricas entre diferentes campanhas</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline" onClick={clearSelection} disabled={selectedCampaignIds.length === 0}>
              Limpar Seleção
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Campaign Selection Panel */}
          <Card className="lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>Selecione Campanhas</CardTitle>
              <CardDescription>
                {selectedCampaignIds.length}/5 campanhas selecionadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar campanhas..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <ScrollArea className="h-[400px] border rounded-md">
                <div className="p-4 space-y-2">
                  {filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer border
                          ${selectedCampaignIds.includes(campaign.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        onClick={() => toggleCampaignSelection(campaign.id)}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{campaign.name}</p>
                          <div className="text-xs text-gray-500 mt-1 space-x-1">
                            <span>{formatNumber(campaign.visits || 0)} visitas</span>
                            <span>•</span>
                            <span>{formatCurrency(campaign.revenue)}</span>
                          </div>
                        </div>
                        {selectedCampaignIds.includes(campaign.id) && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p>Nenhuma campanha encontrada</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="mt-4">
                <Label className="mb-2 block">Métricas para Comparar</Label>
                <div className="flex flex-wrap gap-2">
                  {metrics.map((metric) => (
                    <button
                      key={metric.id}
                      className={`text-xs rounded-full px-3 py-1 border ${
                        selectedMetrics.includes(metric.id)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleMetricSelection(metric.id)}
                    >
                      {metric.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Results */}
          <div className="lg:col-span-8 space-y-6">
            {selectedCampaigns.length === 0 ? (
              <Card className="text-center py-16">
                <div className="mx-auto max-w-md">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha selecionada</h3>
                  <p className="text-gray-500 mb-4">
                    Selecione até 5 campanhas no painel à esquerda para comparar suas métricas.
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {/* Visualization Controls */}
                <Card>
                  <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <Label>Visualização:</Label>
                      <Select value={chartType} onValueChange={setChartType}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Tipo de gráfico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Gráfico de Barras</SelectItem>
                          <SelectItem value="line">Gráfico de Linhas</SelectItem>
                          <SelectItem value="table">Tabela</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label>Período:</Label>
                      <Select value={activePeriod} onValueChange={setActivePeriod}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Último dia</SelectItem>
                          <SelectItem value="week">Última semana</SelectItem>
                          <SelectItem value="month">Último mês</SelectItem>
                          <SelectItem value="year">Último ano</SelectItem>
                          <SelectItem value="all">Todo período</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Charts */}
                {chartType === 'table' ? (
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle className="text-lg">Tabela Comparativa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border px-4 py-2 text-left">Métrica</th>
                              {selectedCampaigns.map((campaign) => (
                                <th key={campaign.id} className="border px-4 py-2 text-left">
                                  {campaign.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {metrics
                              .filter(metric => selectedMetrics.includes(metric.id))
                              .map((metric) => (
                                <tr key={metric.id} className="hover:bg-gray-50">
                                  <td className="border px-4 py-2 font-medium">{metric.name}</td>
                                  {selectedCampaigns.map((campaign) => (
                                    <td key={campaign.id} className="border px-4 py-2">
                                      {formatMetricValue(campaign[metric.id] || 0, metric.type)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Tabs defaultValue={selectedMetrics[0]} className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
                      {selectedMetrics.map(metricId => {
                        const metric = metrics.find(m => m.id === metricId);
                        return (
                          <TabsTrigger key={metricId} value={metricId}>
                            {metric?.name}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {selectedMetrics.map(metricId => {
                      const metric = metrics.find(m => m.id === metricId);
                      const chartData = generateMetricChartData(metricId);

                      return (
                        <TabsContent key={metricId} value={metricId}>
                          <Card>
                            <CardHeader className="pb-0">
                              <CardTitle className="text-lg">Comparação de {metric?.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                  {chartType === 'bar' ? (
                                    <BarChart data={chartData}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" />
                                      <YAxis />
                                      <Tooltip
                                        formatter={(value) => [
                                          formatMetricValue(Number(value), metric?.type || 'number'),
                                          metric?.name
                                        ]}
                                      />
                                      <Legend />
                                      <Bar
                                        dataKey="value"
                                        fill="#0088FE"
                                        name={metric?.name}
                                      />
                                    </BarChart>
                                  ) : (
                                    <RechartsLineChart data={chartData}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" />
                                      <YAxis />
                                      <Tooltip
                                        formatter={(value) => [
                                          formatMetricValue(Number(value), metric?.type || 'number'),
                                          metric?.name
                                        ]}
                                      />
                                      <Legend />
                                      <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#0088FE"
                                        name={metric?.name}
                                        strokeWidth={2}
                                      />
                                    </RechartsLineChart>
                                  )}
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                )}

                {/* Campaign Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCampaigns.map((campaign, index) => (
                    <Card key={campaign.id} className="overflow-hidden">
                      <div
                        className="h-1"
                        style={{ backgroundColor: getColor(index) }}
                      />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{campaign.name}</CardTitle>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCampaignSelection(campaign.id);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <CardDescription>
                          Criada em {formatDate(campaign.dateCreated)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        {metrics
                          .filter(metric => selectedMetrics.includes(metric.id))
                          .slice(0, 6) // Limit to top 6 metrics
                          .map(metric => (
                            <div key={metric.id} className="text-sm">
                              <p className="text-gray-500">{metric.name}</p>
                              <p className="font-medium">
                                {formatMetricValue(campaign[metric.id] || 0, metric.type)}
                              </p>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
