import { useState, useEffect } from 'react';
import { Platform, PlatformConnection, PlatformMetrics } from '@/types/platform';
import { platformService } from '@/services/api/platforms';

interface UsePlatformConnectionReturn {
  isConnected: boolean;
  metrics: PlatformMetrics | null;
  loading: boolean;
  error: string | null;
  connect: (credentials: Record<string, string>) => Promise<void>;
  disconnect: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
}

export function usePlatformConnection(platform: Platform): UsePlatformConnectionReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, [platform.id]);

  const checkConnection = async () => {
    try {
      // Verificar se há credenciais salvas
      const credentials = localStorage.getItem(`platform_${platform.id}_credentials`);
      setIsConnected(!!credentials);

      if (credentials) {
        await refreshMetrics();
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
    }
  };

  const connect = async (credentials: Record<string, string>) => {
    try {
      setLoading(true);
      setError(null);

      const result = await platformService.connect(String(platform.id), credentials);
      
      if (result.status === 'connected') {
        setIsConnected(true);
        await refreshMetrics();
      } else {
        throw new Error(result.error || 'Falha na conexão');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Falha ao conectar com a plataforma');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setLoading(true);
      setError(null);
      await platformService.disconnect(String(platform.id));
      setIsConnected(false);
      setMetrics(null);
    } catch (error) {
      setError('Falha ao desconectar da plataforma');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    try {
      const data = await platformService.getMetrics(String(platform.id));
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao atualizar métricas:', error);
      // Não definimos o erro aqui para não afetar a UI
    }
  };

  return {
    isConnected,
    metrics,
    loading,
    error,
    connect,
    disconnect,
    refreshMetrics,
  };
} 