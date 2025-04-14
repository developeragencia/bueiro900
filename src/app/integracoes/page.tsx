"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Puzzle,
  Plus,
  Search,
  Settings,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

interface Integration {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'inactive' | 'error';
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  createdAt: string;
  lastSync: string;
  errorMessage?: string;
}

const PLATFORMS = [
  { id: 'shopify', name: 'Shopify', icon: '🛍️' },
  { id: 'woocommerce', name: 'WooCommerce', icon: '🛒' },
  { id: 'mercadolivre', name: 'Mercado Livre', icon: '🌟' },
  { id: 'vtex', name: 'VTEX', icon: '🔷' },
  { id: 'magento', name: 'Magento', icon: '🎯' },
  { id: 'nuvemshop', name: 'Nuvemshop', icon: '☁️' },
  { id: 'b2w', name: 'B2W', icon: '🏪' },
  { id: 'correios', name: 'Correios', icon: '📦' },
  { id: 'jadlog', name: 'Jadlog', icon: '🚚' },
];

const mockIntegrations: Integration[] = [
  {
    id: 'int_001',
    name: 'Loja Principal',
    platform: 'shopify',
    status: 'active',
    apiKey: 'sk_test_123',
    secretKey: 'sk_secret_456',
    webhookUrl: 'https://api.example.com/webhooks/shopify',
    createdAt: '2024-01-15T10:00:00',
    lastSync: '2024-03-18T14:30:00'
  },
  {
    id: 'int_002',
    name: 'Marketplace ML',
    platform: 'mercadolivre',
    status: 'error',
    apiKey: 'ml_test_789',
    secretKey: 'ml_secret_012',
    webhookUrl: 'https://api.example.com/webhooks/mercadolivre',
    createdAt: '2024-02-20T09:30:00',
    lastSync: '2024-03-17T16:45:00',
    errorMessage: 'Falha na sincronização: Token expirado'
  }
];

