"use client";

import { useState } from 'react';
import { Search, Plus, Check, ArrowRight, ExternalLink, Key, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner'; // Corrected import for toast

// Updated and expanded platforms list with more real options
const platforms = [
  { id: 'p001', name: 'Meta Ads', slug: 'meta-ads', icon: '/assets/meta-logo.png', connected: true, category: 'ads', apiInfo: { apiKey: true, webhookUrl: true, customFields: ['pixel_id'] } },
  { id: 'p002', name: 'Kiwify', slug: 'kiwify', icon: '/assets/kiwify-logo.png', connected: true, category: 'checkout', apiInfo: { apiKey: true, secretKey: true, webhookUrl: true } },
  {
    id: 'p003',
    name: 'Ticto',
    slug: 'ticto',
    icon: '/assets/ticto-logo.png',
    connected: true,
    category: 'checkout',
    apiInfo: {
      webhookUrl: true,
      realWebhookUrl: 'https://api.utmify.com.br/webhooks/ticto?id=67be6f52fe019eebea14d4ee',
      secretKey: false
    }
  },
  {
    id: 'p004',
    name: 'ClickBank',
    slug: 'click-bank',
    icon: '/assets/clickbank-logo.png',
    connected: true,
    category: 'checkout',
    apiInfo: {
      secretKey: true,
      realSecretKey: 'SOMOSMILIONARIOS',
      webhookUrl: true,
      realWebhookUrl: 'https://api.utmify.com.br/webhooks/click-bank?id=678bfc65da46cb77aef40125'
    }
  },
  {
    id: 'p005',
    name: 'BuyGoods',
    slug: 'buygoods',
    icon: '/assets/buygoods-logo.png',
    connected: true,
    category: 'checkout',
    apiInfo: {
      webhookUrl: true,
      multipleModes: true,
      webhookUrls: {
        sale_approved: 'https://api4.utmify.com.br/webhooks/buygoods?orderId={ORDERID}&commission={COMMISSION_AMOUNT}&subId={SUBID}&subId2={SUBID2}&subId3={SUBID3}&subId4={SUBID4}&subId5={SUBID5}&email={EMAILHASH}&type={CONV_TYPE}&product={PRODUCT_CODENAME}&event=sale_approved&id=67850e7b220751366fb0ce2f',
        sale_refunded: 'https://api4.utmify.com.br/webhooks/buygoods?orderId={ORDERID}&commission={COMMISSION_AMOUNT}&subId={SUBID}&subId2={SUBID2}&subId3={SUBID3}&subId4={SUBID4}&subId5={SUBID5}&email={EMAILHASH}&type={CONV_TYPE}&product={PRODUCT_CODENAME}&event=sale_refunded&id=67850e7b220751366fb0ce'
      }
    }
  },
  { id: 'p006', name: 'Hotmart', slug: 'hotmart', icon: '/assets/hotmart-logo.png', connected: false, category: 'checkout', apiInfo: { clientId: true, clientSecret: true, webhookUrl: true } },
  { id: 'p007', name: 'Monetizze', slug: 'monetizze', icon: '/assets/monetizze-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true, webhookUrl: true } },
  { id: 'p008', name: 'Google Ads', slug: 'google-ads', icon: '/assets/google-ads-logo.png', connected: false, category: 'ads', apiInfo: { clientId: true, clientSecret: true, refreshToken: true } },
  { id: 'p009', name: 'Eduzz', slug: 'eduzz', icon: '/assets/eduzz-logo.png', connected: true, category: 'checkout', apiInfo: { apiKey: true, appKey: true, webhookUrl: true } },
  { id: 'p010', name: 'VittaPay', slug: 'vittapay', icon: '/assets/vittapay-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true, affiliateCode: true } },
  { id: 'p011', name: 'Lastlink', slug: 'lastlink', icon: '/assets/lastlink-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true, secretKey: true } },
  { id: 'p012', name: 'Greenn', slug: 'greenn', icon: '/assets/greenn-logo.png', connected: true, category: 'checkout', apiInfo: { clientId: true, clientSecret: true } },
  { id: 'p013', name: 'Zouti', slug: 'zouti', icon: '/assets/zouti-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p014', name: 'Digistore', slug: 'digistore', icon: '/assets/digistore-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true, secretKey: true } },
  { id: 'p015', name: 'TikTok Ads', slug: 'tiktok-ads', icon: '/assets/tiktok-logo.png', connected: false, category: 'ads', apiInfo: { apiKey: true, secretKey: true } },
  { id: 'p016', name: 'Shopify', slug: 'shopify', icon: '/assets/shopify-logo.png', connected: false, category: 'ecommerce', apiInfo: { apiKey: true, secretKey: true, storeUrl: true } },
  { id: 'p017', name: 'WooCommerce', slug: 'woocommerce', icon: '/assets/woocommerce-logo.png', connected: false, category: 'ecommerce', apiInfo: { consumerKey: true, consumerSecret: true, siteUrl: true } },
  { id: 'p018', name: 'PerfectPay', slug: 'perfectpay', icon: '/assets/perfectpay-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p019', name: 'iExperience', slug: 'iexperience', icon: '/assets/iexperience-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p020', name: 'Systeme', slug: 'systeme', icon: '/assets/systeme-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p021', name: 'WeGate', slug: 'wegate', icon: '/assets/wegate-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p022', name: 'PayT', slug: 'payt', icon: '/assets/payt-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p023', name: 'Doppus', slug: 'doppus', icon: '/assets/doppus-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p024', name: 'PmhmPay', slug: 'pmhmpay', icon: '/assets/pmhmpay-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p025', name: 'InovaPag', slug: 'inovapag', icon: '/assets/inovapag-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
  { id: 'p026', name: 'OctusPay', slug: 'octuspay', icon: '/assets/octuspay-logo.png', connected: false, category: 'checkout', apiInfo: { apiKey: true } },
];

const categories = [
  { id: 'all', name: 'Todas' },
  { id: 'checkout', name: 'Checkouts' },
  { id: 'ads', name: 'Plataformas de Anúncios' },
  { id: 'ecommerce', name: 'E-commerce' },
];

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [connectionFilter, setConnectionFilter] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Filter platforms
  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
    const matchesConnection =
      connectionFilter === 'all' ||
      (connectionFilter === 'connected' && platform.connected) ||
      (connectionFilter === 'not-connected' && !platform.connected);

    return matchesSearch && matchesCategory && matchesConnection;
  });

  // Handler for connecting to a platform
  const handleConnect = (platform: any) => {
    setSelectedPlatform(platform);
    setIsConnecting(true);
  };

  // Handler for configuring an existing platform
  const handleConfigure = (platform: any) => {
    setSelectedPlatform(platform);
    setIsConfiguring(true);
  };

  // Function to actually connect the platform
  const connectPlatform = (data: any) => {
    console.log("Connecting to platform with data:", data);

    // Show success message
    toast.success(`Conectado com sucesso à plataforma ${data.name}!`);

    // Close the dialog
    setIsConnecting(false);

    // Refresh could be implemented here
  };

  // Function to handle "Nova Integração" button
  const handleNewIntegration = () => {
    // Scroll to the unconnected platforms section
    document.getElementById('unconnected-platforms')?.scrollIntoView({ behavior: 'smooth' });
    // Could also open a modal with popular platforms
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
            <p className="text-gray-500 mt-1">Conecte-se com múltiplas plataformas para unificar seus dados</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              className="bg-primary text-white flex items-center"
              onClick={handleNewIntegration}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Integração
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
                  placeholder="Buscar integrações..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-[180px]">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-[180px]">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={connectionFilter}
                  onChange={(e) => setConnectionFilter(e.target.value)}
                >
                  <option value="all">Todas Conexões</option>
                  <option value="connected">Conectadas</option>
                  <option value="not-connected">Não Conectadas</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total de Plataformas</p>
                  <p className="text-2xl font-bold mt-1">{platforms.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-6 w-6 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Plataformas Conectadas</p>
                  <p className="text-2xl font-bold mt-1">{platforms.filter(p => p.connected).length}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-6 w-6 text-green-600">
                    <Check />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Plataformas Disponíveis</p>
                  <p className="text-2xl font-bold mt-1">{platforms.filter(p => !p.connected).length}</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <div className="h-6 w-6 text-amber-600">
                    <Plus />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlatforms.map(platform => (
            <Card
              key={platform.id}
              className={`overflow-hidden hover:shadow-md transition-shadow ${
                platform.connected ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              <CardContent className="p-0">
                {platform.connected && (
                  <div className="bg-green-50 text-green-700 text-xs px-3 py-1">
                    Conectado
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={platform.icon}
                        alt={`${platform.name} logo`}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-500">
                        {platform.category === 'checkout' ? 'Checkout' :
                         platform.category === 'ads' ? 'Plataforma de Anúncios' :
                         platform.category === 'ecommerce' ? 'E-commerce' : 'Outra'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    {platform.connected ? (
                      <Button
                        variant="outline"
                        className="w-full border-green-300 text-green-700 hover:bg-green-50"
                        onClick={() => handleConfigure(platform)}
                      >
                        Configurar
                        <Settings className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full bg-primary text-white"
                        onClick={() => handleConnect(platform)}
                      >
                        Conectar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPlatforms.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-500">
              <p>Nenhuma integração encontrada.</p>
            </div>
          )}
        </div>
      </div>

      {/* Connection Dialog */}
      {selectedPlatform && (
        <Dialog open={isConnecting} onOpenChange={setIsConnecting}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <img
                  src={selectedPlatform.icon}
                  alt={selectedPlatform.name}
                  className="h-6 w-6 object-contain"
                />
                Conectar a {selectedPlatform.name}
              </DialogTitle>
              <DialogDescription>
                Configure a integração com {selectedPlatform.name} para começar a rastrear suas conversões.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Tabs defaultValue="api" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="api">Credenciais API</TabsTrigger>
                  <TabsTrigger value="webhook">Webhook</TabsTrigger>
                </TabsList>

                <TabsContent value="api" className="space-y-4 mt-4">
                  {selectedPlatform.apiInfo.apiKey && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">API Key</label>
                      <Input placeholder="Insira sua API Key" />
                    </div>
                  )}

                  {selectedPlatform.apiInfo.secretKey && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Secret Key</label>
                      <Input placeholder="Insira sua Secret Key" type="password" />
                    </div>
                  )}

                  {selectedPlatform.apiInfo.clientId && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Client ID</label>
                      <Input placeholder="Insira seu Client ID" />
                    </div>
                  )}

                  {selectedPlatform.apiInfo.clientSecret && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Client Secret</label>
                      <Input placeholder="Insira seu Client Secret" type="password" />
                    </div>
                  )}

                  {selectedPlatform.apiInfo.storeUrl && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL da Loja</label>
                      <Input placeholder="https://sua-loja.com" />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="webhook" className="space-y-4 mt-4">
                  {selectedPlatform.apiInfo.webhookUrl && !selectedPlatform.apiInfo.multipleModes && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL do Webhook</label>
                      <div className="flex">
                        <Input
                          readOnly
                          value={selectedPlatform.apiInfo.realWebhookUrl || `https://api.bueiro.digital/v1/webhook/${selectedPlatform.slug}/YOUR_ACCESS_TOKEN`}
                          className="rounded-r-none bg-gray-50"
                        />
                        <Button variant="outline" className="rounded-l-none border-l-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Configure este webhook na sua conta {selectedPlatform.name} para receber notificações de eventos.
                      </p>
                    </div>
                  )}

                  {selectedPlatform.apiInfo.multipleModes && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">URLs de Webhook para Diferentes Eventos</h4>

                      {selectedPlatform.apiInfo.webhookUrls?.sale_approved && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Venda Aprovada</label>
                          <div className="flex">
                            <Input
                              readOnly
                              value={selectedPlatform.apiInfo.webhookUrls.sale_approved}
                              className="rounded-r-none bg-gray-50 text-xs"
                            />
                            <Button variant="outline" className="rounded-l-none border-l-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedPlatform.apiInfo.webhookUrls?.sale_refunded && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Venda Reembolsada</label>
                          <div className="flex">
                            <Input
                              readOnly
                              value={selectedPlatform.apiInfo.webhookUrls.sale_refunded}
                              className="rounded-r-none bg-gray-50 text-xs"
                            />
                            <Button variant="outline" className="rounded-l-none border-l-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </Button>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        Configure estas URLs para diferentes eventos em sua conta {selectedPlatform.name}.
                        Os parâmetros entre chaves ({'{ORDERID}'}) são placeholders que serão substituídos automaticamente pela plataforma.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConnecting(false)}>Cancelar</Button>
              <Button
                className="bg-primary"
                onClick={() => connectPlatform(selectedPlatform)}
              >
                <Key className="mr-2 h-4 w-4" />
                Conectar Plataforma
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Configuration Dialog */}
      {selectedPlatform && (
        <Dialog open={isConfiguring} onOpenChange={setIsConfiguring}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <img
                  src={selectedPlatform.icon}
                  alt={selectedPlatform.name}
                  className="h-6 w-6 object-contain"
                />
                Configurações de {selectedPlatform.name}
              </DialogTitle>
              <DialogDescription>
                Gerencie sua integração com {selectedPlatform.name}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="p-4 bg-green-50 rounded-md border border-green-200 mb-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-medium">Integração ativa e funcionando</p>
                </div>
                <p className="text-green-700 text-sm mt-1">Última sincronização: há 25 minutos</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status da Conexão</label>
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    <span className="text-sm text-gray-700">Conectado</span>
                  </div>
                </div>

                {selectedPlatform.apiInfo.secretKey && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret Key / Token</label>
                    <div className="flex">
                      <Input
                        readOnly
                        value={selectedPlatform.slug === 'click-bank' ? 'SOMOSMILIONARIOS' : '•••••••••••••••••••••••'}
                        className="bg-gray-50"
                      />
                    </div>
                    {selectedPlatform.slug === 'click-bank' && (
                      <p className="text-xs text-gray-500 mt-1">
                        O ClickBank requer uma palavra-chave para autenticação do webhook.
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Webhook Configurado</label>
                  {!selectedPlatform.apiInfo.multipleModes ? (
                    <p className="text-sm text-gray-700 break-all">
                      {selectedPlatform.apiInfo.realWebhookUrl || `https://api.bueiro.digital/v1/webhook/${selectedPlatform.slug}/••••••`}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Múltiplas URLs configuradas:</p>
                      <div className="ml-2 space-y-1">
                        <p className="text-xs text-gray-700">Venda Aprovada: <span className="break-all">https://api4.utmify.com.br/webhooks/buygoods?...event=sale_approved&id=67850e7b220751366fb0ce2f</span></p>
                        <p className="text-xs text-gray-700">Venda Reembolsada: <span className="break-all">https://api4.utmify.com.br/webhooks/buygoods?...event=sale_refunded&id=67850e7b220751366fb0ce</span></p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <a
                    href="#"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Ver documentação da API
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex w-full justify-between">
                <Button variant="destructive" size="sm">
                  Desconectar
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsConfiguring(false)}>Fechar</Button>
                  <Button className="bg-primary">Atualizar Credenciais</Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </DashboardLayout>
  );
}
