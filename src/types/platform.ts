export interface Platform {
  id: number;
  name: string;
  imgUrl: string;
  category: string[];
  popular: boolean;
  status?: 'active' | 'inactive' | 'maintenance';
  description?: string;
  documentationUrl?: string;
  features?: string[];
  metrics?: {
    transactions: number;
    revenue: number;
    users: number;
    lastUpdate: Date;
  };
}

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

export interface CategoryType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface PlatformCredentials {
  apiKey?: string;
  apiSecret?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  publishableKey?: string;
  secretKey?: string;
  [key: string]: string | undefined;
} 