export default function IntegracoesPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isEditingIntegration, setIsEditingIntegration] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    platform: '',
    apiKey: '',
    secretKey: '',
    webhookUrl: ''
  });

  const handleCreateIntegration = async () => {
    try {
      // Simula criação de integração
      const integration: Integration = {
        id: `int_${Math.floor(Math.random() * 1000)}`,
        ...newIntegration,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastSync: new Date().toISOString()
      };

      setIntegrations(prev => [integration, ...prev]);
      setIsEditingIntegration(false);
      setNewIntegration({
        name: '',
        platform: '',
        apiKey: '',
        secretKey: '',
        webhookUrl: ''
      });
      toast.success('Integração criada com sucesso');
    } catch (error) {
      toast.error('Erro ao criar integração');
    }
  };

  const handleUpdateIntegration = async () => {
    if (!selectedIntegration) return;

    try {
      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === selectedIntegration.id ? selectedIntegration : integration
        )
      );
      setIsEditingIntegration(false);
      toast.success('Integração atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar integração');
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    try {
      setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
      toast.success('Integração excluída com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir integração');
    }
  };

  const handleSyncIntegration = async (integrationId: string) => {
    try {
      // Simula sincronização
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === integrationId
            ? { ...integration, lastSync: new Date().toISOString(), status: 'active' as const }
            : integration
        )
      );
      toast.success('Sincronização realizada com sucesso');
    } catch (error) {
      toast.error('Erro ao sincronizar integração');
    }
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || integration.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
            <p className="text-gray-500">Gerencie suas integrações com plataformas</p>
          </div>
          <Button onClick={() => {
            setSelectedIntegration(null);
            setIsEditingIntegration(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Integração
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {PLATFORMS.map(platform => (
            <Link
              key={platform.id}
              href={`/integracoes/${platform.id}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-2xl mr-2">{platform.icon}</span>
                    {platform.name}
                  </CardTitle>
                  <CardDescription>
                    Configurar integração com {platform.name}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Refine a lista de integrações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar integrações..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as plataformas</SelectItem>
                  {PLATFORMS.map(platform => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">
                      {PLATFORMS.find(p => p.id === integration.platform)?.icon}
                    </span>
                    <div>
                      <CardTitle>{integration.name}</CardTitle>
                      <CardDescription>
                        {PLATFORMS.find(p => p.id === integration.platform)?.name}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIntegration(integration);
                          setIsEditingIntegration(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSyncIntegration(integration.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteIntegration(integration.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge className={getStatusColor(integration.status)}>
                      <div className="flex items-center">
                        {getStatusIcon(integration.status)}
                        <span className="ml-1">
                          {integration.status === 'active' ? 'Ativo' :
                           integration.status === 'inactive' ? 'Inativo' : 'Erro'}
                        </span>
                      </div>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Última sincronização: {new Date(integration.lastSync).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  {integration.errorMessage && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                      {integration.errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">API Key</p>
                      <p className="text-gray-600">•••••••••{integration.apiKey.slice(-4)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Secret Key</p>
                      <p className="text-gray-600">•••••••••{integration.secretKey.slice(-4)}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">Webhook URL</p>
                    <p className="text-gray-600 break-all">{integration.webhookUrl}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Integration Dialog */}
        <Dialog open={isEditingIntegration} onOpenChange={setIsEditingIntegration}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedIntegration ? 'Editar Integração' : 'Nova Integração'}
              </DialogTitle>
              <DialogDescription>
                {selectedIntegration
                  ? 'Edite as informações da integração'
                  : 'Configure uma nova integração'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Integração</label>
                <Input
                  value={selectedIntegration ? selectedIntegration.name : newIntegration.name}
                  onChange={(e) => {
                    if (selectedIntegration) {
                      setSelectedIntegration({ ...selectedIntegration, name: e.target.value });
                    } else {
                      setNewIntegration({ ...newIntegration, name: e.target.value });
                    }
                  }}
                  placeholder="Ex: Loja Principal"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Plataforma</label>
                <Select
                  value={selectedIntegration ? selectedIntegration.platform : newIntegration.platform}
                  onValueChange={(value) => {
                    if (selectedIntegration) {
                      setSelectedIntegration({ ...selectedIntegration, platform: value });
                    } else {
                      setNewIntegration({ ...newIntegration, platform: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(platform => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.icon} {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input
                  value={selectedIntegration ? selectedIntegration.apiKey : newIntegration.apiKey}
                  onChange={(e) => {
                    if (selectedIntegration) {
                      setSelectedIntegration({ ...selectedIntegration, apiKey: e.target.value });
                    } else {
                      setNewIntegration({ ...newIntegration, apiKey: e.target.value });
                    }
                  }}
                  placeholder="Chave da API"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Secret Key</label>
                <Input
                  type="password"
                  value={selectedIntegration ? selectedIntegration.secretKey : newIntegration.secretKey}
                  onChange={(e) => {
                    if (selectedIntegration) {
                      setSelectedIntegration({ ...selectedIntegration, secretKey: e.target.value });
                    } else {
                      setNewIntegration({ ...newIntegration, secretKey: e.target.value });
                    }
                  }}
                  placeholder="Chave secreta"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Webhook URL</label>
                <Input
                  value={selectedIntegration ? selectedIntegration.webhookUrl : newIntegration.webhookUrl}
                  onChange={(e) => {
                    if (selectedIntegration) {
                      setSelectedIntegration({ ...selectedIntegration, webhookUrl: e.target.value });
                    } else {
                      setNewIntegration({ ...newIntegration, webhookUrl: e.target.value });
                    }
                  }}
                  placeholder="URL para webhooks"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditingIntegration(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={selectedIntegration ? handleUpdateIntegration : handleCreateIntegration}
                  disabled={!selectedIntegration && (!newIntegration.name || !newIntegration.platform || !newIntegration.apiKey)}
                >
                  {selectedIntegration ? 'Salvar Alterações' : 'Criar Integração'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
