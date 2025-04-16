"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  Tag,
  SlidersHorizontal,
  ArrowDownUp,
  Eye,
  Edit,
  ExternalLink,
  Copy,
  CheckCircle,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { Campaign } from '@/lib/store';

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

// Status text
const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Ativa';
    case 'paused': return 'Pausada';
    case 'draft': return 'Rascunho';
    default: return status;
  }
};

export default function GlobalSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { campaigns } = useAppStore();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [sortField, setSortField] = useState<string>('dateUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Filters
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [minRevenue, setMinRevenue] = useState<string>('');
  const [maxRevenue, setMaxRevenue] = useState<string>('');
  const [minConversionRate, setMinConversionRate] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique platforms and tags for filters
  const uniquePlatforms = [...new Set(campaigns.map(c => c.platform).filter(Boolean))];
  const uniqueTags = [...new Set(campaigns.flatMap(c => c.tags || []))];

  // Handle filters change
  const handleStatusChange = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle sorting
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

  // Apply all filters and sorting
  useEffect(() => {
    let result = [...campaigns];

    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(campaign => {
        return (
          campaign.name.toLowerCase().includes(searchLower) ||
          campaign.url.toLowerCase().includes(searchLower) ||
          campaign.utmSource.toLowerCase().includes(searchLower) ||
          campaign.utmMedium.toLowerCase().includes(searchLower) ||
          campaign.utmCampaign.toLowerCase().includes(searchLower) ||
          (campaign.utmTerm && campaign.utmTerm.toLowerCase().includes(searchLower)) ||
          (campaign.utmContent && campaign.utmContent.toLowerCase().includes(searchLower)) ||
          (campaign.tags && campaign.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      });
    }

    // Apply status filters
    if (selectedStatuses.length > 0) {
      result = result.filter(campaign => selectedStatuses.includes(campaign.status));
    }

    // Apply platform filters
    if (selectedPlatforms.length > 0) {
      result = result.filter(campaign => campaign.platform && selectedPlatforms.includes(campaign.platform));
    }

    // Apply revenue filters
    if (minRevenue) {
      result = result.filter(campaign => campaign.revenue >= parseFloat(minRevenue));
    }

    if (maxRevenue) {
      result = result.filter(campaign => campaign.revenue <= parseFloat(maxRevenue));
    }

    // Apply conversion rate filter
    if (minConversionRate) {
      const minRate = parseFloat(minConversionRate);
      result = result.filter(campaign => {
        const rate = campaign.visits && campaign.visits > 0
          ? (campaign.conversions / campaign.visits) * 100
          : 0;
        return rate >= minRate;
      });
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      result = result.filter(campaign =>
        campaign.tags && campaign.tags.some(tag => selectedTags.includes(tag))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortField === 'dateUpdated') {
        return sortDirection === 'asc'
          ? new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime()
          : new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime();
      }

      if (sortField === 'dateCreated') {
        return sortDirection === 'asc'
          ? new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
          : new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      }

      if (sortField === 'conversionRate') {
        const rateA = a.visits && a.visits > 0 ? (a.conversions / a.visits) * 100 : 0;
        const rateB = b.visits && b.visits > 0 ? (b.conversions / b.visits) * 100 : 0;
        return sortDirection === 'asc' ? rateA - rateB : rateB - rateA;
      }

      // For numerical fields
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredCampaigns(result);
  }, [
    campaigns,
    searchTerm,
    selectedStatuses,
    selectedPlatforms,
    minRevenue,
    maxRevenue,
    minConversionRate,
    selectedTags,
    sortField,
    sortDirection
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedStatuses([]);
    setSelectedPlatforms([]);
    setMinRevenue('');
    setMaxRevenue('');
    setMinConversionRate('');
    setSelectedTags([]);
  };

  // Generate URL with search params
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    router.push(`/dashboard/search?${params.toString()}`);
  };

  // Handle copy URL
  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);

    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pesquisa Global</h1>
          <p className="text-gray-500 mt-1">Busque e filtre todas as suas campanhas</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar campanhas, tags, parâmetros UTM..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  className="flex items-center"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros {selectedStatuses.length + selectedPlatforms.length + selectedTags.length > 0 && `(${selectedStatuses.length + selectedPlatforms.length + selectedTags.length})`}
                </Button>

                <Button onClick={handleSearch}>
                  Buscar
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-1" />
                    Status
                  </h3>
                  <div className="space-y-2">
                    {['active', 'paused', 'draft'].map((status) => (
                      <div key={status} className="flex items-center">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => handleStatusChange(status)}
                        />
                        <label
                          htmlFor={`status-${status}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
                            {getStatusText(status)}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {uniquePlatforms.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-1" />
                      Plataformas
                    </h3>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {uniquePlatforms.map((platform) => (
                        <div key={platform} className="flex items-center">
                          <Checkbox
                            id={`platform-${platform}`}
                            checked={selectedPlatforms.includes(platform)}
                            onCheckedChange={() => handlePlatformChange(platform)}
                          />
                          <label
                            htmlFor={`platform-${platform}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {platform}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uniqueTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Tags
                    </h3>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {uniqueTags.map((tag) => (
                        <div key={tag} className="flex items-center">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => handleTagChange(tag)}
                          />
                          <label
                            htmlFor={`tag-${tag}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="md:col-span-3">
                  <h3 className="text-sm font-medium mb-2">Métricas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <Label htmlFor="minRevenue" className="mb-1 text-xs">Receita Mínima (R$)</Label>
                      <Input
                        id="minRevenue"
                        type="number"
                        placeholder="0.00"
                        value={minRevenue}
                        onChange={(e) => setMinRevenue(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="maxRevenue" className="mb-1 text-xs">Receita Máxima (R$)</Label>
                      <Input
                        id="maxRevenue"
                        type="number"
                        placeholder="0.00"
                        value={maxRevenue}
                        onChange={(e) => setMaxRevenue(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="minConversionRate" className="mb-1 text-xs">Taxa de Conversão Mínima (%)</Label>
                      <Input
                        id="minConversionRate"
                        type="number"
                        placeholder="0.00"
                        value={minConversionRate}
                        onChange={(e) => setMinConversionRate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end mt-2">
                  <Button variant="outline" onClick={resetFilters} className="mr-2">
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-2 text-sm text-gray-600">
          {filteredCampaigns.length > 0
            ? `${filteredCampaigns.length} resultado${filteredCampaigns.length === 1 ? '' : 's'} encontrado${filteredCampaigns.length === 1 ? '' : 's'}`
            : 'Nenhum resultado encontrado'}
        </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('conversionRate')}>
                    <div className="flex items-center">
                      Taxa Conv.
                      {sortField === 'conversionRate' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
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
                      <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
                        {campaign.platform && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {campaign.platform}
                          </span>
                        )}
                        {campaign.tags && campaign.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
                        {getStatusText(campaign.status)}
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
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Search className="h-10 w-10 text-gray-300" />
                        <p className="text-gray-500 font-medium">Nenhum resultado encontrado</p>
                        <p className="text-gray-400 max-w-md">
                          {searchTerm || selectedStatuses.length > 0 || selectedPlatforms.length > 0 || selectedTags.length > 0
                            ? 'Tente modificar seus filtros ou critérios de busca.'
                            : 'Utilize a barra de busca acima para procurar campanhas.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
