"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BarChart3,
  Edit,
  Copy,
  ExternalLink,
  Calendar,
  Smartphone,
  Globe,
  Info,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Users,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/DashboardLayout';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { UTMShareDialog } from '@/components/campaign/utm-share-dialog';

// Helper to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Generate random data for demo charts
const generateDailyData = (days = 30) => {
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);

    data.push({
      date: date.toISOString().split('T')[0],
      visits: Math.floor(Math.random() * 100) + 20,
      conversions: Math.floor(Math.random() * 20),
      revenue: (Math.random() * 1000 + 500).toFixed(2),
    });
  }

  return data;
};

// Device data
const deviceData = [
  { name: 'Desktop', value: 65 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 5 },
];

// Source data
const sourceData = [
  { name: 'Facebook', visits: 1200, conversions: 120 },
  { name: 'Instagram', visits: 800, conversions: 80 },
  { name: 'Google', visits: 600, conversions: 90 },
  { name: 'Direct', visits: 400, conversions: 30 },
  { name: 'Referral', visits: 200, conversions: 20 },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [dailyData, setDailyData] = useState(generateDailyData());

  const { campaigns } = useAppStore();
  const campaign = campaigns.find(c => c.id === id);

  useEffect(() => {
    if (!campaign) {
      router.push('/dashboard/campaigns');
    }
  }, [campaign, router]);

  // Handle refresh data
  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDailyData(generateDailyData());
      setIsLoading(false);
    }, 1000);
  };

  // Handle copy URL
  const handleCopyUrl = () => {
    if (campaign) {
      navigator.clipboard.writeText(campaign.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!campaign) {
    return null;
  }

  // Calculate metrics
  const totalVisits = campaign.visits || 0;
  const totalConversions = campaign.conversions;
  const conversionRate = totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;
  const revenue = campaign.revenue;
  const revenuePerVisit = totalVisits > 0 ? revenue / totalVisits : 0;
  const revenuePerConversion = totalConversions > 0 ? revenue / totalConversions : 0;

  // Status badge style
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-amber-100 text-amber-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        {/* Back button and header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() => router.push('/dashboard/campaigns')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para campanhas
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
                  {getStatusText(campaign.status)}
                </span>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-sm">Criada em {formatDate(campaign.dateCreated)}</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="text-sm"
                onClick={handleCopyUrl}
              >
                {copied ? (
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? 'Copiado!' : 'Copiar URL'}
              </Button>

              {/* Add the UTM Share Dialog Component */}
              <UTMShareDialog campaign={campaign} />

              <Button
                variant="outline"
                className="text-sm"
                asChild
              >
                <a href={campaign.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir URL
                </a>
              </Button>
              <Button
                className="text-sm bg-primary"
                onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Campanha
              </Button>
            </div>
          </div>
        </div>

        {/* Campaign UTM info card */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações da Campanha</CardTitle>
            <CardDescription>Detalhes dos parâmetros UTM utilizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">URL Base</h3>
                <p className="mt-1 text-sm text-gray-900 break-all">{campaign.url.split('?')[0]}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">UTM Source</h3>
                <p className="mt-1 text-sm text-gray-900">{campaign.utmSource}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">UTM Medium</h3>
                <p className="mt-1 text-sm text-gray-900">{campaign.utmMedium}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">UTM Campaign</h3>
                <p className="mt-1 text-sm text-gray-900">{campaign.utmCampaign}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {campaign.tags && campaign.tags.length > 0 ? (
                    campaign.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Sem tags</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Visitas</p>
                  <h3 className="text-2xl font-bold mt-1">{totalVisits.toLocaleString('pt-BR')}</h3>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+12% essa semana</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversões</p>
                  <h3 className="text-2xl font-bold mt-1">{totalConversions.toLocaleString('pt-BR')}</h3>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+8% essa semana</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
                  <h3 className="text-2xl font-bold mt-1">{conversionRate.toFixed(2)}%</h3>
                </div>
                <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+2% essa semana</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Receita</p>
                  <h3 className="text-2xl font-bold mt-1">R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-xs text-red-500">-3% essa semana</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <Card className="mb-6">
          <CardHeader className="pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Performance ao Longo do Tempo</CardTitle>
              <CardDescription>Métricas de performance da campanha</CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <select
                className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visits" className="mt-2">
              <TabsList>
                <TabsTrigger value="visits">Visitas</TabsTrigger>
                <TabsTrigger value="conversions">Conversões</TabsTrigger>
                <TabsTrigger value="revenue">Receita</TabsTrigger>
                <TabsTrigger value="combined">Combinado</TabsTrigger>
              </TabsList>

              <TabsContent value="visits" className="mt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#0088FE" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="conversions" className="mt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conversions" stroke="#00C49F" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="mt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="combined" className="mt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="visits" stroke="#0088FE" strokeWidth={2} dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#00C49F" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Segmentation Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Dispositivos</CardTitle>
              <CardDescription>Distribuição de visitas por dispositivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Fontes</CardTitle>
              <CardDescription>Métricas por fonte de tráfego</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" fill="#0088FE" name="Visitas" />
                    <Bar dataKey="conversions" fill="#00C49F" name="Conversões" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Métricas Avançadas</CardTitle>
            <CardDescription>Análise detalhada de performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Receita por Visita</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">R$ {revenuePerVisit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <div className="flex items-center ml-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">+5%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Média de receita gerada por cada visita</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Receita por Conversão</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">R$ {revenuePerConversion.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <div className="flex items-center ml-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">+2%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Valor médio de cada conversão</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">ROI Estimado</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{(campaign.spend > 0 ? (campaign.revenue / campaign.spend) * 100 : 0).toFixed(2)}%</span>
                  <div className="flex items-center ml-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">+8%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Retorno sobre investimento em publicidade</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Custo por Clique (CPC)</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">R$ {(totalVisits > 0 ? campaign.spend / totalVisits : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Custo médio por clique na campanha</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Custo por Aquisição (CPA)</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">R$ {(totalConversions > 0 ? campaign.spend / totalConversions : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Custo médio por conversão</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Lucro Estimado</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">R$ {(campaign.revenue - campaign.spend).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Receita menos custo de publicidade</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
