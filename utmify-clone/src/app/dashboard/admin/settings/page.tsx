"use client";

import { useState } from 'react';
import { PermissionGuard } from '@/components/permission-guard';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Save,
  Globe,
  Database,
  Key,
  Mail,
  RefreshCw,
  Download,
  Upload,
  ServerCrash
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // Estado para configurações gerais
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Bueiro Digital',
    siteDescription: 'Plataforma de rastreamento de UTMs',
    companyName: 'Bueiro Digital Tecnologia Ltda',
    companyEmail: 'contato@bueiro.digital',
    supportEmail: 'suporte@bueiro.digital',
    defaultLanguage: 'pt-BR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    timezone: 'America/Sao_Paulo',
  });

  // Estado para configurações de segurança
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    minPasswordLength: '8',
    requirePasswordUppercase: true,
    requirePasswordNumbers: true,
    requirePasswordSymbols: true,
    maxLoginAttempts: '5',
    twoFactorAuth: false,
    passwordExpiryDays: '90',
  });

  // Estado para configurações de email
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.bueiro.digital',
    smtpPort: '587',
    smtpUsername: 'noreply@bueiro.digital',
    smtpPassword: '********',
    emailFromName: 'Bueiro Digital',
    emailFromAddress: 'noreply@bueiro.digital',
    enableSsl: true,
  });

  // Manipular alterações nas configurações gerais
  const handleGeneralChange = (field: string, value: string) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value
    });
  };

  // Manipular alterações nas configurações de segurança
  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value
    });
  };

  // Manipular alterações nas configurações de email
  const handleEmailChange = (field: string, value: string | boolean) => {
    setEmailSettings({
      ...emailSettings,
      [field]: value
    });
  };

  // Função para salvar configurações
  const handleSaveSettings = () => {
    console.log('Salvando configurações...');
    // Aqui seria implementada a lógica para salvar no backend
  };

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="gerenciar_configuracoes">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="mr-2 h-6 w-6 text-primary" />
                Configurações do Sistema
              </h1>
              <p className="text-gray-500 mt-1">
                Configure parâmetros globais do sistema
              </p>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <div className="bg-white rounded-lg p-2 border">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                <TabsTrigger value="general" onClick={() => setActiveTab('general')}>
                  <Globe className="h-4 w-4 mr-2" />
                  <span>Geral</span>
                </TabsTrigger>
                <TabsTrigger value="security" onClick={() => setActiveTab('security')}>
                  <Key className="h-4 w-4 mr-2" />
                  <span>Segurança</span>
                </TabsTrigger>
                <TabsTrigger value="email" onClick={() => setActiveTab('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  <span>E-mail</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" onClick={() => setActiveTab('integrations')}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span>Integrações</span>
                </TabsTrigger>
                <TabsTrigger value="backups" onClick={() => setActiveTab('backups')}>
                  <Database className="h-4 w-4 mr-2" />
                  <span>Backups</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" onClick={() => setActiveTab('advanced')}>
                  <ServerCrash className="h-4 w-4 mr-2" />
                  <span>Avançado</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Configurações Gerais */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure informações básicas do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Site
                        </label>
                        <Input
                          id="siteName"
                          value={generalSettings.siteName}
                          onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição do Site
                        </label>
                        <Input
                          id="siteDescription"
                          value={generalSettings.siteDescription}
                          onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Empresa
                        </label>
                        <Input
                          id="companyName"
                          value={generalSettings.companyName}
                          onChange={(e) => handleGeneralChange('companyName', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Email da Empresa
                        </label>
                        <Input
                          id="companyEmail"
                          type="email"
                          value={generalSettings.companyEmail}
                          onChange={(e) => handleGeneralChange('companyEmail', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Email de Suporte
                        </label>
                        <Input
                          id="supportEmail"
                          type="email"
                          value={generalSettings.supportEmail}
                          onChange={(e) => handleGeneralChange('supportEmail', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                          Idioma Padrão
                        </label>
                        <select
                          id="defaultLanguage"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={generalSettings.defaultLanguage}
                          onChange={(e) => handleGeneralChange('defaultLanguage', e.target.value)}
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es">Español</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                          Formato de Data
                        </label>
                        <select
                          id="dateFormat"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={generalSettings.dateFormat}
                          onChange={(e) => handleGeneralChange('dateFormat', e.target.value)}
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                          Fuso Horário
                        </label>
                        <select
                          id="timezone"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={generalSettings.timezone}
                          onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                        >
                          <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                          <option value="UTC">UTC (GMT+0)</option>
                          <option value="America/New_York">America/New_York (GMT-5)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 border-t bg-gray-50 p-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Configurações de Segurança */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Defina políticas de senha e configurações de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="minPasswordLength" className="block text-sm font-medium text-gray-700 mb-1">
                          Comprimento Mínimo da Senha
                        </label>
                        <Input
                          id="minPasswordLength"
                          type="number"
                          min="6"
                          max="20"
                          value={securitySettings.minPasswordLength}
                          onChange={(e) => handleSecurityChange('minPasswordLength', e.target.value)}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          id="requirePasswordUppercase"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={securitySettings.requirePasswordUppercase as boolean}
                          onChange={(e) => handleSecurityChange('requirePasswordUppercase', e.target.checked)}
                        />
                        <label htmlFor="requirePasswordUppercase" className="text-sm font-medium text-gray-700">
                          Exigir letras maiúsculas
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          id="requirePasswordNumbers"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={securitySettings.requirePasswordNumbers as boolean}
                          onChange={(e) => handleSecurityChange('requirePasswordNumbers', e.target.checked)}
                        />
                        <label htmlFor="requirePasswordNumbers" className="text-sm font-medium text-gray-700">
                          Exigir números
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          id="requirePasswordSymbols"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={securitySettings.requirePasswordSymbols as boolean}
                          onChange={(e) => handleSecurityChange('requirePasswordSymbols', e.target.checked)}
                        />
                        <label htmlFor="requirePasswordSymbols" className="text-sm font-medium text-gray-700">
                          Exigir símbolos especiais
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                          Tempo Limite da Sessão (minutos)
                        </label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          min="5"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                          Máximo de Tentativas de Login
                        </label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          min="3"
                          max="10"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => handleSecurityChange('maxLoginAttempts', e.target.value)}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          id="twoFactorAuth"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={securitySettings.twoFactorAuth as boolean}
                          onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                        />
                        <label htmlFor="twoFactorAuth" className="text-sm font-medium text-gray-700">
                          Habilitar autenticação de dois fatores
                        </label>
                      </div>

                      <div>
                        <label htmlFor="passwordExpiryDays" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiração de Senha (dias)
                        </label>
                        <Input
                          id="passwordExpiryDays"
                          type="number"
                          min="0"
                          max="365"
                          value={securitySettings.passwordExpiryDays}
                          onChange={(e) => handleSecurityChange('passwordExpiryDays', e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Use 0 para nunca expirar</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 border-t bg-gray-50 p-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Configurações de Email */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Email</CardTitle>
                  <CardDescription>
                    Configure o servidor de email para envio de notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700 mb-1">
                          Servidor SMTP
                        </label>
                        <Input
                          id="smtpServer"
                          value={emailSettings.smtpServer}
                          onChange={(e) => handleEmailChange('smtpServer', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                          Porta SMTP
                        </label>
                        <Input
                          id="smtpPort"
                          type="number"
                          value={emailSettings.smtpPort}
                          onChange={(e) => handleEmailChange('smtpPort', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700 mb-1">
                          Usuário SMTP
                        </label>
                        <Input
                          id="smtpUsername"
                          value={emailSettings.smtpUsername}
                          onChange={(e) => handleEmailChange('smtpUsername', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Senha SMTP
                        </label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={emailSettings.smtpPassword}
                          onChange={(e) => handleEmailChange('smtpPassword', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="emailFromName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Remetente
                        </label>
                        <Input
                          id="emailFromName"
                          value={emailSettings.emailFromName}
                          onChange={(e) => handleEmailChange('emailFromName', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="emailFromAddress" className="block text-sm font-medium text-gray-700 mb-1">
                          Email do Remetente
                        </label>
                        <Input
                          id="emailFromAddress"
                          type="email"
                          value={emailSettings.emailFromAddress}
                          onChange={(e) => handleEmailChange('emailFromAddress', e.target.value)}
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-4">
                        <input
                          id="enableSsl"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={emailSettings.enableSsl as boolean}
                          onChange={(e) => handleEmailChange('enableSsl', e.target.checked)}
                        />
                        <label htmlFor="enableSsl" className="text-sm font-medium text-gray-700">
                          Habilitar SSL/TLS
                        </label>
                      </div>

                      <div className="pt-4">
                        <Button variant="outline" className="w-full">
                          Enviar Email de Teste
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 border-t bg-gray-50 p-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Backups */}
            <TabsContent value="backups">
              <Card>
                <CardHeader>
                  <CardTitle>Backups e Exportação</CardTitle>
                  <CardDescription>
                    Gerenciar backups do sistema e exportação de dados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Backup Completo do Sistema</h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Crie um backup completo do sistema, incluindo banco de dados, arquivos e configurações.
                        Recomendamos fazer backups regularmente.
                      </p>
                      <div className="flex space-x-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Database className="mr-2 h-4 w-4" />
                          Criar Backup Agora
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Último Backup
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Backups Automáticos</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Configure backups automáticos para seu sistema.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                            Frequência de Backup
                          </label>
                          <select
                            id="backupFrequency"
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="daily">Diário</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="retentionPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                            Período de Retenção
                          </label>
                          <select
                            id="retentionPeriod"
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="7">7 dias</option>
                            <option value="30">30 dias</option>
                            <option value="90">90 dias</option>
                            <option value="365">1 ano</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Exportação de Dados</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Exporte dados específicos do sistema em vários formatos.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline">
                          Exportar Usuários (CSV)
                        </Button>
                        <Button variant="outline">
                          Exportar Campanhas (CSV)
                        </Button>
                        <Button variant="outline">
                          Exportar Vendas (CSV)
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Restaurar Backup</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Restaure o sistema a partir de um backup anterior.
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Input type="file" />
                        </div>
                        <Button variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Restaurar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 border-t bg-gray-50 p-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
