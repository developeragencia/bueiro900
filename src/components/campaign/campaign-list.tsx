"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Share2,
  Link2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UTMShareDialog } from './utm-share-dialog';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'ended';
  platform: 'facebook' | 'google' | 'instagram' | 'tiktok';
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  conversions: number;
  revenue: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  utmParameters: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
  };
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface CampaignListProps {
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
  onDuplicate: (campaign: Campaign) => void;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Black Friday 2024',
    description: 'Campanha principal para Black Friday',
    status: 'active',
    platform: 'facebook',
    budget: 5000,
    spent: 2500,
    clicks: 15000,
    impressions: 150000,
    conversions: 300,
    revenue: 15000,
    startDate: new Date('2024-11-20'),
    endDate: new Date('2024-11-27'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-15'),
    utmParameters: {
      source: 'facebook',
      medium: 'cpc',
      campaign: 'black_friday_2024',
      content: 'carousel_1'
    },
    createdBy: {
      id: '1',
      name: 'João Silva',
      avatar: 'https://github.com/shadcn.png'
    }
  },
  {
    id: '2',
    name: 'Lançamento Produto X',
    description: 'Campanha de lançamento do novo produto',
    status: 'paused',
    platform: 'google',
    budget: 3000,
    spent: 1500,
    clicks: 8000,
    impressions: 80000,
    conversions: 150,
    revenue: 7500,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-15'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-10'),
    utmParameters: {
      source: 'google',
      medium: 'cpc',
      campaign: 'produto_x_lancamento',
      term: 'produto x novo'
    },
    createdBy: {
      id: '2',
      name: 'Maria Santos'
    }
  }
];

export function CampaignList({ onEdit, onDelete, onDuplicate }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Campaign['platform'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Campaign['status'] | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Campaign>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isUtmDialogOpen, setIsUtmDialogOpen] = useState(false);

  const handleSort = (field: keyof Campaign) => {
    if (field === sortField) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter;
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchesSearch && matchesPlatform && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      setIsLoading(true);
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
      onDelete(campaignId);
      toast.success('Campanha excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir campanha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateCampaign = async (campaign: Campaign) => {
    try {
      setIsLoading(true);
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCampaign: Campaign = {
        ...campaign,
        id: Math.random().toString(36).substr(2, 9),
        name: `${campaign.name} (Cópia)`,
        status: 'paused',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setCampaigns(prev => [...prev, newCampaign]);
      onDuplicate(newCampaign);
      toast.success('Campanha duplicada com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar campanha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformColor = (platform: Campaign['platform']) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-100 text-blue-800';
      case 'google':
        return 'bg-red-100 text-red-800';
      case 'instagram':
        return 'bg-purple-100 text-purple-800';
      case 'tiktok':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'ended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const handleShareUtm = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsUtmDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar campanhas..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={platformFilter} onValueChange={value => setPlatformFilter(value as Campaign['platform'] | 'all')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={value => setStatusFilter(value as Campaign['status'] | 'all')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
                <SelectItem value="ended">Finalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y">
          <div className="bg-gray-50 p-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <button
                  className="flex items-center text-sm font-medium text-gray-600"
                  onClick={() => handleSort('name')}
                >
                  Campanha
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  className="flex items-center text-sm font-medium text-gray-600"
                  onClick={() => handleSort('platform')}
                >
                  Plataforma
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  className="flex items-center text-sm font-medium text-gray-600"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  className="flex items-center text-sm font-medium text-gray-600"
                  onClick={() => handleSort('spent')}
                >
                  Investimento
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="col-span-1">
                <button
                  className="flex items-center text-sm font-medium text-gray-600"
                  onClick={() => handleSort('conversions')}
                >
                  Conv.
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="col-span-1 text-right">Ações</div>
            </div>
          </div>
          <div className="divide-y">
            {filteredAndSortedCampaigns.map(campaign => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={campaign.createdBy.avatar} />
                        <AvatarFallback>{campaign.createdBy.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Criada em {format(campaign.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary" className={getPlatformColor(campaign.platform)}>
                      {campaign.platform.charAt(0).toUpperCase() + campaign.platform.slice(1)}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                      {campaign.status === 'active' ? 'Ativa' :
                       campaign.status === 'paused' ? 'Pausada' : 'Finalizada'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm">
                      <div>{formatCurrency(campaign.spent)}</div>
                      <div className="text-xs text-gray-500">
                        de {formatCurrency(campaign.budget)}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm">
                      <div>{formatNumber(campaign.conversions)}</div>
                      <div className="text-xs text-gray-500">
                        {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}% CVR
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEdit(campaign)}
                          className="flex items-center gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleShareUtm(campaign)}
                          className="flex items-center gap-2"
                        >
                          <Link2 className="h-4 w-4" />
                          <span>Compartilhar UTMs</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicateCampaign(campaign)}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Duplicar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {selectedCampaign && (
        <UTMShareDialog
          campaign={selectedCampaign}
          open={isUtmDialogOpen}
          onOpenChange={setIsUtmDialogOpen}
        />
      )}
    </div>
  );
}
