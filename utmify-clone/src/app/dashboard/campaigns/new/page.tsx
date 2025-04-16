"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Copy,
  Clipboard,
  Link as LinkIcon,
  Rocket,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';

export default function NewCampaignPage() {
  const router = useRouter();
  const { addCampaign, generateUtmUrl } = useAppStore();

  const [baseUrl, setBaseUrl] = useState('https://');
  const [campaignName, setCampaignName] = useState('');
  const [campaignSource, setCampaignSource] = useState('');
  const [campaignMedium, setCampaignMedium] = useState('');
  const [campaignTerm, setCampaignTerm] = useState('');
  const [campaignContent, setCampaignContent] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [utmUrl, setUtmUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined options
  const sourceOptions = [
    { value: 'google', label: 'Google' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'email', label: 'Email' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'direct', label: 'Direct' },
    { value: 'referral', label: 'Referral' },
    { value: 'other', label: 'Other' },
  ];

  const mediumOptions = [
    { value: 'cpc', label: 'CPC' },
    { value: 'organic', label: 'Organic' },
    { value: 'social', label: 'Social' },
    { value: 'email', label: 'Email' },
    { value: 'affiliates', label: 'Affiliates' },
    { value: 'referral', label: 'Referral' },
    { value: 'display', label: 'Display' },
    { value: 'video', label: 'Video' },
    { value: 'other', label: 'Other' },
  ];

  // Generate a URL-friendly slug from campaign name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_');
  };

  // Handle campaign name change and update campaign ID
  const handleCampaignNameChange = (value: string) => {
    setCampaignName(value);
    setCampaignId(generateSlug(value));
  };

  // Handle generate UTM URL
  const handleGenerateUrl = () => {
    // Clear previous errors
    setErrors({});

    // Validate fields
    const newErrors: Record<string, string> = {};
    if (!baseUrl || baseUrl === 'https://') {
      newErrors.baseUrl = 'URL base é obrigatória';
    } else {
      try {
        new URL(baseUrl);
      } catch (e) {
        newErrors.baseUrl = 'URL base inválida';
      }
    }

    if (!campaignName) newErrors.campaignName = 'Nome da campanha é obrigatório';
    if (!campaignSource) newErrors.campaignSource = 'Fonte é obrigatório';
    if (!campaignMedium) newErrors.campaignMedium = 'Meio é obrigatório';
    if (!campaignId) newErrors.campaignId = 'ID da campanha é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate UTM URL
    const url = generateUtmUrl(baseUrl, {
      source: campaignSource,
      medium: campaignMedium,
      campaign: campaignId,
      term: campaignTerm,
      content: campaignContent,
    });

    setUtmUrl(url);
  };

  // Handle copy URL to clipboard
  const handleCopyUrl = () => {
    if (!utmUrl) return;

    navigator.clipboard.writeText(utmUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Handle save campaign
  const handleSaveCampaign = () => {
    // Generate UTM URL if not already generated
    if (!utmUrl) {
      handleGenerateUrl();
      return;
    }

    // Add campaign to store
    addCampaign({
      name: campaignName,
      utmSource: campaignSource,
      utmMedium: campaignMedium,
      utmCampaign: campaignId,
      utmTerm: campaignTerm || undefined,
      utmContent: campaignContent || undefined,
      url: utmUrl,
      status: 'active',
      spend: 0,
      revenue: 0,
      conversions: 0,
      tags: [],
    });

    // Navigate to campaigns list
    router.push('/dashboard/campaigns');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Campanha</h1>
            <p className="text-gray-500 mt-1">Crie uma nova campanha com parâmetros UTM</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Campanha</CardTitle>
              <CardDescription>Configure os parâmetros da sua campanha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Base <span className="text-red-500">*</span>
                </label>
                <Input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://exemplo.com.br"
                  className={errors.baseUrl ? "border-red-500" : ""}
                />
                {errors.baseUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.baseUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Campanha <span className="text-red-500">*</span>
                </label>
                <Input
                  value={campaignName}
                  onChange={(e) => handleCampaignNameChange(e.target.value)}
                  placeholder="Black Friday 2025"
                  className={errors.campaignName ? "border-red-500" : ""}
                />
                {errors.campaignName && (
                  <p className="mt-1 text-sm text-red-500">{errors.campaignName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fonte (utm_source) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  {sourceOptions.slice(0, 6).map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCampaignSource(option.value)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        campaignSource === option.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <Input
                  value={campaignSource}
                  onChange={(e) => setCampaignSource(e.target.value)}
                  placeholder="google"
                  className={errors.campaignSource ? "border-red-500" : ""}
                />
                {errors.campaignSource && (
                  <p className="mt-1 text-sm text-red-500">{errors.campaignSource}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  De onde vem o tráfego (ex: google, facebook, newsletter)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meio (utm_medium) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  {mediumOptions.slice(0, 6).map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCampaignMedium(option.value)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        campaignMedium === option.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <Input
                  value={campaignMedium}
                  onChange={(e) => setCampaignMedium(e.target.value)}
                  placeholder="cpc"
                  className={errors.campaignMedium ? "border-red-500" : ""}
                />
                {errors.campaignMedium && (
                  <p className="mt-1 text-sm text-red-500">{errors.campaignMedium}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Método de marketing (ex: cpc, banner, email)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID da Campanha (utm_campaign) <span className="text-red-500">*</span>
                </label>
                <Input
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  placeholder="black_friday_2025"
                  className={errors.campaignId ? "border-red-500" : ""}
                />
                {errors.campaignId && (
                  <p className="mt-1 text-sm text-red-500">{errors.campaignId}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Identificador único da campanha (ex: black_friday, lancamento_produto)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termo (utm_term)
                </label>
                <Input
                  value={campaignTerm}
                  onChange={(e) => setCampaignTerm(e.target.value)}
                  placeholder="marketing digital"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Identifica termos de busca pagos (ex: marketing digital, seo)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo (utm_content)
                </label>
                <Input
                  value={campaignContent}
                  onChange={(e) => setCampaignContent(e.target.value)}
                  placeholder="banner_topo"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Diferencia anúncios (ex: banner_topo, texto_lateral)
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gray-50 border-t">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/campaigns')}
              >
                Cancelar
              </Button>
              <Button onClick={handleGenerateUrl}>
                Gerar URL <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Preview and URL */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>URL com Parâmetros UTM</CardTitle>
                <CardDescription>
                  {utmUrl ? 'Copie e compartilhe esta URL de rastreamento' : 'Preencha o formulário para gerar a URL'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {utmUrl ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-md break-all">
                      <div className="flex items-start">
                        <LinkIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{utmUrl}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleCopyUrl}
                      variant="outline"
                      className="w-full"
                    >
                      {copied ? (
                        <>
                          <Clipboard className="mr-2 h-4 w-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar URL
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                    <LinkIcon className="h-12 w-12 mb-2" />
                    <p>Preencha os campos obrigatórios e clique em Gerar URL</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salvar Campanha</CardTitle>
                <CardDescription>
                  Salve esta campanha para rastrear seu desempenho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    Ao salvar esta campanha, você poderá:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Acompanhar visitas e conversões em tempo real</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Visualizar relatórios de desempenho</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Integrar com outras plataformas</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-gray-50 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/campaigns')}
                  className="text-gray-700"
                >
                  Descartar
                </Button>
                <Button
                  onClick={handleSaveCampaign}
                  disabled={!campaignName || !campaignSource || !campaignMedium}
                  className="bg-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Campanha
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
