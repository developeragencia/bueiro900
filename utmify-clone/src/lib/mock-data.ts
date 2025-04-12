import { Campaign, Integration, User, Click, Notification, Subscription, Referral, SupportTicket, SupportMessage, SystemStatus } from './store';

// Mock data de autenticação (apenas para simulação)
export const mockAuth = {
  // Mapeamento de emails para senhas
  passwords: {
    'joao@bueiro.digital': 'password123',
    'admin@bueiro.digital': 'admin123', // Senha do administrador
  }
};

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp001',
    name: 'Campanha Produto Premium',
    url: 'https://bueiro.digital/produto-premium',
    utmSource: 'facebook',
    utmMedium: 'cpc',
    utmCampaign: 'produto_premium_2023',
    utmTerm: 'marketing digital',
    utmContent: 'banner_01',
    status: 'active',
    spend: 1245.67,
    revenue: 3567.89,
    conversions: 38,
    visits: 210,
    dateCreated: '2023-09-15T13:45:22Z',
    dateUpdated: '2023-09-20T10:30:00Z',
    tags: ['facebook', 'produto premium', 'cpc'],
    platform: 'facebook'
  },
  {
    id: 'camp002',
    name: 'Campanha Remarketing',
    url: 'https://bueiro.digital/oferta-especial',
    utmSource: 'facebook',
    utmMedium: 'remarketing',
    utmCampaign: 'remarketing_2023',
    status: 'active',
    spend: 789.23,
    revenue: 2345.67,
    conversions: 24,
    visits: 135,
    dateCreated: '2023-09-14T09:12:45Z',
    dateUpdated: '2023-09-19T14:45:00Z',
    tags: ['facebook', 'remarketing'],
    platform: 'facebook'
  },
  {
    id: 'camp003',
    name: 'Campanha Produto Básico',
    url: 'https://bueiro.digital/produto-basico',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'produto_basico_2023',
    utmTerm: 'rastreamento utm',
    status: 'paused',
    spend: 423.56,
    revenue: 567.89,
    conversions: 7,
    visits: 42,
    dateCreated: '2023-09-10T15:30:00Z',
    dateUpdated: '2023-09-12T11:20:00Z',
    tags: ['google', 'produto básico', 'cpc'],
    platform: 'google'
  },
  {
    id: 'camp004',
    name: 'Campanha E-mail Marketing',
    url: 'https://bueiro.digital/newsletter',
    utmSource: 'email',
    utmMedium: 'email',
    utmCampaign: 'newsletter_semanal',
    status: 'active',
    spend: 156.78,
    revenue: 1789.45,
    conversions: 18,
    visits: 68,
    dateCreated: '2023-09-13T11:22:33Z',
    dateUpdated: '2023-09-18T09:15:00Z',
    tags: ['email', 'newsletter'],
    platform: 'email'
  },
  {
    id: 'camp005',
    name: 'Campanha Produto Premium v2',
    url: 'https://bueiro.digital/produto-premium-v2',
    utmSource: 'facebook',
    utmMedium: 'social',
    utmCampaign: 'produto_premium_v2_2023',
    status: 'draft',
    spend: 0,
    revenue: 0,
    conversions: 0,
    visits: 0,
    dateCreated: '2023-09-16T10:15:00Z',
    dateUpdated: '2023-09-16T10:15:00Z',
    tags: ['facebook', 'produto premium', 'social'],
    platform: 'facebook'
  },
];

