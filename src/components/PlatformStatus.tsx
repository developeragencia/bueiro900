"use client";

import { Platform } from '@/types/platform';
import { CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface PlatformStatusProps {
  platform: Platform;
  isConnected: boolean;
  lastSync?: Date;
  onSync?: () => Promise<void>;
}

interface StatusConfig {
  color: string;
  icon: any;
  text: string;
  description: string;
}

export default function PlatformStatus({
  platform,
  isConnected,
  lastSync,
  onSync
}: PlatformStatusProps) {
  const [syncing, setSyncing] = useState(false);

  const getStatusConfig = (): StatusConfig => {
    if (!platform.status) {
      return {
        color: 'gray',
        icon: Clock,
        text: 'Não configurado',
        description: 'A plataforma ainda não foi configurada'
      };
    }

    switch (platform.status) {
      case 'active':
        return {
          color: 'green',
          icon: CheckCircle,
          text: 'Ativo',
          description: 'A plataforma está funcionando normalmente'
        };
      case 'maintenance':
        return {
          color: 'yellow',
          icon: AlertTriangle,
          text: 'Em manutenção',
          description: 'Manutenção programada em andamento'
        };
      case 'inactive':
        return {
          color: 'red',
          icon: XCircle,
          text: 'Inativo',
          description: 'A plataforma está temporariamente inativa'
        };
      default:
        return {
          color: 'gray',
          icon: Clock,
          text: 'Desconhecido',
          description: 'Status desconhecido'
        };
    }
  };

  const handleSync = async () => {
    if (!onSync) return;

    try {
      setSyncing(true);
      await onSync();
      toast.success('Sincronização concluída com sucesso');
    } catch (error) {
      toast.error('Erro ao sincronizar. Tente novamente.');
    } finally {
      setSyncing(false);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} minutos atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} horas atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias atrás`;
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  const getConnectionStatusColor = () => {
    if (!isConnected) return 'bg-red-500';
    if (!lastSync) return 'bg-yellow-500';
    
    const lastSyncDate = new Date(lastSync);
    const diffInHours = (new Date().getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'bg-green-500';
    if (diffInHours < 24) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-background rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Icon
                  className={`w-5 h-5 text-${statusConfig.color}-500`}
                  aria-hidden="true"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{statusConfig.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <h3 className="font-medium">{platform.name}</h3>
            <p className={`text-sm text-${statusConfig.color}-700`}>
              {statusConfig.text}
            </p>
          </div>
        </div>

        {onSync && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing || !isConnected}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${syncing ? 'animate-spin' : ''}`}
            />
            {syncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}
            />
            <span className="text-sm">
              Status da Conexão: {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          {isConnected && (
            <Badge variant="outline" className="text-xs">
              {platform.version || 'v1.0'}
            </Badge>
          )}
        </div>

        {isConnected && lastSync && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Última sincronização:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <time dateTime={lastSync.toISOString()}>
                    {getTimeAgo(lastSync)}
                  </time>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{lastSync.toLocaleString('pt-BR')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
} 