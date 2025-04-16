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
  Smartphone
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';

// Settings tabs
type SettingsTab = 'profile' | 'account' | 'notifications' | 'integrations' | 'billing' | 'advanced';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile form state
  const [profile, setProfile] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    company: 'Bueiro Digital',
    position: 'Administrador',
    bio: 'Administrador de campanhas e especialista em UTM.',
    language: 'pt-BR'
  });

  // Update profile field
  const updateProfile = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  // Saved state for handling actions
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Handler for saving profile changes
  const handleSaveProfile = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Alterações salvas com sucesso!');
    }, 1000);
  };

  // Handler for changing password
  const handlePasswordChange = () => {
    setIsChangingPassword(true);

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      toast.success('Senha alterada com sucesso!');
    }, 1000);
  };

  // Handler for connecting integrations
  const handleConnectIntegration = (name: string) => {
    toast.success(`Conectando à plataforma ${name}...`);
  };

  // Handler for configuring integrations
  const handleConfigureIntegration = (name: string) => {
    toast.success(`Configurando plataforma ${name}...`);
  };

  // Handler for dangerous actions
  const handleDangerAction = (action: string) => {
    // Show confirmation
    if (confirm(`Tem certeza que deseja ${action}? Esta ação não pode ser desfeita.`)) {
      toast.error(`${action} iniciado. Esta ação pode levar algum tempo.`);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-500 mt-1">Gerencie suas preferências e configurações da conta</p>
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
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-name">
                          Nome Completo
                        </label>
                        <Input
                          id="profile-name"
                          value={profile.name}
                          onChange={(e) => updateProfile('name', e.target.value)}
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-email">
                          Email
                        </label>
                        <Input
                          id="profile-email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => updateProfile('email', e.target.value)}
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-phone">
                          Telefone
                        </label>
                        <Input
                          id="profile-phone"
                          value={profile.phone}
                          onChange={(e) => updateProfile('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-company">
                          Empresa
                        </label>
                        <Input
                          id="profile-company"
                          value={profile.company}
                          onChange={(e) => updateProfile('company', e.target.value)}
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-position">
                          Cargo
                        </label>
                        <Input
                          id="profile-position"
                          value={profile.position}
                          onChange={(e) => updateProfile('position', e.target.value)}
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-language">
                          Idioma
                        </label>
                        <select
                          id="profile-language"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={profile.language}
                          onChange={(e) => updateProfile('language', e.target.value)}
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-bio">
                      Biografia
                    </label>
                    <textarea
                      id="profile-bio"
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Foto de Perfil
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <div className="text-gray-500 font-semibold text-xl">
                          {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" className="mb-1">
                          <Image className="h-4 w-4 mr-2" />
                          Alterar Foto
                        </Button>
                        <p className="text-xs text-gray-500">JPG, GIF ou PNG. Máximo 1MB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-gray-50 py-4">
                  <Button
                    className="bg-primary text-white"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </CardFooter>
              </Card>
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
                          onClick={handlePasswordChange}
                          disabled={isChangingPassword}
                        >
                          <KeyRound className="h-4 w-4 mr-2" />
                          {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
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
                    onClick={handleSaveProfile}
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
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>Controle como e quando você recebe notificações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-gray-500" />
                        Notificações por Email
                      </h3>

                      <div className="space-y-4">
                        <NotificationOption
                          title="Relatórios Semanais"
                          description="Receba um resumo semanal das suas campanhas"
                          defaultChecked
                        />
                        <NotificationOption
                          title="Alertas de Campanhas"
                          description="Notificações sobre mudanças nas suas campanhas"
                          defaultChecked
                        />
                        <NotificationOption
                          title="Novas Vendas"
                          description="Seja notificado quando uma nova venda for registrada"
                          defaultChecked
                        />
                        <NotificationOption
                          title="Atualizações do Sistema"
                          description="Informações sobre atualizações e novos recursos"
                          defaultChecked
                        />
                        <NotificationOption
                          title="Dicas e Recomendações"
                          description="Receba dicas para melhorar suas campanhas"
                          defaultChecked={false}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Smartphone className="h-5 w-5 mr-2 text-gray-500" />
                        Notificações no Navegador
                      </h3>

                      <div className="space-y-4">
                        <NotificationOption
                          title="Alertas de Campanhas"
                          description="Notificações sobre mudanças nas suas campanhas"
                          defaultChecked={false}
                        />
                        <NotificationOption
                          title="Novas Vendas"
                          description="Seja notificado quando uma nova venda for registrada"
                          defaultChecked={false}
                        />
                        <NotificationOption
                          title="Metas Atingidas"
                          description="Notificações quando metas forem atingidas"
                          defaultChecked={false}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Frequência de Email</h3>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="freq-realtime"
                            name="email-frequency"
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="freq-realtime" className="ml-2 text-sm text-gray-700">
                            Tempo real
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="freq-daily"
                            name="email-frequency"
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                            defaultChecked
                          />
                          <label htmlFor="freq-daily" className="ml-2 text-sm text-gray-700">
                            Resumo diário
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="freq-weekly"
                            name="email-frequency"
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="freq-weekly" className="ml-2 text-sm text-gray-700">
                            Resumo semanal
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-gray-50 py-4">
                  <Button className="bg-primary text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrações</CardTitle>
                  <CardDescription>Configure e gerencie integrações com outras plataformas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center mr-4">
                          <img src="https://ext.same-assets.com/501614606/3848818458.png" alt="Eduzz" className="h-8 w-8 object-contain" />
                        </div>
                        <div>
                          <h4 className="font-medium">Eduzz</h4>
                          <p className="text-sm text-gray-500">Integrado em 10/03/2023</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleConfigureIntegration('Eduzz')}
                      >
                        Configurar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center mr-4">
                          <img src="https://ext.same-assets.com/501614606/1799828963.png" alt="Kiwify" className="h-8 w-8 object-contain" />
                        </div>
                        <div>
                          <h4 className="font-medium">Kiwify</h4>
                          <p className="text-sm text-gray-500">Integrado em 15/04/2023</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleConfigureIntegration('Kiwify')}
                      >
                        Configurar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center mr-4">
                          <img src="https://ext.same-assets.com/501614606/4125013978.png" alt="Greenn" className="h-8 w-8 object-contain" />
                        </div>
                        <div>
                          <h4 className="font-medium">Greenn</h4>
                          <p className="text-sm text-gray-500">Integrado em 22/06/2023</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleConfigureIntegration('Greenn')}
                      >
                        Configurar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center mr-4">
                          <img src="https://ext.same-assets.com/501614606/2658908938.png" alt="Digistore" className="h-8 w-8 object-contain" />
                        </div>
                        <div>
                          <h4 className="font-medium">Digistore</h4>
                          <p className="text-sm text-gray-500">Não integrado</p>
                        </div>
                      </div>
                      <Button onClick={() => handleConnectIntegration('Digistore')}>
                        Conectar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center mr-4">
                          <img src="https://ext.same-assets.com/501614606/773763580.png" alt="Lastlink" className="h-8 w-8 object-contain" />
                        </div>
                        <div>
                          <h4 className="font-medium">Lastlink</h4>
                          <p className="text-sm text-gray-500">Não integrado</p>
                        </div>
                      </div>
                      <Button onClick={() => handleConnectIntegration('Lastlink')}>
                        Conectar
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Ver Todas as Integrações Disponíveis
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                          onClick={() => handleDangerAction('limpar todos os dados')}
                        >
                          Limpar Todos os Dados
                        </Button>
                        <div className="block">
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleDangerAction('excluir a conta')}
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

interface NotificationOptionProps {
  title: string;
  description: string;
  defaultChecked: boolean;
}

function NotificationOption({ title, description, defaultChecked }: NotificationOptionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          type="checkbox"
          className="sr-only"
          id={`toggle-${title.replace(/\s+/g, '-').toLowerCase()}`}
          defaultChecked={defaultChecked}
        />
        <label
          htmlFor={`toggle-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className={`block h-6 w-11 rounded-full ${defaultChecked ? 'bg-primary' : 'bg-gray-300'} cursor-pointer transition-colors`}
        >
          <span
            className={`block h-4 w-4 mt-1 ml-1 rounded-full bg-white shadow transform transition-transform ${defaultChecked ? 'translate-x-5' : ''}`}
          />
        </label>
      </div>
    </div>
  );
}