// Mock integrations data
export const mockIntegrations: Integration[] = [
  {
    id: 'int001',
    name: 'Facebook Ads',
    type: 'ads',
    icon: 'https://ext.same-assets.com/501614606/1799828963.png',
    status: 'connected',
    dateConnected: '2023-08-15T10:45:22Z',
    apiKey: 'fb-api-key-123',
    settings: {
      adAccount: 'act_123456789',
      refreshToken: 'fb-refresh-token-123'
    }
  },
  {
    id: 'int002',
    name: 'Google Ads',
    type: 'ads',
    icon: 'https://ext.same-assets.com/501614606/1211923488.png',
    status: 'disconnected'
  },
  {
    id: 'int003',
    name: 'Hotmart',
    type: 'checkout',
    icon: 'https://ext.same-assets.com/501614606/461544108.png',
    status: 'connected',
    dateConnected: '2023-07-20T14:30:10Z',
    apiKey: 'hotmart-api-key-456',
    settings: {
      webhookUrl: 'https://bueiro.digital/api/webhooks/hotmart',
      productId: 'PROD12345'
    }
  },
  {
    id: 'int004',
    name: 'Kiwify',
    type: 'checkout',
    icon: 'https://ext.same-assets.com/501614606/1799828963.png',
    status: 'connected',
    dateConnected: '2023-08-01T09:15:30Z',
    apiKey: 'kiwify-api-key-789',
    settings: {
      webhookUrl: 'https://bueiro.digital/api/webhooks/kiwify',
      secretKey: 'kiwify-secret-key-789'
    }
  },
  {
    id: 'int005',
    name: 'Eduzz',
    type: 'checkout',
    icon: 'https://ext.same-assets.com/501614606/3848818458.png',
    status: 'connected',
    dateConnected: '2023-08-05T16:45:00Z',
    apiKey: 'eduzz-api-key-101',
    settings: {
      webhookUrl: 'https://bueiro.digital/api/webhooks/eduzz',
      appKey: 'eduzz-app-key-101'
    }
  },
  {
    id: 'int006',
    name: 'Google Analytics',
    type: 'analytics',
    icon: 'https://ext.same-assets.com/501614606/2658908938.png',
    status: 'connected',
    dateConnected: '2023-07-10T11:30:00Z',
    apiKey: 'ga-api-key-202',
    settings: {
      propertyId: 'UA-12345678-1',
      measurementId: 'G-ABCDEF1234'
    }
  },
  {
    id: 'int007',
    name: 'Monetizze',
    type: 'checkout',
    icon: 'https://ext.same-assets.com/501614606/773763580.png',
    status: 'disconnected'
  },
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'usr001',
    name: 'João Silva',
    email: 'joao@bueiro.digital',
    role: 'admin',
    status: 'active',
    lastActive: '2023-09-15T13:45:22Z',
    dateCreated: '2022-05-10T09:30:00Z',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 'usr008',
    name: 'Admin Master',
    email: 'admin@bueiro.digital',
    role: 'admin',
    status: 'active',
    lastActive: '2023-09-18T10:30:00Z',
    dateCreated: '2022-01-01T00:00:00Z',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    id: 'usr002',
    name: 'Maria Oliveira',
    email: 'maria@bueiro.digital',
    role: 'editor',
    status: 'active',
    lastActive: '2023-09-14T16:23:45Z',
    dateCreated: '2022-06-15T11:45:00Z',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'usr003',
    name: 'Carlos Santos',
    email: 'carlos@bueiro.digital',
    role: 'viewer',
    status: 'active',
    lastActive: '2023-09-12T10:15:33Z',
    dateCreated: '2022-07-23T13:20:00Z',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 'usr004',
    name: 'Ana Pereira',
    email: 'ana@bueiro.digital',
    role: 'editor',
    status: 'inactive',
    lastActive: '2023-08-30T14:05:12Z',
    dateCreated: '2022-08-05T15:10:00Z',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 'usr005',
    name: 'Pedro Souza',
    email: 'pedro@bueiro.digital',
    role: 'viewer',
    status: 'pending',
    lastActive: '2023-09-16T10:15:00Z',
    dateCreated: '2023-09-10T08:30:00Z'
  },
  {
    id: 'usr006',
    name: 'Fernanda Lima',
    email: 'fernanda@bueiro.digital',
    role: 'editor',
    status: 'active',
    lastActive: '2023-09-15T09:34:56Z',
    dateCreated: '2022-10-18T14:25:00Z',
    avatar: 'https://i.pravatar.cc/150?img=10'
  },
  {
    id: 'usr007',
    name: 'Ricardo Gomes',
    email: 'ricardo@bueiro.digital',
    role: 'viewer',
    status: 'active',
    lastActive: '2023-09-14T15:42:11Z',
    dateCreated: '2023-02-07T10:40:00Z',
    avatar: 'https://i.pravatar.cc/150?img=12'
  }
];

