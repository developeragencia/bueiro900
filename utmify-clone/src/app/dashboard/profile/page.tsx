"use client";

import { useState } from 'react';
import { User, Mail, Phone, Building, MapPin, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAppStore(state => state.auth);
  const updateUser = useAppStore(state => state.updateUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState({
    name: user?.name || 'Usuário',
    email: user?.email || 'usuario@example.com',
    phone: user?.phone || '(11) 98765-4321',
    company: user?.company || 'Minha Empresa',
    address: user?.address || 'Rua Example, 123',
    city: user?.city || 'São Paulo',
    state: user?.state || 'SP',
    zipcode: user?.zipcode || '01234-567',
    bio: user?.bio || 'Profissional especializado em marketing digital e criação de campanhas.',
    emailNotifications: user?.emailNotifications || true,
    smsNotifications: user?.smsNotifications || false,
    twoFactorAuth: user?.twoFactorAuth || false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Update user data in store - only include fields that are in the User interface
      await updateUser(user.id, {
        name: formData.name,
        email: formData.email,
      });

      // Show success notification
      toast.success('Alterações salvas com sucesso!');

      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-500">Visualize e edite suas informações pessoais</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile sidebar */}
          <Card className="h-fit lg:col-span-1">
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.avatar || ''} alt={formData.name} />
                <AvatarFallback className="bg-primary text-white text-xl">{formData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{formData.email}</p>

              <div className="w-full mt-2">
                <Button
                  variant={isEditing ? "outline" : "default"}
                  className="w-full"
                  onClick={toggleEdit}
                >
                  {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
                </Button>

                {isEditing && (
                  <Button
                    className="w-full mt-2"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Separator className="my-6" />

              <div className="w-full space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formData.company}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formData.city}, {formData.state}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Atualize suas informações pessoais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipcode">CEP</Label>
                        <Input
                          id="zipcode"
                          name="zipcode"
                          value={formData.zipcode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="border-t bg-gray-50 flex justify-end">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Gerencie suas configurações de segurança</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Autenticação de Dois Fatores</h3>
                          <p className="text-sm text-gray-500">Adicione uma camada extra de segurança à sua conta</p>
                        </div>
                        <Switch
                          checked={formData.twoFactorAuth}
                          onCheckedChange={(checked) => handleSwitchChange('twoFactorAuth', checked)}
                          disabled={!isEditing}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Alterar Senha</h3>
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Senha Atual</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Digite sua senha atual"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nova Senha</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Digite sua nova senha"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirme sua nova senha"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="border-t bg-gray-50 flex justify-end">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Gerencie suas preferências de notificação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Notificações por E-mail</h3>
                          <p className="text-sm text-gray-500">Receba atualizações por e-mail</p>
                        </div>
                        <Switch
                          checked={formData.emailNotifications}
                          onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                          disabled={!isEditing}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Notificações por SMS</h3>
                          <p className="text-sm text-gray-500">Receba alertas por mensagem de texto</p>
                        </div>
                        <Switch
                          checked={formData.smsNotifications}
                          onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                          disabled={!isEditing}
                        />
                      </div>

                      {formData.emailNotifications && (
                        <>
                          <Separator />

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Configurações Detalhadas</h3>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="marketing-emails" className="flex-1">Emails de Marketing</Label>
                                <Switch
                                  id="marketing-emails"
                                  disabled={!isEditing}
                                  defaultChecked
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="sales-emails" className="flex-1">Notificações de Vendas</Label>
                                <Switch
                                  id="sales-emails"
                                  disabled={!isEditing}
                                  defaultChecked
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="system-emails" className="flex-1">Atualizações do Sistema</Label>
                                <Switch
                                  id="system-emails"
                                  disabled={!isEditing}
                                  defaultChecked
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="border-t bg-gray-50 flex justify-end">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
