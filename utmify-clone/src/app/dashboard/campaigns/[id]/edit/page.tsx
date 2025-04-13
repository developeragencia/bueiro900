"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Tag, Plus, X, ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/DashboardLayout';

// Schema for campaign validation with enhanced validation
const campaignSchema = z.object({
  name: z.string()
    .min(3, 'O nome da campanha deve ter pelo menos 3 caracteres')
    .max(100, 'O nome da campanha não pode exceder 100 caracteres')
    .regex(/^[\w\s-]+$/, 'Use apenas letras, números, espaços e hífens'),
  url: z.string()
    .url('URL inválida')
    .refine(url => url.startsWith('http'), 'A URL deve começar com http:// ou https://'),
  utmSource: z.string()
    .min(1, 'Source é obrigatório')
    .max(50, 'Source não pode exceder 50 caracteres')
    .regex(/^[\w-]+$/, 'Use apenas letras, números e hífens'),
  utmMedium: z.string()
    .min(1, 'Medium é obrigatório')
    .max(50, 'Medium não pode exceder 50 caracteres')
    .regex(/^[\w-]+$/, 'Use apenas letras, números e hífens'),
  utmCampaign: z.string()
    .min(1, 'Campaign é obrigatório')
    .max(100, 'Campaign não pode exceder 100 caracteres')
    .regex(/^[\w-]+$/, 'Use apenas letras, números e hífens'),
  utmTerm: z.string()
    .max(100, 'Term não pode exceder 100 caracteres')
    .regex(/^[\w\s-]*$/, 'Use apenas letras, números, espaços e hífens')
    .optional(),
  utmContent: z.string()
    .max(100, 'Content não pode exceder 100 caracteres')
    .regex(/^[\w\s-]*$/, 'Use apenas letras, números, espaços e hífens')
    .optional(),
  status: z.enum(['active', 'paused', 'draft', 'archived']),
  spend: z.number()
    .min(0, 'Valor deve ser maior ou igual a zero')
    .max(1000000, 'Valor não pode exceder 1.000.000')
    .multipleOf(0.01, 'Use no máximo 2 casas decimais'),
  platform: z.string()
    .max(50, 'Platform não pode exceder 50 caracteres')
    .optional(),
  notes: z.string()
    .max(500, 'Notas não podem exceder 500 caracteres')
    .optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { campaigns, updateCampaign, deleteCampaign } = useAppStore();
  const campaign = campaigns.find(c => c.id === id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Configure react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      url: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      status: 'active',
      spend: 0,
      platform: '',
      notes: '',
    },
  });

  // Load campaign data when component mounts
  useEffect(() => {
    if (campaign) {
      reset({
        name: campaign.name,
        url: campaign.url.split('?')[0], // Get base URL without UTM parameters
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        utmCampaign: campaign.utmCampaign,
        utmTerm: campaign.utmTerm || '',
        utmContent: campaign.utmContent || '',
        status: campaign.status,
        spend: campaign.spend,
        platform: campaign.platform || '',
        notes: campaign.notes || '',
      });

      setTags(campaign.tags || []);
    } else {
      // If no campaign found, redirect back to campaigns list
      router.push('/dashboard/campaigns');
    }
  }, [campaign, reset, router]);

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle save button click with enhanced error handling
  const onSubmit = async (data: CampaignFormValues) => {
    if (!campaign) {
      toast.error('Campanha não encontrada.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate URL format
      let baseUrl: URL;
      try {
        baseUrl = new URL(data.url);
      } catch (error) {
        toast.error('URL inválida. Verifique o formato.');
        return;
      }

      // Validate UTM parameters
      const utmParams = {
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
        ...(data.utmTerm && { utm_term: data.utmTerm }),
        ...(data.utmContent && { utm_content: data.utmContent })
      };

      // Add UTM parameters to URL
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
          baseUrl.searchParams.set(key, value.toLowerCase().replace(/\s+/g, '-'));
        }
      });

      // Validate spend value
      if (data.spend < 0 || data.spend > 1000000) {
        toast.error('Valor de gasto inválido. Deve estar entre 0 e 1.000.000.');
        return;
      }

      // Update campaign in store with validation
      const updatedCampaign = {
        name: data.name.trim(),
        url: baseUrl.toString(),
        utmSource: data.utmSource.toLowerCase(),
        utmMedium: data.utmMedium.toLowerCase(),
        utmCampaign: data.utmCampaign.toLowerCase(),
        utmTerm: data.utmTerm?.toLowerCase(),
        utmContent: data.utmContent?.toLowerCase(),
        status: data.status,
        spend: Number(data.spend.toFixed(2)),
        platform: data.platform?.trim(),
        notes: data.notes?.trim(),
        tags: tags.map(tag => tag.trim().toLowerCase()),
        dateUpdated: new Date().toISOString()
      };

      await updateCampaign(campaign.id, updatedCampaign);

      toast.success('Campanha atualizada com sucesso!');
      router.push(`/dashboard/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Error updating campaign:', error);
      if (error instanceof Error) {
        toast.error(`Erro ao atualizar campanha: ${error.message}`);
      } else {
        toast.error('Erro ao atualizar campanha. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle campaign delete
  const handleDeleteCampaign = async () => {
    if (!campaign) return;

    try {
      await deleteCampaign(campaign.id);
      toast.success('Campanha excluída com sucesso!');
      router.push('/dashboard/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Erro ao excluir campanha.');
    }
  };

  // Platforms for dropdown
  const platforms = [
    { value: 'facebook', label: 'Facebook Ads' },
    { value: 'google', label: 'Google Ads' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'affiliate', label: 'Programa de Afiliados' },
    { value: 'direct', label: 'Tráfego Direto' },
    { value: 'other', label: 'Outro' },
  ];

  if (!campaign) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Campanha</h1>
              <p className="text-gray-500 mt-1">Atualize os parâmetros e configurações da campanha</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <Button
                variant="outline"
                className="text-sm text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
              <Button
                type="submit"
                form="campaign-form"
                className="text-sm bg-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <form id="campaign-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Campaign Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Campanha</CardTitle>
                  <CardDescription>Configure os detalhes básicos da campanha</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Campanha</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Black Friday 2025"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL Base</Label>
                    <Input
                      id="url"
                      placeholder="Ex: https://seusite.com.br/pagina"
                      {...register('url')}
                      className={errors.url ? 'border-red-500' : ''}
                    />
                    {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
                    <p className="text-xs text-gray-500">URL da página sem os parâmetros UTM</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Plataforma</Label>
                      <Select
                        defaultValue={campaign.platform || ''}
                        onValueChange={(value) => setValue('platform', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Selecione uma plataforma</SelectItem>
                          {platforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <RadioGroup
                        defaultValue={campaign.status}
                        onValueChange={(value) => setValue('status', value as 'active' | 'paused' | 'draft')}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="active" />
                          <Label htmlFor="active" className="cursor-pointer">Ativa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paused" id="paused" />
                          <Label htmlFor="paused" className="cursor-pointer">Pausada</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="draft" id="draft" />
                          <Label htmlFor="draft" className="cursor-pointer">Rascunho</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spend">Gasto com Anúncios (R$)</Label>
                    <Input
                      id="spend"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...register('spend', { valueAsNumber: true })}
                      className={errors.spend ? 'border-red-500' : ''}
                    />
                    {errors.spend && <p className="text-red-500 text-xs mt-1">{errors.spend.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas e Observações</Label>
                    <Textarea
                      id="notes"
                      placeholder="Adicione qualquer nota relevante sobre esta campanha"
                      {...register('notes')}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parâmetros UTM</CardTitle>
                  <CardDescription>Configure os parâmetros de rastreamento UTM</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="utmSource">
                        utm_source <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="utmSource"
                        placeholder="Ex: facebook"
                        {...register('utmSource')}
                        className={errors.utmSource ? 'border-red-500' : ''}
                      />
                      {errors.utmSource && <p className="text-red-500 text-xs mt-1">{errors.utmSource.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="utmMedium">
                        utm_medium <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="utmMedium"
                        placeholder="Ex: cpc"
                        {...register('utmMedium')}
                        className={errors.utmMedium ? 'border-red-500' : ''}
                      />
                      {errors.utmMedium && <p className="text-red-500 text-xs mt-1">{errors.utmMedium.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="utmCampaign">
                        utm_campaign <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="utmCampaign"
                        placeholder="Ex: blackfriday"
                        {...register('utmCampaign')}
                        className={errors.utmCampaign ? 'border-red-500' : ''}
                      />
                      {errors.utmCampaign && <p className="text-red-500 text-xs mt-1">{errors.utmCampaign.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="utmTerm">utm_term (opcional)</Label>
                      <Input
                        id="utmTerm"
                        placeholder="Ex: marketing+digital"
                        {...register('utmTerm')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="utmContent">utm_content (opcional)</Label>
                      <Input
                        id="utmContent"
                        placeholder="Ex: textlink"
                        {...register('utmContent')}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                    <p className="text-sm text-blue-700 mb-2 font-medium">Dicas para parâmetros UTM:</p>
                    <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
                      <li><strong>utm_source:</strong> A origem do tráfego (Google, Facebook, Newsletter)</li>
                      <li><strong>utm_medium:</strong> O meio de marketing (cpc, banner, email)</li>
                      <li><strong>utm_campaign:</strong> Nome específico da campanha (promo_verao, lancamento)</li>
                      <li><strong>utm_term:</strong> Palavras-chave pagas</li>
                      <li><strong>utm_content:</strong> Para diferenciar anúncios semelhantes</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>Adicione tags para organizar suas campanhas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-sm text-gray-500">Nenhuma tag adicionada</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas da Campanha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Visitas:</span>
                    <span className="font-medium">{campaign.visits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Conversões:</span>
                    <span className="font-medium">{campaign.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxa de Conversão:</span>
                    <span className="font-medium">
                      {campaign.visits && campaign.visits > 0
                        ? ((campaign.conversions / campaign.visits) * 100).toFixed(2)
                        : '0.00'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Receita:</span>
                    <span className="font-medium">
                      R$ {campaign.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Criada em:</span>
                    <span className="font-medium">{new Date(campaign.dateCreated).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Última atualização:</span>
                    <span className="font-medium">{new Date(campaign.dateUpdated).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 px-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Excluir Campanha
                </CardTitle>
                <CardDescription>
                  Esta ação não pode ser desfeita. Todos os dados relacionados a esta campanha serão permanentemente removidos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Tem certeza que deseja excluir a campanha <strong>{campaign.name}</strong>?
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteCampaign}
                >
                  Sim, Excluir Campanha
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