// Mock clicks data
export const mockClicks: Click[] = [
  {
    id: 'click001',
    campaignId: 'camp001',
    timestamp: '2023-09-15T10:15:00Z',
    ip: '187.12.45.78',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    referrer: 'https://facebook.com',
    deviceType: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    country: 'Brazil',
    city: 'São Paulo',
    conversion: true,
    value: 97.00
  },
  {
    id: 'click002',
    campaignId: 'camp001',
    timestamp: '2023-09-15T10:20:15Z',
    ip: '189.23.56.89',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
    referrer: 'https://facebook.com',
    deviceType: 'desktop',
    browser: 'Safari',
    os: 'macOS',
    country: 'Brazil',
    city: 'Rio de Janeiro',
    conversion: false
  },
  {
    id: 'click003',
    campaignId: 'camp001',
    timestamp: '2023-09-15T10:25:30Z',
    ip: '190.34.67.90',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    referrer: 'https://facebook.com',
    deviceType: 'mobile',
    browser: 'Safari',
    os: 'iOS',
    country: 'Brazil',
    city: 'Belo Horizonte',
    conversion: true,
    value: 97.00
  },
  {
    id: 'click004',
    campaignId: 'camp002',
    timestamp: '2023-09-15T10:30:45Z',
    ip: '191.45.78.91',
    userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    referrer: 'https://facebook.com',
    deviceType: 'mobile',
    browser: 'Chrome',
    os: 'Android',
    country: 'Brazil',
    city: 'Salvador',
    conversion: true,
    value: 147.00
  },
  {
    id: 'click005',
    campaignId: 'camp002',
    timestamp: '2023-09-15T10:35:00Z',
    ip: '192.56.89.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    referrer: 'https://facebook.com',
    deviceType: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    country: 'Brazil',
    city: 'Curitiba',
    conversion: false
  },
  {
    id: 'click006',
    campaignId: 'camp003',
    timestamp: '2023-09-15T10:40:15Z',
    ip: '193.67.90.23',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    referrer: 'https://google.com',
    deviceType: 'desktop',
    browser: 'Chrome',
    os: 'macOS',
    country: 'Brazil',
    city: 'Fortaleza',
    conversion: true,
    value: 67.00
  },
  {
    id: 'click007',
    campaignId: 'camp003',
    timestamp: '2023-09-15T10:45:30Z',
    ip: '194.78.91.34',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    referrer: 'https://google.com',
    deviceType: 'tablet',
    browser: 'Safari',
    os: 'iOS',
    country: 'Brazil',
    city: 'Recife',
    conversion: false
  },
  {
    id: 'click008',
    campaignId: 'camp004',
    timestamp: '2023-09-15T10:50:45Z',
    ip: '195.89.12.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    referrer: 'https://mail.google.com',
    deviceType: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    country: 'Brazil',
    city: 'Porto Alegre',
    conversion: true,
    value: 97.00
  },
  {
    id: 'click009',
    campaignId: 'camp004',
    timestamp: '2023-09-15T10:55:00Z',
    ip: '196.90.23.56',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    referrer: 'https://mail.google.com',
    deviceType: 'mobile',
    browser: 'Safari',
    os: 'iOS',
    country: 'Brazil',
    city: 'Brasília',
    conversion: true,
    value: 97.00
  },
  {
    id: 'click010',
    campaignId: 'camp001',
    timestamp: '2023-09-15T11:00:15Z',
    ip: '197.12.45.78',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    referrer: 'https://facebook.com',
    deviceType: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    country: 'Brazil',
    city: 'São Paulo',
    conversion: false
  }
];

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: 'notif001',
    userId: 'usr001',
    title: 'Campanha Ativada',
    message: 'Sua campanha "Campanha Produto Premium" foi ativada com sucesso.',
    type: 'success',
    read: false,
    dateCreated: '2023-09-15T14:30:00Z',
    link: '/dashboard/campaigns'
  },
  {
    id: 'notif002',
    userId: 'usr001',
    title: 'Nova Conversão',
    message: 'Você tem uma nova conversão no valor de R$ 97,00.',
    type: 'info',
    read: true,
    dateCreated: '2023-09-15T10:15:00Z',
    link: '/dashboard/sales'
  },
  {
    id: 'notif003',
    userId: 'usr001',
    title: 'Assinatura Expirando',
    message: 'Sua assinatura irá expirar em 7 dias. Renove agora para não perder o acesso.',
    type: 'warning',
    read: false,
    dateCreated: '2023-09-14T09:00:00Z',
    link: '/dashboard/subscriptions'
  },
  {
    id: 'notif004',
    userId: 'usr002',
    title: 'Ticket Respondido',
    message: 'Seu ticket de suporte foi respondido. Clique para visualizar.',
    type: 'info',
    read: false,
    dateCreated: '2023-09-15T11:45:00Z',
    link: '/dashboard/support'
  },
  {
    id: 'notif005',
    userId: 'usr001',
    title: 'Integração Desconectada',
    message: 'A integração com Google Ads foi desconectada. Reconecte para continuar rastreando.',
    type: 'error',
    read: false,
    dateCreated: '2023-09-13T16:20:00Z',
    link: '/dashboard/integrations'
  }
];

