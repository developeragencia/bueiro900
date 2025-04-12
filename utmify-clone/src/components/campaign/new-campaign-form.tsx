"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, CopyCheck, X, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';

// Schema de validação
const campaignSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  url: z.string().url('URL inválida'),
  utmSource: z.string().min(1, 'A fonte é obrigatória'),
  utmMedium: z.string().min(1, 'O meio é obrigatório'),
  utmCampaign: z.string().min(1, 'O nome da campanha é obrigatório'),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  status: z.enum(['active', 'paused', 'draft']),
  tags: z.array(z.string()).optional()
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

// Opções comuns para UTMs
const sourceOptions = [
  'facebook', 'instagram', 'google', 'email', 'linkedin', 'twitter', 'tiktok',
  'youtube', 'direct', 'referral', 'organic', 'newsletter', 'whatsapp', 'telegram'
];

const mediumOptions = [
  'cpc', 'banner', 'email', 'social', 'display', 'search', 'video', 'affiliate',
  'referral', 'organic', 'paid', 'push', 'remarketing', 'retargeting'
];

export function NewCampaignForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();
  const addCampaign = useAppStore(state => state.addCampaign);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
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
      tags: []
    }
  });

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const newTags = [...tags, tagInput];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: CampaignFormValues) => {
    setIsLoading(true);

    try {
      await addCampaign({
        ...data,
        tags: tags,
        spend: 0,
        revenue: 0,
        conversions: 0
      });

      toast.success('Campanha criada com sucesso!');
      setIsOpen(false);
      reset();
      setTags([]);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Falha ao criar campanha.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gera a URL completa com os parâmetros UTM
  const generateFullUrl = () => {
    try {
      const url = new URL(watch('url') || 'https://example.com');
      const params = new URLSearchParams();

      if (watch('utmSource')) params.append('utm_source', watch('utmSource'));
      if (watch('utmMedium')) params.append('utm_medium', watch('utmMedium'));
      if (watch('utmCampaign')) params.append('utm_campaign', watch('utmCampaign'));
      if (watch('utmTerm')) params.append('utm_term', watch('utmTerm') as string);
      if (watch('utmContent')) params.append('utm_content', watch('utmContent') as string);

      return `${url.origin}${url.pathname}${url.search ? url.search + '&' : '?'}${params.toString()}`;
    } catch (e) {
      return 'URL inválida';
    }
  };

  const fullUrl = generateFullUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success('URL copiada para a área de transferência!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Campanha</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar uma nova campanha de rastreamento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Campanha</Label>
                <Input id="name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="url">URL de Destino</Label>
                <Input id="url" {...register('url')} placeholder="https://meusite.com/pagina" className={errors.url ? 'border-red-500' : ''} />
                {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="utmSource">Fonte (utm_source)</Label>
                  <Input
                    id="utmSource"
                    list="sourceOptions"
                    {...register('utmSource')}
                    className={errors.utmSource ? 'border-red-500' : ''}
                  />
                  <datalist id="sourceOptions">
                    {sourceOptions.map(option => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                  {errors.utmSource && <p className="text-red-500 text-xs mt-1">{errors.utmSource.message}</p>}
                </div>

                <div>
                  <Label htmlFor="utmMedium">Meio (utm_medium)</Label>
                  <Input
                    id="utmMedium"
                    list="mediumOptions"
                    {...register('utmMedium')}
                    className={errors.utmMedium ? 'border-red-500' : ''}
                  />
                  <datalist id="mediumOptions">
                    {mediumOptions.map(option => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                  {errors.utmMedium && <p className="text-red-500 text-xs mt-1">{errors.utmMedium.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="utmCampaign">Nome da Campanha (utm_campaign)</Label>
                <Input id="utmCampaign" {...register('utmCampaign')} className={errors.utmCampaign ? 'border-red-500' : ''} />
                {errors.utmCampaign && <p className="text-red-500 text-xs mt-1">{errors.utmCampaign.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="utmTerm">Termo (utm_term) - Opcional</Label>
                  <Input id="utmTerm" {...register('utmTerm')} />
                </div>

                <div>
                  <Label htmlFor="utmContent">Conteúdo (utm_content) - Opcional</Label>
                  <Input id="utmContent" {...register('utmContent')} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Status da Campanha</Label>
                <RadioGroup defaultValue="active" className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="status-active" value="active" {...register('status')} />
                    <Label htmlFor="status-active" className="flex items-center text-sm">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Ativa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="status-paused" value="paused" {...register('status')} />
                    <Label htmlFor="status-paused" className="flex items-center text-sm">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                      Pausada
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="status-draft" value="draft" {...register('status')} />
                    <Label htmlFor="status-draft" className="flex items-center text-sm">
                      <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                      Rascunho
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Adicionar tag"
                  />
                  <Button type="button" onClick={addTag} size="icon">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map(tag => (
                    <div key={tag} className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm">
                      <Tag className="h-3 w-3 mr-1 text-gray-500" />
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-gray-200 rounded-full p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X size={10} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Label>URL Completa com UTMs</Label>
                <div className="relative mt-2">
                  <Textarea
                    value={fullUrl}
                    readOnly
                    className="pr-10 font-mono text-xs"
                    rows={3}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={copyToClipboard}
                  >
                    <CopyCheck size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Campanha'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
