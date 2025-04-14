import axios from 'axios';

// Tipos
export interface PlatformConnection {
  platformId: number;
  userId: string;
  status: 'connected' | 'disconnected' | 'error';
  credentials: Record<string, any>;
  lastSync?: Date;
  error?: string;
}

export interface PlatformMetrics {
  transactions: number;
  revenue: number;
  users: number;
  lastUpdate: Date;
}

// Configurações das APIs das plataformas
const platformConfigs = {
  perfectpay: {
    baseUrl: 'https://api.perfectpay.com.br',
    version: 'v1',
  },
  hotmart: {
    baseUrl: 'https://developers.hotmart.com',
    version: 'v1',
  },
  mercadopago: {
    baseUrl: 'https://api.mercadopago.com',
    version: 'v1',
  },
  stripe: {
    baseUrl: 'https://api.stripe.com',
    version: 'v1',
  },
  rdstation: {
    baseUrl: 'https://api.rd.services',
    version: 'v1',
  },
  // Adicione outras plataformas conforme necessário
};

class PlatformService {
  private async getAuthHeaders(platformId: string) {
    // Recupera as credenciais do storage seguro
    const credentials = await this.getStoredCredentials(platformId);
    return {
      Authorization: `Bearer ${credentials.accessToken}`,
    };
  }

  private async getStoredCredentials(platformId: string) {
    // Implementar lógica de recuperação segura de credenciais
    return {
      accessToken: process.env.NEXT_PUBLIC_PLATFORM_TOKEN || '',
    };
  }

  // Conectar com uma plataforma
  async connect(platformId: string, credentials: Record<string, any>): Promise<PlatformConnection> {
    try {
      // Validar credenciais com a plataforma
      const response = await axios.post(`/api/platforms/${platformId}/connect`, credentials);
      
      // Armazenar credenciais de forma segura
      await this.storeCredentials(platformId, response.data.credentials);

      return {
        platformId: Number(platformId),
        userId: 'current-user',
        status: 'connected',
        credentials: response.data.credentials,
        lastSync: new Date(),
      };
    } catch (error) {
      console.error('Erro ao conectar com a plataforma:', error);
      return {
        platformId: Number(platformId),
        userId: 'current-user',
        status: 'error',
        credentials: {},
        error: 'Falha na conexão com a plataforma',
      };
    }
  }

  // Desconectar de uma plataforma
  async disconnect(platformId: string): Promise<void> {
    try {
      await axios.post(`/api/platforms/${platformId}/disconnect`);
      // Remover credenciais armazenadas
      await this.removeCredentials(platformId);
    } catch (error) {
      console.error('Erro ao desconectar da plataforma:', error);
      throw new Error('Falha ao desconectar da plataforma');
    }
  }

  // Obter métricas de uma plataforma
  async getMetrics(platformId: string): Promise<PlatformMetrics> {
    try {
      const headers = await this.getAuthHeaders(platformId);
      const response = await axios.get(`/api/platforms/${platformId}/metrics`, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      throw new Error('Falha ao obter métricas da plataforma');
    }
  }

  // Sincronizar dados com uma plataforma
  async sync(platformId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders(platformId);
      await axios.post(`/api/platforms/${platformId}/sync`, {}, { headers });
    } catch (error) {
      console.error('Erro na sincronização:', error);
      throw new Error('Falha na sincronização com a plataforma');
    }
  }

  private async storeCredentials(platformId: string, credentials: Record<string, any>): Promise<void> {
    // Implementar armazenamento seguro de credenciais
    // Usar localStorage apenas para desenvolvimento
    if (typeof window !== 'undefined') {
      localStorage.setItem(`platform_${platformId}_credentials`, JSON.stringify(credentials));
    }
  }

  private async removeCredentials(platformId: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`platform_${platformId}_credentials`);
    }
  }
}

export const platformService = new PlatformService(); 