// Mock subscriptions data
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub001',
    userId: 'usr001',
    plan: 'pro',
    status: 'active',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    amount: 997.00,
    paymentMethod: 'credit_card',
    autoRenew: true,
    features: ['unlimited_campaigns', 'priority_support', 'advanced_analytics', 'team_access']
  },
  {
    id: 'sub002',
    userId: 'usr002',
    plan: 'basic',
    status: 'active',
    startDate: '2023-03-15T00:00:00Z',
    endDate: '2023-09-15T23:59:59Z',
    amount: 497.00,
    paymentMethod: 'pix',
    autoRenew: false,
    features: ['10_campaigns', 'basic_support', 'standard_analytics']
  },
  {
    id: 'sub003',
    userId: 'usr003',
    plan: 'free',
    status: 'active',
    startDate: '2023-05-10T00:00:00Z',
    endDate: '2023-06-10T23:59:59Z',
    amount: 0.00,
    paymentMethod: 'other',
    autoRenew: false,
    features: ['3_campaigns', 'community_support', 'basic_analytics']
  },
  {
    id: 'sub004',
    userId: 'usr004',
    plan: 'enterprise',
    status: 'cancelled',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-06-30T23:59:59Z',
    amount: 1997.00,
    paymentMethod: 'bank_transfer',
    autoRenew: false,
    features: ['unlimited_campaigns', 'vip_support', 'premium_analytics', 'team_access', 'white_label', 'api_access']
  },
  {
    id: 'sub005',
    userId: 'usr005',
    plan: 'basic',
    status: 'pending',
    startDate: '2023-09-10T00:00:00Z',
    endDate: '2024-03-10T23:59:59Z',
    amount: 497.00,
    paymentMethod: 'pix',
    autoRenew: true,
    features: ['10_campaigns', 'basic_support', 'standard_analytics']
  }
];

// Mock referrals data
export const mockReferrals: Referral[] = [
  {
    id: 'ref001',
    userId: 'usr001',
    code: 'JOAO2023',
    visits: 245,
    signups: 32,
    conversions: 15,
    earnings: 748.50,
    dateCreated: '2023-01-15T10:00:00Z',
    status: 'active'
  },
  {
    id: 'ref002',
    userId: 'usr002',
    code: 'MARIA2023',
    visits: 156,
    signups: 18,
    conversions: 7,
    earnings: 348.30,
    dateCreated: '2023-02-20T14:30:00Z',
    status: 'active'
  },
  {
    id: 'ref003',
    userId: 'usr003',
    code: 'CARLOS2023',
    visits: 87,
    signups: 5,
    conversions: 2,
    earnings: 99.70,
    dateCreated: '2023-03-10T09:15:00Z',
    status: 'active'
  },
  {
    id: 'ref004',
    userId: 'usr004',
    code: 'ANA2023',
    visits: 42,
    signups: 0,
    conversions: 0,
    earnings: 0.00,
    dateCreated: '2023-04-05T11:30:00Z',
    status: 'inactive'
  },
  {
    id: 'ref005',
    userId: 'usr006',
    code: 'FERNANDA2023',
    visits: 189,
    signups: 21,
    conversions: 9,
    earnings: 447.30,
    dateCreated: '2023-02-10T16:45:00Z',
    status: 'active'
  }
];

// Mock support messages
const mockMessages1: SupportMessage[] = [
  {
    id: 'msg001',
    ticketId: 'ticket001',
    userId: 'usr001',
    message: 'Estou tendo problemas para conectar minha conta do Facebook Ads. O sistema diz que o token está inválido.',
    dateCreated: '2023-09-10T09:30:00Z',
    isStaff: false
  },
  {
    id: 'msg002',
    ticketId: 'ticket001',
    userId: 'usr007', // staff
    message: 'Olá João, obrigado por entrar em contato. Vamos verificar isso. Você poderia tentar desconectar e conectar novamente a sua conta?',
    dateCreated: '2023-09-10T10:15:00Z',
    isStaff: true
  },
  {
    id: 'msg003',
    ticketId: 'ticket001',
    userId: 'usr001',
    message: 'Já tentei fazer isso, mas continua com o mesmo erro.',
    dateCreated: '2023-09-10T10:30:00Z',
    isStaff: false
  }
];

