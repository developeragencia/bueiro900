import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos para as entidades principais com validação de dados
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  dateCreated: string;
  avatar?: string;
  permissions?: string[];
  settings?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export interface Campaign {
  id: string;
  name: string;
  url: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string;
  utmContent?: string;
  status: 'active' | 'paused' | 'draft' | 'archived';
  spend: number;
  revenue: number;
  conversions: number;
  visits: number;
  dateCreated: string;
  dateUpdated: string;
  tags: string[];
  platform?: string;
  metrics?: {
    roas?: number;
    cpc?: number;
    ctr?: number;
    conversionRate?: number;
  };
  goals?: {
    targetSpend?: number;
    targetRevenue?: number;
    targetConversions?: number;
  };
}

export interface Integration {
  id: string;
  name: string;
  type: 'checkout' | 'ads' | 'analytics' | 'other';
  icon: string;
  status: 'connected' | 'disconnected';
  dateConnected?: string;
  apiKey?: string;
  settings?: Record<string, any>;
}

export interface Click {
  id: string;
  campaignId: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  conversion: boolean;
  value?: number;
}

// New interfaces for the added features
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  dateCreated: string;
  link?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: 'credit_card' | 'pix' | 'bank_transfer' | 'other';
  autoRenew: boolean;
  features: string[];
}

export interface Referral {
  id: string;
  userId: string;
  code: string;
  visits: number;
  signups: number;
  conversions: number;
  earnings: number;
  dateCreated: string;
  status: 'active' | 'inactive';
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature_request' | 'general';
  dateCreated: string;
  dateUpdated: string;
  assignedTo?: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  dateCreated: string;
  isStaff: boolean;
}

export interface SystemStatus {
  id: string;
  service: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  message: string;
  lastUpdated: string;
  affectedComponents?: string[];
}

export interface AppState {
  // Estado de autenticação
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    socialProvider?: 'google' | 'facebook' | null;
  };

  // Dados da aplicação
  campaigns: Campaign[];
  integrations: Integration[];
  clicks: Click[];
  users: User[];

  // New state properties
  notifications: Notification[];
  subscriptions: Subscription[];
  referrals: Referral[];
  supportTickets: SupportTicket[];
  systemStatus: SystemStatus[];

  // Ações de autenticação
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  loginWithFacebook: () => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<User>;

  // Ações de campanhas
  addCampaign: (campaign: Omit<Campaign, 'id' | 'dateCreated' | 'dateUpdated'>) => Promise<Campaign>;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  generateUtmUrl: (baseUrl: string, params: { source: string; medium: string; campaign: string; term?: string; content?: string }) => string;

  // Ações de integrações
  addIntegration: (integration: Omit<Integration, 'id' | 'dateConnected'>) => Promise<Integration>;
  updateIntegration: (id: string, integration: Partial<Integration>) => Promise<Integration>;
  deleteIntegration: (id: string) => Promise<void>;

  // Ações de usuários
  addUser: (user: Omit<User, 'id' | 'dateCreated'>) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;

  // Ações de cliques
  recordClick: (click: Omit<Click, 'id' | 'timestamp'>) => Promise<Click>;
  recordConversion: (clickId: string, value?: number) => Promise<Click>;

  // New actions for notifications
  addNotification: (notification: Omit<Notification, 'id' | 'dateCreated'>) => Promise<Notification>;
  markNotificationAsRead: (id: string) => Promise<Notification>;
  deleteNotification: (id: string) => Promise<void>;

  // New actions for subscriptions
  addSubscription: (subscription: Omit<Subscription, 'id'>) => Promise<Subscription>;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => Promise<Subscription>;
  cancelSubscription: (id: string) => Promise<Subscription>;

  // New actions for referrals
  generateReferralCode: (userId: string) => Promise<Referral>;
  trackReferralVisit: (code: string) => Promise<Referral>;
  trackReferralSignup: (code: string) => Promise<Referral>;
  trackReferralConversion: (code: string, amount: number) => Promise<Referral>;

  // New actions for support tickets
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'dateCreated' | 'dateUpdated' | 'messages'>) => Promise<SupportTicket>;
  updateSupportTicket: (id: string, ticket: Partial<SupportTicket>) => Promise<SupportTicket>;
  addSupportMessage: (ticketId: string, message: Omit<SupportMessage, 'id' | 'ticketId' | 'dateCreated'>) => Promise<SupportMessage>;

  // New actions for system status
  updateSystemStatus: (id: string, status: Partial<SystemStatus>) => Promise<SystemStatus>;
  addSystemStatus: (status: Omit<SystemStatus, 'id' | 'lastUpdated'>) => Promise<SystemStatus>;
}

