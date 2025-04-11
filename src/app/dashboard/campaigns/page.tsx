"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Filter,
  Search,
  Plus,
  ChevronDown,
  Edit,
  Trash2,
  MoreVertical,
  LineChart,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';

export default function CampaignsPage() {
  const router = useRouter();
  const { campaigns, deleteCampaign } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter(campaign => {
      // Filter by search term
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.utmSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.utmMedium.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Handle different field types
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortField === 'lastUpdated') {
        return sortDirection === 'asc'
          ? new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime()
          : new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime();
      }

      // Numerical fields
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Status badge colors
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

  // Handle copying URL to clipboard
  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);

    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  // Calculate campaign statistics
  const totalVisits = campaigns.reduce((sum, campaign) => sum + (campaign.visits || 0), 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const averageConversionRate = totalVisits > 0
    ? (totalConversions / totalVisits) * 100
    : 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
            <p className="text-gray-500 mt-1">Gerencie todas as suas campanhas de marketing</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => router.push('/dashboard/campaigns/compare')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Comparar
            </Button>
            <Button
              className="bg-primary text-white flex items-center"
              onClick={() => router.push('/dashboard/campaigns/new')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Campanha
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar campanhas..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-[150px]">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Todos Status</option>
                  <option value="active">Ativas</option>
                  <option value="paused">Pausadas</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>

              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Mais Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalVisits.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-gray-500 mt-1">Todos os canais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Conversões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalConversions.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total de conversões</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500 mt-1">Todos os canais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {averageConversionRate.toFixed(2)}%
                <ArrowUpRight className="ml-2 h-5 w-5 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Média de todas as campanhas</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Nome da Campanha
                      {sortField === 'name' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('visits')}>
                    <div className="flex items-center">
                      Visitas
                      {sortField === 'visits' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('conversions')}>
                    <div className="flex items-center">
                      Conversões
                      {sortField === 'conversions' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    <div className="flex items-center">
                      Taxa Conv.
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('revenue')}>
                    <div className="flex items-center">
                      Receita
                      {sortField === 'revenue' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/dashboard/campaigns/${campaign.id}`} className="hover:text-blue-600 hover:underline">
                          {campaign.name}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500 flex space-x-2">
                        <span>UTM: {campaign.utmCampaign}</span>
                        <span>•</span>
                        <span>Fonte: {campaign.utmSource}</span>
                        <span>•</span>
                        <span>Meio: {campaign.utmMedium}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
                        {campaign.status === 'active' && 'Ativa'}
                        {campaign.status === 'paused' && 'Pausada'}
                        {campaign.status === 'draft' && 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(campaign.visits || 0).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.conversions.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.visits && campaign.visits > 0
                        ? ((campaign.conversions / campaign.visits) * 100).toFixed(2)
                        : '0.00'}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      R$ {campaign.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <div className="flex space-x-1 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Copiar URL"
                          onClick={() => handleCopyUrl(campaign.url, campaign.id)}
                        >
                          {copied === campaign.id ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Abrir URL"
                          asChild
                        >
                          <a href={campaign.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Editar"
                          onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Visualizar"
                          onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Excluir"
                          onClick={() => setShowDeleteConfirm(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === campaign.id && (
                        <div className="absolute mt-2 p-3 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-60 right-8">
                          <div className="text-sm text-gray-700 mb-2 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-1 mt-0.5 text-amber-500 flex-shrink-0" />
                            <span>Tem certeza que deseja excluir esta campanha?</span>
                          </div>
                          <div className="flex space-x-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 text-xs"
                              onClick={() => {
                                deleteCampaign(campaign.id);
                                setShowDeleteConfirm(null);
                              }}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm || selectedStatus !== 'all'
                        ? 'Nenhuma campanha encontrada com os filtros selecionados'
                        : 'Nenhuma campanha cadastrada. Crie uma nova campanha usando o botão acima.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Exibindo <span className="font-medium">1</span> a <span className="font-medium">{filteredCampaigns.length}</span> de{' '}
                    <span className="font-medium">{filteredCampaigns.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      disabled
                    >
                      <span className="sr-only">Anterior</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                    <button
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      1
                    </button>
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      disabled
                    >
                      <span className="sr-only">Próxima</span>
                      <ChevronDown className="h-5 w-5 -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