const mockMessages2: SupportMessage[] = [
  {
    id: 'msg004',
    ticketId: 'ticket002',
    userId: 'usr002',
    message: 'Gostaria de solicitar um recurso para exportar relatórios em formato CSV.',
    dateCreated: '2023-09-12T14:00:00Z',
    isStaff: false
  }
];

const mockMessages3: SupportMessage[] = [
  {
    id: 'msg005',
    ticketId: 'ticket003',
    userId: 'usr003',
    message: 'Estou recebendo cobranças duplicadas na minha assinatura. Poderiam verificar?',
    dateCreated: '2023-09-15T11:20:00Z',
    isStaff: false
  },
  {
    id: 'msg006',
    ticketId: 'ticket003',
    userId: 'usr007', // staff
    message: 'Olá Carlos, obrigado por reportar. Vamos verificar isso imediatamente e corrigir qualquer cobrança incorreta.',
    dateCreated: '2023-09-15T11:45:00Z',
    isStaff: true
  }
];

// Mock support tickets data
export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket001',
    userId: 'usr001',
    subject: 'Problema com integração Facebook Ads',
    message: 'Estou tendo problemas para conectar minha conta do Facebook Ads. O sistema diz que o token está inválido.',
    status: 'in_progress',
    priority: 'medium',
    category: 'technical',
    dateCreated: '2023-09-10T09:30:00Z',
    dateUpdated: '2023-09-10T10:30:00Z',
    assignedTo: 'usr007',
    messages: mockMessages1
  },
  {
    id: 'ticket002',
    userId: 'usr002',
    subject: 'Solicitação de recurso - Exportação CSV',
    message: 'Gostaria de solicitar um recurso para exportar relatórios em formato CSV.',
    status: 'open',
    priority: 'low',
    category: 'feature_request',
    dateCreated: '2023-09-12T14:00:00Z',
    dateUpdated: '2023-09-12T14:00:00Z',
    messages: mockMessages2
  },
  {
    id: 'ticket003',
    userId: 'usr003',
    subject: 'Cobrança duplicada',
    message: 'Estou recebendo cobranças duplicadas na minha assinatura. Poderiam verificar?',
    status: 'in_progress',
    priority: 'high',
    category: 'billing',
    dateCreated: '2023-09-15T11:20:00Z',
    dateUpdated: '2023-09-15T11:45:00Z',
    assignedTo: 'usr007',
    messages: mockMessages3
  },
  {
    id: 'ticket004',
    userId: 'usr006',
    subject: 'Dúvida sobre relatórios',
    message: 'Preciso de ajuda para entender os relatórios de performance. Existem métricas que não estou compreendendo.',
    status: 'open',
    priority: 'medium',
    category: 'general',
    dateCreated: '2023-09-14T15:30:00Z',
    dateUpdated: '2023-09-14T15:30:00Z',
    messages: []
  },
  {
    id: 'ticket005',
    userId: 'usr004',
    subject: 'Erro ao criar campanha',
    message: 'Estou recebendo um erro ao tentar criar uma nova campanha. A página trava após o envio do formulário.',
    status: 'resolved',
    priority: 'high',
    category: 'technical',
    dateCreated: '2023-09-08T10:15:00Z',
    dateUpdated: '2023-09-09T14:20:00Z',
    assignedTo: 'usr007',
    messages: []
  }
];

// Mock system status data
export const mockSystemStatus: SystemStatus[] = [
  {
    id: 'status001',
    service: 'API',
    status: 'operational',
    message: 'Todos os serviços da API estão funcionando normalmente.',
    lastUpdated: '2023-09-15T08:00:00Z'
  },
  {
    id: 'status002',
    service: 'Dashboard',
    status: 'operational',
    message: 'O Dashboard está funcionando normalmente.',
    lastUpdated: '2023-09-15T08:00:00Z'
  },
  {
    id: 'status003',
    service: 'Tracking',
    status: 'operational',
    message: 'O sistema de rastreamento está funcionando normalmente.',
    lastUpdated: '2023-09-15T08:00:00Z'
  },
  {
    id: 'status004',
    service: 'Pagamentos',
    status: 'operational',
    message: 'O processamento de pagamentos está funcionando normalmente.',
    lastUpdated: '2023-09-15T08:00:00Z'
  },
  {
    id: 'status005',
    service: 'Integrações',
    status: 'degraded',
    message: 'Algumas integrações estão enfrentando atrasos. Nossa equipe está trabalhando para resolver o problema.',
    lastUpdated: '2023-09-15T10:30:00Z',
    affectedComponents: ['Facebook Ads', 'Google Ads']
  }
];
