"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Copy,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Key,
  Link as LinkIcon,
  Settings,
  Loader2
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: {
    apiKey: boolean;
    secretKey: boolean;
    storeUrl: boolean;
    webhookUrl: boolean;
    appId: boolean;
    appSecret: boolean;
  };
  webhookEvents: string[];
  documentation: string;
}

const PLATFORM_CONFIGS: { [key: string]: PlatformConfig } = {
  'shopify': {
    id: 'shopify',
    name: 'Shopify',
    icon: '🛍️',
    description: 'Integre sua loja Shopify para sincronizar produtos, pedidos e clientes automaticamente.',
    fields: {
      apiKey: true,
      secretKey: true,
      storeUrl: true,
      webhookUrl: true,
      appId: false,
      appSecret: false
    },
    webhookEvents: [
      'orders/create',
      'orders/update',
      'products/create',
      'products/update',
      'customers/create',
      'customers/update'
    ],
    documentation: 'https://shopify.dev/api/admin-rest'
  },
  'woocommerce': {
    id: 'woocommerce',
    name: 'WooCommerce',
    icon: '🛒',
    description: 'Conecte sua loja WooCommerce para gerenciar produtos e pedidos de forma integrada.',
    fields: {
      apiKey: true,
      secretKey: true,
      storeUrl: true,
      webhookUrl: true,
      appId: false,
      appSecret: false
    },
    webhookEvents: [
      'order.created',
      'order.updated',
      'product.created',
      'product.updated',
      'customer.created',
      'customer.updated'
    ],
    documentation: 'https://woocommerce.github.io/woocommerce-rest-api-docs/'
  },
  'mercadolivre': {
    id: 'mercadolivre',
    name: 'Mercado Livre',
    icon: '🌟',
    description: 'Integre sua conta do Mercado Livre para gerenciar anúncios e vendas.',
    fields: {
      apiKey: false,
      secretKey: false,
      storeUrl: false,
      webhookUrl: true,
      appId: true,
      appSecret: true
    },
    webhookEvents: [
      'orders',
      'payments',
      'items',
      'questions',
      'messages'
    ],
    documentation: 'https://developers.mercadolivre.com.br/pt_br/api-docs-pt-br'
  }
};

interface IntegrationSettings {
  apiKey?: string;
  secretKey?: string;
  storeUrl?: string;
  webhookUrl?: string;
  appId?: string;
  appSecret?: string;
  webhookEvents: string[];
  autoSync: boolean;
  syncInterval: string;
}

export default function PlatformIntegrationPage() {
  const params = useParams();
  const router = useRouter();
  const platformId = params.platformId as string;
  const platform = PLATFORM_CONFIGS[platformId];

  const [settings, setSettings] = useState<IntegrationSettings>({
    apiKey: '',
    secretKey: '',
    storeUrl: '',
    webhookUrl: 'https://api.example.com/webhooks/' + platformId,
    appId: '',
    appSecret: '',
    webhookEvents: [],
    autoSync: true,
    syncInterval: '30'
  });

  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  if (!platform) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Plataforma não encontrada</h1>
            <p className="text-gray-500 mt-2">A plataforma solicitada não está disponível.</p>
            <Button
              className="mt-4"
              onClick={() => router.push('/integracoes')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Integrações
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Simula teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResult('success');
      toast.success('Conexão testada com sucesso');
    } catch (error) {
      setTestResult('error');
      toast.error('Erro ao testar conexão');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      // Simula salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/integracoes')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">{platform.icon}</span>
                Integração com {platform.name}
              </h1>
              <p className="text-gray-500">{platform.description}</p>
            </div>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="credentials">
          <TabsList className="mb-6">
            <TabsTrigger value="credentials">
              <Key className="h-4 w-4 mr-2" />
              Credenciais
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <LinkIcon className="h-4 w-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>Credenciais da API</CardTitle>
                <CardDescription>
                  Configure as credenciais necessárias para integração com {platform.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {platform.fields.storeUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL da Loja</label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.storeUrl}
                        onChange={(e) => setSettings({ ...settings, storeUrl: e.target.value })}
                        placeholder="https://sua-loja.exemplo.com"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(settings.storeUrl || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {platform.fields.apiKey && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Key</label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.apiKey}
                        onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                        placeholder="Sua API Key"
                        type="password"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(settings.apiKey || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {platform.fields.secretKey && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret Key</label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.secretKey}
                        onChange={(e) => setSettings({ ...settings, secretKey: e.target.value })}
                        placeholder="Sua Secret Key"
                        type="password"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(settings.secretKey || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {platform.fields.appId && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">App ID</label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.appId}
                        onChange={(e) => setSettings({ ...settings, appId: e.target.value })}
                        placeholder="Seu App ID"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(settings.appId || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {platform.fields.appSecret && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">App Secret</label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.appSecret}
                        onChange={(e) => setSettings({ ...settings, appSecret: e.target.value })}
                        placeholder="Seu App Secret"
                        type="password"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(settings.appSecret || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    variant="outline"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Testando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Testar Conexão
                      </>
                    )}
                  </Button>

                  {testResult && (
                    <Badge
                      className={
                        testResult === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {testResult === 'success' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-1" />
                      )}
                      {testResult === 'success' ? 'Conexão estabelecida' : 'Falha na conexão'}
                    </Badge>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-2">Documentação da API</h3>
                  <p className="text-sm text-gray-500">
                    Consulte a{' '}
                    <a
                      href={platform.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      documentação oficial
                    </a>
                    {' '}para mais informações sobre a integração.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Webhooks</CardTitle>
                <CardDescription>
                  Configure os eventos que deseja receber via webhook
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL do Webhook</label>
                  <div className="flex gap-2">
                    <Input
                      value={settings.webhookUrl}
                      onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                      placeholder="https://sua-api.exemplo.com/webhooks"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(settings.webhookUrl || '')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Esta é a URL que receberá as notificações de eventos
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Eventos</label>
                  <div className="grid gap-4">
                    {platform.webhookEvents.map((event) => (
                      <div
                        key={event}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{event}</p>
                          <p className="text-sm text-gray-500">
                            Receber notificações quando este evento ocorrer
                          </p>
                        </div>
                        <Switch
                          checked={settings.webhookEvents.includes(event)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSettings({
                                ...settings,
                                webhookEvents: [...settings.webhookEvents, event]
                              });
                            } else {
                              setSettings({
                                ...settings,
                                webhookEvents: settings.webhookEvents.filter(e => e !== event)
                              });
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure as opções gerais da integração
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Sincronização Automática</label>
                    <p className="text-sm text-gray-500">
                      Ativar sincronização automática de dados
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSync}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoSync: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Intervalo de Sincronização</label>
                  <Select
                    value={settings.syncInterval}
                    onValueChange={(value) => setSettings({ ...settings, syncInterval: value })}
                    disabled={!settings.autoSync}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o intervalo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="360">6 horas</SelectItem>
                      <SelectItem value="720">12 horas</SelectItem>
                      <SelectItem value="1440">24 horas</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Define com qual frequência os dados serão sincronizados
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 