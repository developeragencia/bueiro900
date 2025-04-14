"use client";

import { useState } from 'react';
import { Platform } from '@/types/platform';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff, HelpCircle, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PlatformCredentialsFormProps {
  platform: Platform;
  onSubmit: (credentials: Record<string, string>) => Promise<void>;
  onCancel: () => void;
  initialCredentials?: Record<string, string>;
}

const credentialsFields = {
  perfectpay: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'text',
      required: true,
      placeholder: 'Sua API Key do PerfectPay',
      help: 'Encontre sua API Key no painel do PerfectPay em Configurações > API',
      validation: (value: string) => value.length >= 32 || 'API Key deve ter pelo menos 32 caracteres'
    },
    {
      key: 'apiSecret',
      label: 'API Secret',
      type: 'password',
      required: true,
      placeholder: 'Seu API Secret do PerfectPay',
      help: 'O API Secret é fornecido junto com sua API Key',
      validation: (value: string) => value.length >= 32 || 'API Secret deve ter pelo menos 32 caracteres'
    },
  ],
  hotmart: [
    {
      key: 'clientId',
      label: 'Client ID',
      type: 'text',
      required: true,
      placeholder: 'Seu Client ID do Hotmart',
      help: 'Encontre seu Client ID nas configurações de API do Hotmart',
      validation: (value: string) => value.length >= 16 || 'Client ID deve ter pelo menos 16 caracteres'
    },
    {
      key: 'clientSecret',
      label: 'Client Secret',
      type: 'password',
      required: true,
      placeholder: 'Seu Client Secret do Hotmart',
      help: 'O Client Secret é fornecido junto com seu Client ID',
      validation: (value: string) => value.length >= 32 || 'Client Secret deve ter pelo menos 32 caracteres'
    },
    {
      key: 'refreshToken',
      label: 'Refresh Token',
      type: 'password',
      required: true,
      placeholder: 'Seu Refresh Token do Hotmart',
      help: 'O Refresh Token é usado para manter sua conexão ativa',
      validation: (value: string) => value.length >= 32 || 'Refresh Token deve ter pelo menos 32 caracteres'
    },
  ],
  mercadopago: [
    {
      key: 'accessToken',
      label: 'Access Token',
      type: 'password',
      required: true,
      placeholder: 'Seu Access Token do Mercado Pago',
      help: 'Encontre seu Access Token nas configurações de credenciais do Mercado Pago',
      validation: (value: string) => value.startsWith('APP_USR-') || 'Access Token deve começar com APP_USR-'
    },
  ],
  stripe: [
    {
      key: 'publishableKey',
      label: 'Publishable Key',
      type: 'text',
      required: true,
      placeholder: 'Sua Publishable Key do Stripe',
      help: 'Encontre sua Publishable Key no Dashboard do Stripe',
      validation: (value: string) => value.startsWith('pk_') || 'Publishable Key deve começar com pk_'
    },
    {
      key: 'secretKey',
      label: 'Secret Key',
      type: 'password',
      required: true,
      placeholder: 'Sua Secret Key do Stripe',
      help: 'A Secret Key é encontrada junto com sua Publishable Key',
      validation: (value: string) => value.startsWith('sk_') || 'Secret Key deve começar com sk_'
    },
  ],
  rdstation: [
    {
      key: 'clientId',
      label: 'Client ID',
      type: 'text',
      required: true,
      placeholder: 'Seu Client ID do RD Station',
      help: 'Encontre seu Client ID nas configurações de API do RD Station',
      validation: (value: string) => value.length >= 16 || 'Client ID deve ter pelo menos 16 caracteres'
    },
    {
      key: 'clientSecret',
      label: 'Client Secret',
      type: 'password',
      required: true,
      placeholder: 'Seu Client Secret do RD Station',
      help: 'O Client Secret é fornecido junto com seu Client ID',
      validation: (value: string) => value.length >= 32 || 'Client Secret deve ter pelo menos 32 caracteres'
    },
    {
      key: 'refreshToken',
      label: 'Refresh Token',
      type: 'password',
      required: true,
      placeholder: 'Seu Refresh Token do RD Station',
      help: 'O Refresh Token é usado para manter sua conexão ativa',
      validation: (value: string) => value.length >= 32 || 'Refresh Token deve ter pelo menos 32 caracteres'
    },
  ],
};

export default function PlatformCredentialsForm({
  platform,
  onSubmit,
  onCancel,
  initialCredentials = {}
}: PlatformCredentialsFormProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>(initialCredentials);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const fields = credentialsFields[platform.name.toLowerCase() as keyof typeof credentialsFields] || [];

  const validateField = (key: string, value: string) => {
    const field = fields.find(f => f.key === key);
    if (!field) return true;

    if (field.required && !value) {
      return 'Este campo é obrigatório';
    }

    if (field.validation) {
      const result = field.validation(value);
      if (typeof result === 'string') {
        return result;
      }
    }

    return true;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const value = credentials[field.key] || '';
      const validation = validateField(field.key, value);
      
      if (typeof validation === 'string') {
        newErrors[field.key] = validation;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(credentials);
      toast.success(`Credenciais do ${platform.name} salvas com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
      toast.error(`Erro ao salvar credenciais do ${platform.name}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          {platform.icon && (
            <img
              src={platform.icon}
              alt={`${platform.name} logo`}
              className="w-8 h-8"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">Configurar {platform.name}</h2>
            <p className="text-sm text-muted-foreground">
              Insira suas credenciais para integrar com {platform.name}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert variant="info" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Suas credenciais são criptografadas antes de serem armazenadas.
              Nunca compartilhamos suas informações com terceiros.
            </AlertDescription>
          </Alert>

          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.key} className="font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{field.help}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="relative">
                <Input
                  type={field.type === 'password' && !showPasswords[field.key] ? 'password' : 'text'}
                  id={field.key}
                  value={credentials[field.key] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCredentials(prev => ({ ...prev, [field.key]: value }));
                    const validation = validateField(field.key, value);
                    if (typeof validation === 'string') {
                      setErrors(prev => ({ ...prev, [field.key]: validation }));
                    } else {
                      setErrors(prev => {
                        const { [field.key]: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  placeholder={field.placeholder}
                  className={errors[field.key] ? 'border-red-500' : ''}
                />
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords[field.key] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              {errors[field.key] && (
                <p className="text-sm text-red-500">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </form>
      </CardContent>

      <CardFooter className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Credenciais'}
        </Button>
      </CardFooter>
    </Card>
  );
} 