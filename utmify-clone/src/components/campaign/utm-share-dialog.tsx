"use client";

import { useState } from 'react';
import { Copy, Check, Share2, Mail, Link, WhatsApp, Facebook, Twitter, Linkedin, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Campaign } from '@/lib/store';
import { toast } from 'sonner';

interface UTMShareDialogProps {
  campaign: Campaign;
  trigger?: React.ReactNode;
}

export function UTMShareDialog({ campaign, trigger }: UTMShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [customText, setCustomText] = useState(`Confira: ${campaign.name}`);
  const [currentTab, setCurrentTab] = useState('social');

  // Generate QR code SVG data for the campaign URL
  const generateQRCode = () => {
    // This is a placeholder. In a real implementation, you would use a QR code library
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Cpath fill='%23000000' d='M92,90h60v60h-60z M212,90h30v30h-30z M302,90h30v30h-30z M362,90h60v60h-60z M92,150h30v30h-30z M182,150h30v30h-30z M242,150h30v30h-30z M392,150h30v30h-30z M92,210h60v60h-60z M182,210h120v120h-120z M332,210h60v60h-60z M92,302h30v30h-30z M152,302h30v30h-30z M332,302h30v30h-30z M392,302h30v30h-30z M92,362h60v60h-60z M212,362h30v30h-30z M272,362h60v60h-60z M392,362h30v30h-30z'/%3E%3C/svg%3E`;
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(campaign.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copiada para a área de transferência');
  };

  // Share via email
  const handleEmailShare = () => {
    const subject = encodeURIComponent(campaign.name);
    const body = encodeURIComponent(`${customText}\n\n${campaign.url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // Share via WhatsApp
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${customText} ${campaign.url}`);
    window.open(`https://wa.me/?text=${text}`);
  };

  // Share via Facebook
  const handleFacebookShare = () => {
    const url = encodeURIComponent(campaign.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  };

  // Share via Twitter
  const handleTwitterShare = () => {
    const text = encodeURIComponent(customText);
    const url = encodeURIComponent(campaign.url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  };

  // Share via LinkedIn
  const handleLinkedinShare = () => {
    const url = encodeURIComponent(campaign.url);
    const title = encodeURIComponent(campaign.name);
    const summary = encodeURIComponent(customText);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Campanha</DialogTitle>
          <DialogDescription>
            Compartilhe a URL da campanha {campaign.name} através de diferentes canais.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="grid flex-1 gap-2">
              <Input
                value={campaign.url}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="social">Redes Sociais</TabsTrigger>
              <TabsTrigger value="messaging">Mensagens</TabsTrigger>
              <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center gap-2 h-auto py-3"
                    onClick={handleFacebookShare}
                  >
                    <Facebook className="h-6 w-6 text-blue-600" />
                    <span className="text-xs">Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center gap-2 h-auto py-3"
                    onClick={handleTwitterShare}
                  >
                    <Twitter className="h-6 w-6 text-blue-400" />
                    <span className="text-xs">Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center gap-2 h-auto py-3"
                    onClick={handleLinkedinShare}
                  >
                    <Linkedin className="h-6 w-6 text-blue-700" />
                    <span className="text-xs">LinkedIn</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Texto personalizado</label>
                  <Input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Texto que acompanhará seu link"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messaging" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center gap-2 h-auto py-3"
                    onClick={handleWhatsAppShare}
                  >
                    <WhatsApp className="h-6 w-6 text-green-500" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center gap-2 h-auto py-3"
                    onClick={handleEmailShare}
                  >
                    <Mail className="h-6 w-6 text-gray-500" />
                    <span className="text-xs">Email</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Texto da mensagem</label>
                  <Input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Texto que acompanhará seu link"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qrcode" className="mt-0">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-white border rounded-md">
                  <img
                    src={generateQRCode()}
                    alt="QR Code para campanha"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Escaneie este QR code para acessar a URL da campanha.
                  <br />Você também pode fazer o download para uso em materiais impressos.
                </p>
                <Button variant="outline" className="w-full mt-2">
                  Baixar QR Code
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
