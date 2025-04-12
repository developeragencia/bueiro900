"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash2,
  MoreVertical,
  Copy,
  Eye,
  BarChart2,
  ArrowUpRight,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Campaign, useAppStore } from "@/lib/store";
import { formatDate, formatCurrency } from "@/lib/utils";

export function CampaignList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Campaign>('dateCreated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();
  const { campaigns, deleteCampaign } = useAppStore(state => ({
    campaigns: state.campaigns,
    deleteCampaign: state.deleteCampaign
  }));

  // Filtragem e ordenação
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(campaign => {
        // Filtragem por termo de busca
        const matchesSearch =
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.utmSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.utmMedium.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.utmCampaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (campaign.utmTerm || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (campaign.utmContent || '').toLowerCase().includes(searchTerm.toLowerCase());

        // Filtragem por status
        const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Ordenação especial para campos tipo string
        if (sortField === 'name' || sortField === 'utmSource' || sortField === 'utmMedium') {
          return sortDirection === 'asc'
            ? String(a[sortField]).localeCompare(String(b[sortField]))
            : String(b[sortField]).localeCompare(String(a[sortField]));
        }

        // Ordenação para datas
        if (sortField === 'dateCreated' || sortField === 'dateUpdated') {
          return sortDirection === 'asc'
            ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
            : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
        }

        // Ordenação numérica
        const aValue = a[sortField] as number;
        const bValue = b[sortField] as number;

        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
  }, [campaigns, searchTerm, selectedStatus, sortField, sortDirection]);

  // Handler para alterar ordenação
  const handleSort = (field: keyof Campaign) => {
    if (sortField === field) {
      // Se já estiver ordenando por este campo, inverte a direção
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Se for um novo campo, define-o como campo de ordenação e começa com desc
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Confirmar e excluir campanha
  const confirmDelete = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign(campaignToDelete.id);
      toast.success(`Campanha "${campaignToDelete.name}" excluída com sucesso`);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error('Erro ao excluir campanha');
      console.error(error);
    }
  };

  // Copiar URL da campanha
  const copyUrl = (campaign: Campaign) => {
    try {
      const url = new URL(campaign.url);
      const params = new URLSearchParams();

      params.append('utm_source', campaign.utmSource);
      params.append('utm_medium', campaign.utmMedium);
      params.append('utm_campaign', campaign.utmCampaign);

      if (campaign.utmTerm) params.append('utm_term', campaign.utmTerm);
      if (campaign.utmContent) params.append('utm_content', campaign.utmContent);

      const fullUrl = `${url.origin}${url.pathname}${url.search ? url.search + '&' : '?'}${params.toString()}`;

      navigator.clipboard.writeText(fullUrl);
      toast.success('URL copiada para a área de transferência');
    } catch (error) {
      toast.error('Erro ao copiar URL');
      console.error(error);
    }
  };

  // Estilo da badge de status
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

  // Estilo para os indicadores de ROI (retorno sobre investimento)
  const getRoiClass = (campaign: Campaign) => {
    const roi = campaign.spend > 0 ? ((campaign.revenue / campaign.spend) - 1) * 100 : 0;

    if (roi > 100) return 'text-green-600';
    if (roi > 0) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <>
      {/* Filtros e Pesquisa */}
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

      {/* Lista de Campanhas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('utmSource')}>
                  <div className="flex items-center">
                    Fonte
                    {sortField === 'utmSource' && (
                      <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('utmMedium')}>
                  <div className="flex items-center">
                    Meio
                    {sortField === 'utmMedium' && (
                      <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('spend')}>
                  <div className="flex items-center">
                    Gasto
                    {sortField === 'spend' && (
                      <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('revenue')}>
                  <div className="flex items-center">
                    Receita
                    {sortField === 'revenue' && (
                      <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('dateCreated')}>
                  <div className="flex items-center">
                    Data Criação
                    {sortField === 'dateCreated' && (
                      <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
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
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{campaign.url}</div>
                    {campaign.tags && campaign.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {campaign.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                            <Tag className="h-3 w-3 mr-1 text-gray-500" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
                      {campaign.status === 'active' && 'Ativa'}
                      {campaign.status === 'paused' && 'Pausada'}
                      {campaign.status === 'draft' && 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.utmSource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.utmMedium}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(campaign.spend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatCurrency(campaign.revenue)}</div>
                    {campaign.spend > 0 && (
                      <div className={`text-xs mt-1 ${getRoiClass(campaign)}`}>
                        <ArrowUpRight className="h-3 w-3 inline mr-1" />
                        ROI: {(((campaign.revenue / campaign.spend) - 1) * 100).toFixed(2)}%
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(campaign.dateCreated)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Editar"
                        onClick={() => router.push(`/dashboard/campaigns/edit/${campaign.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Copiar URL"
                        onClick={() => copyUrl(campaign)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/campaigns/stats/${campaign.id}`)}>
                            <BarChart2 className="h-4 w-4 mr-2" />
                            Ver Estatísticas
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setCampaignToDelete(campaign);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma campanha encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {filteredCampaigns.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Exibindo <span className="font-medium">1</span> a <span className="font-medium">{filteredCampaigns.length}</span> de{' '}
                    <span className="font-medium">{filteredCampaigns.length}</span> campanhas
                  </p>
                </div>
                {filteredCampaigns.length > 10 && (
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <Button
                        variant="outline"
                        size="sm"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium"
                      >
                        <span className="sr-only">Anterior</span>
                        <ChevronDown className="h-5 w-5 rotate-90" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary text-sm font-medium text-white hover:bg-primary/90"
                      >
                        1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium"
                      >
                        <span className="sr-only">Próxima</span>
                        <ChevronDown className="h-5 w-5 -rotate-90" />
                      </Button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Campanha</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a campanha "{campaignToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