// Mock data para desenvolvimento
import {
  mockCampaigns,
  mockIntegrations,
  mockUsers,
  mockClicks,
  mockNotifications,
  mockSubscriptions,
  mockReferrals,
  mockSupportTickets,
  mockSystemStatus,
  mockAuth
} from './mock-data';

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        socialProvider: null,
      },
      campaigns: mockCampaigns,
      integrations: mockIntegrations,
      users: mockUsers,
      clicks: mockClicks,
      notifications: mockNotifications,
      subscriptions: mockSubscriptions,
      referrals: mockReferrals,
      supportTickets: mockSupportTickets,
      systemStatus: mockSystemStatus,

      // Implementação de ações
      login: async (email, password) => {
        // Simulação de login
        const user = mockUsers.find(u => u.email === email);

        // Verifica se o usuário existe e a senha está correta
        if (user && mockAuth.passwords[email] === password) {
          // Simula uma resposta de API
          await new Promise(resolve => setTimeout(resolve, 500));

          set({
            auth: {
              isAuthenticated: true,
              user,
              token: 'fake-jwt-token',
              socialProvider: null,
            }
          });

          return user;
        }

        throw new Error('Credenciais inválidas');
      },

      loginWithGoogle: async () => {
        // Simulação de login com Google
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Usuário de exemplo para o login com Google
        const googleUser: User = {
          id: 'google-user-123',
          name: 'Usuário Google',
          email: 'usuario.google@gmail.com',
          role: 'viewer',
          status: 'active',
          lastActive: new Date().toISOString(),
          dateCreated: new Date().toISOString(),
          avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff',
        };

        set({
          auth: {
            isAuthenticated: true,
            user: googleUser,
            token: 'google-fake-jwt-token',
            socialProvider: 'google',
          }
        });

        return googleUser;
      },

      loginWithFacebook: async () => {
        // Simulação de login com Facebook
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Usuário de exemplo para o login com Facebook
        const facebookUser: User = {
          id: 'facebook-user-123',
          name: 'Usuário Facebook',
          email: 'usuario.facebook@gmail.com',
          role: 'viewer',
          status: 'active',
          lastActive: new Date().toISOString(),
          dateCreated: new Date().toISOString(),
          avatar: 'https://ui-avatars.com/api/?name=Facebook+User&background=1877F2&color=fff',
        };

        set({
          auth: {
            isAuthenticated: true,
            user: facebookUser,
            token: 'facebook-fake-jwt-token',
            socialProvider: 'facebook',
          }
        });

        return facebookUser;
      },

      logout: () => {
        set({
          auth: {
            isAuthenticated: false,
            user: null,
            token: null,
            socialProvider: null,
          }
        });
      },

      register: async (name, email, password) => {
        // Simulação de registro
        await new Promise(resolve => setTimeout(resolve, 500));

        const newUser: User = {
          id: `usr${Date.now()}`,
          name,
          email,
          role: 'viewer',
          status: 'active',
          lastActive: new Date().toISOString(),
          dateCreated: new Date().toISOString(),
        };

        set(state => ({
          users: [...state.users, newUser],
          auth: {
            isAuthenticated: true,
            user: newUser,
            token: 'fake-jwt-token',
          }
        }));

        return newUser;
      },

      addCampaign: async (campaignData) => {
        const newCampaign: Campaign = {
          id: `camp${Date.now()}`,
          ...campaignData,
          dateCreated: new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
          spend: campaignData.spend || 0,
          revenue: campaignData.revenue || 0,
          conversions: campaignData.conversions || 0,
          visits: campaignData.visits || 0, // Initialize visits
          tags: campaignData.tags || [],
        };

        set(state => ({
          campaigns: [...state.campaigns, newCampaign],
        }));

        return newCampaign;
      },

      updateCampaign: async (id, campaignData) => {
        const campaigns = get().campaigns;
        const campaignIndex = campaigns.findIndex(c => c.id === id);

        if (campaignIndex === -1) {
          throw new Error('Campanha não encontrada');
        }

        const updatedCampaign = {
          ...campaigns[campaignIndex],
          ...campaignData,
          dateUpdated: new Date().toISOString(),
        };

        const updatedCampaigns = [...campaigns];
        updatedCampaigns[campaignIndex] = updatedCampaign;

        set({ campaigns: updatedCampaigns });

        return updatedCampaign;
      },

      deleteCampaign: async (id) => {
        set(state => ({
          campaigns: state.campaigns.filter(c => c.id !== id),
        }));
      },

      addIntegration: async (integrationData) => {
        const newIntegration: Integration = {
          id: `int${Date.now()}`,
          ...integrationData,
          dateConnected: new Date().toISOString(),
        };

        set(state => ({
          integrations: [...state.integrations, newIntegration],
        }));

        return newIntegration;
      },

      updateIntegration: async (id, integrationData) => {
        const integrations = get().integrations;
        const integrationIndex = integrations.findIndex(i => i.id === id);

        if (integrationIndex === -1) {
          throw new Error('Integração não encontrada');
        }

        const updatedIntegration = {
          ...integrations[integrationIndex],
          ...integrationData,
        };

        const updatedIntegrations = [...integrations];
        updatedIntegrations[integrationIndex] = updatedIntegration;

        set({ integrations: updatedIntegrations });

        return updatedIntegration;
      },

      deleteIntegration: async (id) => {
        set(state => ({
          integrations: state.integrations.filter(i => i.id !== id),
        }));
      },

      addUser: async (userData) => {
        const newUser: User = {
          id: `usr${Date.now()}`,
          ...userData,
          dateCreated: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };

        set(state => ({
          users: [...state.users, newUser],
        }));

        return newUser;
      },

      updateUser: async (id, userData) => {
        const users = get().users;
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
          throw new Error('Usuário não encontrado');
        }

        const updatedUser = {
          ...users[userIndex],
          ...userData,
        };

        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedUser;

        set({ users: updatedUsers });

        return updatedUser;
      },

      deleteUser: async (id) => {
        set(state => ({
          users: state.users.filter(u => u.id !== id),
        }));
      },

      recordClick: async (clickData) => {
        const newClick: Click = {
          id: `click${Date.now()}`,
          ...clickData,
          timestamp: new Date().toISOString(),
        };

        set(state => ({
          clicks: [...state.clicks, newClick],
        }));

        // Atualiza estatísticas da campanha
        const { campaigns } = get();
        const campaignIndex = campaigns.findIndex(c => c.id === clickData.campaignId);

        if (campaignIndex !== -1) {
          const updatedCampaigns = [...campaigns];
          updatedCampaigns[campaignIndex].visits = (updatedCampaigns[campaignIndex].visits || 0) + 1; // Increment visits
          if (clickData.conversion) {
            updatedCampaigns[campaignIndex] = {
              ...updatedCampaigns[campaignIndex],
              conversions: updatedCampaigns[campaignIndex].conversions + 1,
              revenue: updatedCampaigns[campaignIndex].revenue + (clickData.value || 0),
            };
          }

          set({ campaigns: updatedCampaigns });
        }

        return newClick;
      },

      recordConversion: async (clickId, value = 0) => {
        const clicks = get().clicks;
        const clickIndex = clicks.findIndex(c => c.id === clickId);

        if (clickIndex === -1) {
          throw new Error('Click não encontrado');
        }

        const updatedClick = {
          ...clicks[clickIndex],
          conversion: true,
          value,
        };

        const updatedClicks = [...clicks];
        updatedClicks[clickIndex] = updatedClick;

        set({ clicks: updatedClicks });

        // Atualiza estatísticas da campanha
        const { campaigns } = get();
        const campaignIndex = campaigns.findIndex(c => c.id === updatedClick.campaignId);

        if (campaignIndex !== -1) {
          const updatedCampaigns = [...campaigns];
          updatedCampaigns[campaignIndex] = {
            ...updatedCampaigns[campaignIndex],
            conversions: updatedCampaigns[campaignIndex].conversions + 1,
            revenue: updatedCampaigns[campaignIndex].revenue + value,
          };

          set({ campaigns: updatedCampaigns });
        }

        return updatedClick;
      },

      generateUtmUrl: (baseUrl: string, params: { source: string; medium: string; campaign: string; term?: string; content?: string }) => {
        // Create URL object
        let url;
        try {
          url = new URL(baseUrl);
        } catch (e) {
          // If the URL is invalid, try adding https://
          try {
            url = new URL(`https://${baseUrl}`);
          } catch (e) {
            // If still invalid, return empty string
            return '';
          }
        }

        // Add UTM parameters
        url.searchParams.append('utm_source', params.source);
        url.searchParams.append('utm_medium', params.medium);
        url.searchParams.append('utm_campaign', params.campaign);
        if (params.term) url.searchParams.append('utm_term', params.term);
        if (params.content) url.searchParams.append('utm_content', params.content);

        return url.toString();
      },

      // Notification actions implementation
      addNotification: async (notificationData) => {
        const newNotification: Notification = {
          id: `notif${Date.now()}`,
          ...notificationData,
          dateCreated: new Date().toISOString(),
        };

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

        return newNotification;
      },

      markNotificationAsRead: async (id) => {
        const notifications = get().notifications;
        const notificationIndex = notifications.findIndex(n => n.id === id);

        if (notificationIndex === -1) {
          throw new Error('Notificação não encontrada');
        }

        const updatedNotification = {
          ...notifications[notificationIndex],
          read: true,
        };

        const updatedNotifications = [...notifications];
        updatedNotifications[notificationIndex] = updatedNotification;

        set({ notifications: updatedNotifications });

        return updatedNotification;
      },

      deleteNotification: async (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      // Subscription actions implementation
      addSubscription: async (subscriptionData) => {
        const newSubscription: Subscription = {
          id: `sub${Date.now()}`,
          ...subscriptionData,
        };

        set(state => ({
          subscriptions: [...state.subscriptions, newSubscription],
        }));

        return newSubscription;
      },

      updateSubscription: async (id, subscriptionData) => {
        const subscriptions = get().subscriptions;
        const subscriptionIndex = subscriptions.findIndex(s => s.id === id);

        if (subscriptionIndex === -1) {
          throw new Error('Assinatura não encontrada');
        }

        const updatedSubscription = {
          ...subscriptions[subscriptionIndex],
          ...subscriptionData,
        };

        const updatedSubscriptions = [...subscriptions];
        updatedSubscriptions[subscriptionIndex] = updatedSubscription;

        set({ subscriptions: updatedSubscriptions });

        return updatedSubscription;
      },

      cancelSubscription: async (id) => {
        const subscriptions = get().subscriptions;
        const subscriptionIndex = subscriptions.findIndex(s => s.id === id);

        if (subscriptionIndex === -1) {
          throw new Error('Assinatura não encontrada');
        }

        const updatedSubscription = {
          ...subscriptions[subscriptionIndex],
          status: 'cancelled' as const,
          autoRenew: false,
        };

        const updatedSubscriptions = [...subscriptions];
        updatedSubscriptions[subscriptionIndex] = updatedSubscription;

        set({ subscriptions: updatedSubscriptions });

        return updatedSubscription;
      },

      // Referral actions implementation
      generateReferralCode: async (userId) => {
        // Check if user already has a referral code
        const existingReferral = get().referrals.find(r => r.userId === userId);

        if (existingReferral) {
          return existingReferral;
        }

        // Generate a random code with user id and random characters
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
          code += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        const newReferral: Referral = {
          id: `ref${Date.now()}`,
          userId,
          code,
          visits: 0,
          signups: 0,
          conversions: 0,
          earnings: 0,
          dateCreated: new Date().toISOString(),
          status: 'active',
        };

        set(state => ({
          referrals: [...state.referrals, newReferral],
        }));

        return newReferral;
      },

      trackReferralVisit: async (code) => {
        const referrals = get().referrals;
        const referralIndex = referrals.findIndex(r => r.code === code);

        if (referralIndex === -1) {
          throw new Error('Código de indicação não encontrado');
        }

        const updatedReferral = {
          ...referrals[referralIndex],
          visits: referrals[referralIndex].visits + 1,
        };

        const updatedReferrals = [...referrals];
        updatedReferrals[referralIndex] = updatedReferral;

        set({ referrals: updatedReferrals });

        return updatedReferral;
      },

      trackReferralSignup: async (code) => {
        const referrals = get().referrals;
        const referralIndex = referrals.findIndex(r => r.code === code);

        if (referralIndex === -1) {
          throw new Error('Código de indicação não encontrado');
        }

        const updatedReferral = {
          ...referrals[referralIndex],
          signups: referrals[referralIndex].signups + 1,
        };

        const updatedReferrals = [...referrals];
        updatedReferrals[referralIndex] = updatedReferral;

        set({ referrals: updatedReferrals });

        return updatedReferral;
      },

      trackReferralConversion: async (code, amount) => {
        const referrals = get().referrals;
        const referralIndex = referrals.findIndex(r => r.code === code);

        if (referralIndex === -1) {
          throw new Error('Código de indicação não encontrado');
        }

        // Calculate commission (10% of amount)
        const commission = amount * 0.1;

        const updatedReferral = {
          ...referrals[referralIndex],
          conversions: referrals[referralIndex].conversions + 1,
          earnings: referrals[referralIndex].earnings + commission,
        };

        const updatedReferrals = [...referrals];
        updatedReferrals[referralIndex] = updatedReferral;

        set({ referrals: updatedReferrals });

        return updatedReferral;
      },

      // Support ticket actions implementation
      createSupportTicket: async (ticketData) => {
        const newTicket: SupportTicket = {
          id: `ticket${Date.now()}`,
          ...ticketData,
          dateCreated: new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
          messages: [],
        };

        set(state => ({
          supportTickets: [...state.supportTickets, newTicket],
        }));

        // Create initial message from the user
        const initialMessage: SupportMessage = {
          id: `msg${Date.now()}`,
          ticketId: newTicket.id,
          userId: ticketData.userId,
          message: ticketData.message,
          dateCreated: new Date().toISOString(),
          isStaff: false,
        };

        // Add message to the ticket
        const supportTickets = get().supportTickets;
        const ticketIndex = supportTickets.findIndex(t => t.id === newTicket.id);

        if (ticketIndex !== -1) {
          const updatedTicket = {
            ...supportTickets[ticketIndex],
            messages: [initialMessage],
          };

          const updatedTickets = [...supportTickets];
          updatedTickets[ticketIndex] = updatedTicket;

          set({ supportTickets: updatedTickets });
        }

        return newTicket;
      },

      updateSupportTicket: async (id, ticketData) => {
        const supportTickets = get().supportTickets;
        const ticketIndex = supportTickets.findIndex(t => t.id === id);

        if (ticketIndex === -1) {
          throw new Error('Ticket de suporte não encontrado');
        }

        const updatedTicket = {
          ...supportTickets[ticketIndex],
          ...ticketData,
          dateUpdated: new Date().toISOString(),
        };

        const updatedTickets = [...supportTickets];
        updatedTickets[ticketIndex] = updatedTicket;

        set({ supportTickets: updatedTickets });

        return updatedTicket;
      },

      addSupportMessage: async (ticketId, messageData) => {
        const supportTickets = get().supportTickets;
        const ticketIndex = supportTickets.findIndex(t => t.id === ticketId);

        if (ticketIndex === -1) {
          throw new Error('Ticket de suporte não encontrado');
        }

        const newMessage: SupportMessage = {
          id: `msg${Date.now()}`,
          ticketId,
          ...messageData,
          dateCreated: new Date().toISOString(),
        };

        const updatedTicket = {
          ...supportTickets[ticketIndex],
          messages: [...supportTickets[ticketIndex].messages, newMessage],
          dateUpdated: new Date().toISOString(),
          // If staff replied, update status to in_progress if it was open
          status: messageData.isStaff && supportTickets[ticketIndex].status === 'open'
            ? 'in_progress'
            : supportTickets[ticketIndex].status,
        };

        const updatedTickets = [...supportTickets];
        updatedTickets[ticketIndex] = updatedTicket;

        set({ supportTickets: updatedTickets });

        return newMessage;
      },

      // System status actions implementation
      updateSystemStatus: async (id, statusData) => {
        const systemStatus = get().systemStatus;
        const statusIndex = systemStatus.findIndex(s => s.id === id);

        if (statusIndex === -1) {
          throw new Error('Status do sistema não encontrado');
        }

        const updatedStatus = {
          ...systemStatus[statusIndex],
          ...statusData,
          lastUpdated: new Date().toISOString(),
        };

        const updatedSystemStatus = [...systemStatus];
        updatedSystemStatus[statusIndex] = updatedStatus;

        set({ systemStatus: updatedSystemStatus });

        return updatedStatus;
      },

      addSystemStatus: async (statusData) => {
        const newStatus: SystemStatus = {
          id: `status${Date.now()}`,
          ...statusData,
          lastUpdated: new Date().toISOString(),
        };

        set(state => ({
          systemStatus: [...state.systemStatus, newStatus],
        }));

        return newStatus;
      },
    }),
    {
      name: 'bueiro-digital-storage',
    }
  )
);
