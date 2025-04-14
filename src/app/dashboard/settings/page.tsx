"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Settings,
  User,
  Bell,
  Globe,
  Lock,
  CreditCard,
  RefreshCw,
  Save,
  Image,
  Mail,
  ShieldAlert,
  KeyRound,
  Languages,
  Smartphone,
  Palette,
  Webhook,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Settings tabs
type SettingsTab = 'profile' | 'account' | 'notifications' | 'integrations' | 'billing' | 'advanced' | 'security';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  salesAlert: boolean;
  customerAlert: boolean;
  integrationAlert: boolean;
  systemAlert: boolean;
}

interface IntegrationSettings {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  lastSync?: string;
  icon: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  phone?: string;
  timezone: string;
  language: string;
  avatar?: string;
}

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
  };
  integrations: {
    google: boolean;
    slack: boolean;
    github: boolean;
    stripe: boolean;
  };
}

const mockNotifications: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
  whatsapp: true,
  salesAlert: true,
  customerAlert: true,
  integrationAlert: false,
  systemAlert: true
};

const mockIntegrations: IntegrationSettings[] = [
  {
    id: '1',
    name: 'Facebook Business',
    status: 'connected',
    lastSync: '2024-03-18T14:30:00',
    icon: '📱'
  },
  {
    id: '2',
    name: 'Google Analytics',
    status: 'connected',
    lastSync: '2024-03-18T14:00:00',
    icon: '📊'
  },
  {
    id: '3',
    name: 'Shopify',
    status: 'disconnected',
    icon: '🛍️'
  }
];

const mockProfile: UserProfile = {
  name: 'João Silva',
  email: 'joao.silva@empresa.com',
  role: 'Administrador',
  company: 'Empresa LTDA',
  phone: '+55 11 99999-9999',
  timezone: 'America/Sao_Paulo',
  language: 'pt-BR',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
};

