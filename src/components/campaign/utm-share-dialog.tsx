"use client";

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Campaign {
  id: string;
  name: string;
  utmParameters: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
  };
}

interface UTMShareDialogProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UTMShareDialog({ campaign, open, onOpenChange }: UTMShareDialogProps) {
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const generateUtmUrl = () => {
    if (!baseUrl) return '';

    const params = new URLSearchParams({
      utm_source: campaign.utmParameters.source,
      utm_medium: campaign.utmParameters.medium,
      utm_campaign: campaign.utmParameters.campaign,
    });

    if (campaign.utmParameters.term) {
      params.append('utm_term', campaign.utmParameters.term);
    }

    if (campaign.utmParameters.content) {
      params.append('utm_content', campaign.utmParameters.content);
    }

    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params.toString()}`;
  };

  const handleCopy = async () => {
    const utmUrl = generateUtmUrl();
    
    if (!utmUrl) {
      toast.error('Insira uma URL base para gerar o link com UTMs');
      return;
    }

    try {
      await navigator.clipboard.writeText(utmUrl);
      setCopied(true);
      toast.success('Link copiado para a área de transferência');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Erro ao copiar o link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Compartilhar UTMs da Campanha</DialogTitle>
          <DialogDescription>
            Gere um link com os parâmetros UTM da campanha {campaign.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="base-url">URL Base</Label>
              <Input
              id="base-url"
              placeholder="https://exemplo.com/pagina"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Parâmetros UTM</Label>
              <div className="rounded-md border p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm font-medium">Source:</span>
                    <p className="text-sm text-muted-foreground">{campaign.utmParameters.source}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Medium:</span>
                    <p className="text-sm text-muted-foreground">{campaign.utmParameters.medium}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Campaign:</span>
                    <p className="text-sm text-muted-foreground">{campaign.utmParameters.campaign}</p>
                  </div>
                  {campaign.utmParameters.term && (
                    <div>
                      <span className="text-sm font-medium">Term:</span>
                      <p className="text-sm text-muted-foreground">{campaign.utmParameters.term}</p>
                    </div>
                  )}
                  {campaign.utmParameters.content && (
                    <div>
                      <span className="text-sm font-medium">Content:</span>
                      <p className="text-sm text-muted-foreground">{campaign.utmParameters.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL Completa com UTMs</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={generateUtmUrl()}
                  placeholder="Insira uma URL base para gerar o link"
                />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                    <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
                  <span className="sr-only">Copiar URL</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