const mockSettings: Settings = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketing: false
  },
  appearance: {
    theme: 'system',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
    loginNotifications: true
  },
  integrations: {
    google: true,
    slack: false,
    github: true,
    stripe: true
  }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotifications);
  const [integrations] = useState<IntegrationSettings[]>(mockIntegrations);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProfileChange = (key: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAppearanceChange = (key: keyof Settings['appearance'], value: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };

  const handleSecurityChange = (key: keyof Settings['security'], value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  const handleIntegrationToggle = (key: keyof Settings['integrations']) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [key]: !prev.integrations[key]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-500 mt-1">Gerencie suas preferências e configurações do sistema</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <nav className="flex flex-col p-2">
                <SettingsNavItem
                  label="Perfil"
                  icon={<User className="h-5 w-5" />}
                  isActive={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                />
                <SettingsNavItem
                  label="Conta"
                  icon={<Settings className="h-5 w-5" />}
                  isActive={activeTab === 'account'}
                  onClick={() => setActiveTab('account')}
                />
                <SettingsNavItem
                  label="Notificações"
                  icon={<Bell className="h-5 w-5" />}
                  isActive={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                />
                <SettingsNavItem
                  label="Integrações"
                  icon={<RefreshCw className="h-5 w-5" />}
                  isActive={activeTab === 'integrations'}
                  onClick={() => setActiveTab('integrations')}
                />
                <SettingsNavItem
                  label="Faturamento"
                  icon={<CreditCard className="h-5 w-5" />}
                  isActive={activeTab === 'billing'}
                  onClick={() => setActiveTab('billing')}
                />
                <SettingsNavItem
                  label="Avançado"
                  icon={<ShieldAlert className="h-5 w-5" />}
                  isActive={activeTab === 'advanced'}
                  onClick={() => setActiveTab('advanced')}
                />
                <SettingsNavItem
                  label="Segurança"
                  icon={<Lock className="h-5 w-5" />}
                  isActive={activeTab === 'security'}
                  onClick={() => setActiveTab('security')}
                />
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Perfil do Usuário</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {isEditing ? 'Salvar' : 'Editar'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Empresa</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => handleProfileChange('company', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fuso Horário</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => handleProfileChange('timezone', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="America/Sao_Paulo">América/São Paulo</option>
                      <option value="America/New_York">América/Nova York</option>
                      <option value="Europe/London">Europa/Londres</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Idioma</label>
                    <select
                      value={profile.language}
                      onChange={(e) => handleProfileChange('language', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                  <CardDescription>Gerencie sua conta e configurações de segurança</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-gray-500" />
                      Segurança
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alterar Senha
                        </label>
                        <div className="space-y-2">
                          <Input type="password" placeholder="Senha atual" />
                          <Input type="password" placeholder="Nova senha" />
                          <Input type="password" placeholder="Confirmar nova senha" />
                        </div>
                        <Button
                          className="mt-2"
                          variant="outline"
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          <KeyRound className="h-4 w-4 mr-2" />
                          {isSaving ? 'Alterando...' : 'Alterar Senha'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Autenticação em Dois Fatores</h4>
                          <p className="text-sm text-gray-500">Aumente a segurança da sua conta com 2FA</p>
                        </div>
                        <Button variant="outline">Configurar 2FA</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-gray-500" />
                      Preferências Regionais
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Formato de Data
                        </label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option>DD/MM/AAAA</option>
                          <option>MM/DD/AAAA</option>
                          <option>AAAA-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moeda
                        </label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option>Real (R$)</option>
                          <option>Dólar (US$)</option>
                          <option>Euro (€)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fuso Horário
                        </label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option>America/Sao_Paulo (GMT-3)</option>
                          <option>UTC (GMT+0)</option>
                          <option>America/New_York (GMT-5)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Formato de Número
                        </label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option>1.234,56</option>
                          <option>1,234.56</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-gray-50 py-4">
                  <Button
                    className="bg-primary text-white"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold mb-6">Preferências de Notificação</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Canais de Notificação</h3>
                    <div className="space-y-4">
                      {Object.entries(notifications)
                        .filter(([key]) => ['email', 'push', 'sms', 'whatsapp'].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => handleNotificationChange(key as keyof NotificationSettings)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-3 text-sm text-gray-700">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Tipos de Alerta</h3>
                    <div className="space-y-4">
                      {Object.entries(notifications)
                        .filter(([key]) => key.endsWith('Alert'))
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => handleNotificationChange(key as keyof NotificationSettings)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-3 text-sm text-gray-700">
                              {key.replace('Alert', '').split(/(?=[A-Z])/).join(' ')}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold mb-6">Integrações</h2>

                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{integration.name}</h3>
                          {integration.lastSync && (
                            <p className="text-xs text-gray-500">
                              Última sincronização: {new Date(integration.lastSync).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        className={`
                          px-4 py-2 text-sm font-medium rounded-lg
                          ${integration.status === 'connected'
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-blue-600 hover:text-blue-700'
                          }
                        `}
                      >
                        {integration.status === 'connected' ? 'Desconectar' : 'Conectar'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Other tabs content would go here */}
            {activeTab === 'billing' && (
              <Card>
                <CardHeader>
                  <CardTitle>Faturamento</CardTitle>
                  <CardDescription>Gerencie seu plano e métodos de pagamento</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-medium mb-2">Plano Professional</h3>
                    <p className="text-gray-500 mb-6">Seu plano atual com todas as funcionalidades</p>
                    <Button className="bg-primary text-white mb-4">Gerenciar Plano</Button>
                    <p className="text-sm text-gray-500">Próxima cobrança em 15/10/2023</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'advanced' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Avançadas</CardTitle>
                  <CardDescription>Opções avançadas para sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium mb-4">Exportação de Dados</h3>
                      <p className="text-sm text-gray-500 mb-4">Exporte todos os seus dados para backup ou migração</p>
                      <Button variant="outline">Exportar Todos os Dados</Button>
                    </div>

                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium mb-4">API e Webhooks</h3>
                      <p className="text-sm text-gray-500 mb-4">Configure integrações personalizadas via API</p>
                      <div className="flex space-x-3">
                        <Button variant="outline">Gerar Chave API</Button>
                        <Button variant="outline">Configurar Webhooks</Button>
                      </div>
                    </div>

                    <div className="pt-6">
                      <h3 className="text-lg font-medium text-red-600 mb-4">Zona de Perigo</h3>
                      <p className="text-sm text-gray-500 mb-4">Ações irreversíveis para sua conta</p>
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleSave}
                        >
                          Limpar Todos os Dados
                        </Button>
                        <div className="block">
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleSave}
                          >
                            Excluir Conta
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold mb-6">Segurança</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Alterar Senha</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700">Senha Atual</label>
                        <input
                          type="password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Nova Senha</label>
                        <input
                          type="password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Confirmar Nova Senha</label>
                        <input
                          type="password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Atualizar Senha
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Autenticação de Dois Fatores</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Adicione uma camada extra de segurança à sua conta ativando a autenticação de dois fatores.
                    </p>
                    <button className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                      Ativar 2FA
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Sessões Ativas</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Revise e gerencie suas sessões ativas em diferentes dispositivos.
                    </p>
                    <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                      Encerrar Todas as Sessões
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface SettingsNavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function SettingsNavItem({ label, icon, isActive, onClick }: SettingsNavItemProps) {
  return (
    <button
      className={`flex items-center px-3 py-2 rounded-md text-sm ${
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <span className="flex-shrink-0 mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
