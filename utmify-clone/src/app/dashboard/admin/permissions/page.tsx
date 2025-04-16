"use client";

import { useState } from 'react';
import { PermissionGuard } from '@/components/permission-guard';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Shield,
  PlusCircle,
  CheckCircle,
  CheckSquare,
  X,
  Edit,
  Save,
  Lock,
  Users,
  BarChart,
  FileText,
  Settings,
  RefreshCw,
  Globe
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Definição dos grupos de permissões
const permissionGroups = [
  {
    id: 'usuarios',
    name: 'Usuários',
    icon: <Users className="h-5 w-5 text-blue-600" />,
    permissions: [
      { id: 'gerenciar_usuarios', name: 'Gerenciar usuários', description: 'Criar, editar e excluir usuários' },
      { id: 'ver_usuarios', name: 'Visualizar usuários', description: 'Ver lista de usuários' },
    ]
  },
  {
    id: 'campanhas',
    name: 'Campanhas',
    icon: <BarChart className="h-5 w-5 text-indigo-600" />,
    permissions: [
      { id: 'gerenciar_campanhas', name: 'Gerenciar campanhas', description: 'Criar, editar e excluir campanhas' },
      { id: 'ver_campanhas', name: 'Visualizar campanhas', description: 'Ver campanhas existentes' },
    ]
  },
  {
    id: 'relatorios',
    name: 'Relatórios',
    icon: <FileText className="h-5 w-5 text-green-600" />,
    permissions: [
      { id: 'ver_relatorios', name: 'Visualizar relatórios', description: 'Acesso aos relatórios do sistema' },
      { id: 'exportar_dados', name: 'Exportar dados', description: 'Exportar dados para CSV/Excel' },
    ]
  },
  {
    id: 'configuracoes',
    name: 'Configurações',
    icon: <Settings className="h-5 w-5 text-gray-600" />,
    permissions: [
      { id: 'gerenciar_configuracoes', name: 'Gerenciar configurações', description: 'Alterar configurações do sistema' },
      { id: 'gerenciar_integrações', name: 'Gerenciar integrações', description: 'Configurar integrações com plataformas' },
    ]
  },
  {
    id: 'admin',
    name: 'Administração',
    icon: <Lock className="h-5 w-5 text-amber-600" />,
    permissions: [
      { id: 'gerenciar_permissoes', name: 'Gerenciar permissões', description: 'Configurar perfis e permissões' },
      { id: 'acessar_admin', name: 'Acessar painel admin', description: 'Acesso ao painel administrativo' },
    ]
  },
];

// Definição dos perfis e suas permissões
const initialRoles = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso completo a todas as funcionalidades',
    permissions: [
      'gerenciar_usuarios',
      'ver_usuarios',
      'gerenciar_campanhas',
      'ver_campanhas',
      'ver_relatorios',
      'exportar_dados',
      'gerenciar_configuracoes',
      'gerenciar_integrações',
      'gerenciar_permissoes',
      'acessar_admin'
    ],
    editable: false
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Pode editar campanhas e visualizar relatórios',
    permissions: [
      'ver_usuarios',
      'gerenciar_campanhas',
      'ver_campanhas',
      'ver_relatorios',
      'exportar_dados'
    ],
    editable: true
  },
  {
    id: 'viewer',
    name: 'Visualizador',
    description: 'Acesso somente para visualização',
    permissions: [
      'ver_campanhas',
      'ver_relatorios'
    ],
    editable: true
  },
];

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  editable: boolean;
}

export default function AdminPermissionsPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRoles[0]);
  const [editMode, setEditMode] = useState(false);
  const [editedRole, setEditedRole] = useState<Role | null>(null);

  // Estado para o modal de criação de novo perfil
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState<Role>({
    id: '',
    name: '',
    description: '',
    permissions: [],
    editable: true
  });

  // Manipular seleção de perfil
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEditMode(false);
  };

  // Entrar no modo de edição
  const handleEditMode = () => {
    setEditedRole({...selectedRole});
    setEditMode(true);
  };

  // Salvar alterações
  const handleSaveChanges = () => {
    if (!editedRole) return;

    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.id === editedRole.id ? editedRole : role
      )
    );

    setSelectedRole(editedRole);
    setEditMode(false);
    setEditedRole(null);
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedRole(null);
  };

  // Alternar permissão
  const handleTogglePermission = (permissionId: string) => {
    if (!editMode || !editedRole) return;

    const hasPermission = editedRole.permissions.includes(permissionId);

    if (hasPermission) {
      setEditedRole({
        ...editedRole,
        permissions: editedRole.permissions.filter(id => id !== permissionId)
      });
    } else {
      setEditedRole({
        ...editedRole,
        permissions: [...editedRole.permissions, permissionId]
      });
    }
  };

  // Manipular novo perfil
  const handleNewRoleChange = (field: string, value: string) => {
    setNewRole({...newRole, [field]: value});
  };

  // Toggle permission in new role
  const handleToggleNewRolePermission = (permissionId: string) => {
    const hasPermission = newRole.permissions.includes(permissionId);

    if (hasPermission) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter(id => id !== permissionId)
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permissionId]
      });
    }
  };

  // Criar novo perfil
  const handleCreateRole = () => {
    if (!newRole.name || !newRole.id) return;

    // Adicionar novo perfil
    setRoles([...roles, newRole]);

    // Limpar e fechar modal
    setNewRole({
      id: '',
      name: '',
      description: '',
      permissions: [],
      editable: true
    });

    setIsAddRoleOpen(false);
  };

  // Verificar se tem uma permissão
  const hasPermission = (role: Role, permissionId: string) => {
    return role.permissions.includes(permissionId);
  };

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="gerenciar_permissoes">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Shield className="mr-2 h-6 w-6 text-primary" />
                Perfis e Permissões
              </h1>
              <p className="text-gray-500 mt-1">
                Configure perfis de acesso e permissões do sistema
              </p>
            </div>
            <div>
              <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Perfil
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Perfil</DialogTitle>
                    <DialogDescription>
                      Configure um novo perfil de acesso com permissões específicas
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="role-name" className="text-sm font-medium text-gray-700">
                          Nome do Perfil
                        </label>
                        <Input
                          id="role-name"
                          placeholder="Ex: Gerente de Marketing"
                          value={newRole.name}
                          onChange={(e) => handleNewRoleChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="role-id" className="text-sm font-medium text-gray-700">
                          Identificador
                        </label>
                        <Input
                          id="role-id"
                          placeholder="Ex: marketing_manager"
                          value={newRole.id}
                          onChange={(e) => handleNewRoleChange('id', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="role-description" className="text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <Input
                        id="role-description"
                        placeholder="Descrição do perfil e suas responsabilidades"
                        value={newRole.description}
                        onChange={(e) => handleNewRoleChange('description', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Permissões
                      </label>
                      <div className="border rounded-md overflow-hidden">
                        {permissionGroups.map(group => (
                          <div key={group.id} className="border-b last:border-b-0">
                            <div className="flex items-center bg-gray-50 px-4 py-2">
                              {group.icon}
                              <span className="ml-2 font-medium">{group.name}</span>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {group.permissions.map(permission => (
                                <div
                                  key={permission.id}
                                  className="flex items-start"
                                  onClick={() => handleToggleNewRolePermission(permission.id)}
                                >
                                  <div className={`flex-shrink-0 h-5 w-5 rounded border text-white flex items-center justify-center ${
                                    hasPermission(newRole, permission.id)
                                      ? 'bg-primary border-primary'
                                      : 'border-gray-300'
                                  }`}>
                                    {hasPermission(newRole, permission.id) && <CheckCircle className="h-4 w-4" />}
                                  </div>
                                  <div className="ml-3 cursor-pointer">
                                    <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                                    <div className="text-xs text-gray-500">{permission.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateRole}
                      disabled={!newRole.name || !newRole.id}
                    >
                      Criar Perfil
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lista de Perfis */}
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Perfis de Acesso</CardTitle>
                  <CardDescription>
                    Selecione um perfil para visualizar ou editar
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {roles.map(role => (
                      <div
                        key={role.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedRole.id === role.id ? 'bg-blue-50' : ''}`}
                        onClick={() => handleRoleSelect(role)}
                      >
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            role.id === 'admin' ? 'bg-amber-100 text-amber-700' :
                            role.id === 'editor' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {role.id === 'admin' && <Lock className="h-4 w-4" />}
                            {role.id === 'editor' && <Edit className="h-4 w-4" />}
                            {role.id === 'viewer' && <CheckSquare className="h-4 w-4" />}
                            {!['admin', 'editor', 'viewer'].includes(role.id) && <Shield className="h-4 w-4" />}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{role.name}</div>
                            <div className="text-xs text-gray-500">{role.permissions.length} permissões</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <p className="text-xs text-gray-500 w-full text-center">
                    {roles.length} perfis configurados
                  </p>
                </CardFooter>
              </Card>
            </div>

            {/* Detalhes do Perfil e Permissões */}
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div>
                    <CardTitle className="flex items-center">
                      {selectedRole.id === 'admin' && <Lock className="h-5 w-5 mr-2 text-amber-600" />}
                      {selectedRole.id === 'editor' && <Edit className="h-5 w-5 mr-2 text-blue-600" />}
                      {selectedRole.id === 'viewer' && <CheckSquare className="h-5 w-5 mr-2 text-gray-600" />}
                      {!['admin', 'editor', 'viewer'].includes(selectedRole.id) && <Shield className="h-5 w-5 mr-2 text-purple-600" />}
                      {selectedRole.name}
                    </CardTitle>
                    <CardDescription>{selectedRole.description}</CardDescription>
                  </div>
                  {selectedRole.editable && (
                    <div>
                      {editMode ? (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                          <Button size="sm" onClick={handleSaveChanges}>
                            <Save className="h-4 w-4 mr-1" />
                            Salvar
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={handleEditMode}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {permissionGroups.map(group => (
                      <div key={group.id} className="border rounded-md overflow-hidden">
                        <div className="flex items-center bg-gray-50 px-4 py-2">
                          {group.icon}
                          <span className="ml-2 font-medium">{group.name}</span>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {group.permissions.map(permission => (
                            <div
                              key={permission.id}
                              className="flex items-start"
                              onClick={() => editMode && handleTogglePermission(permission.id)}
                            >
                              <div className={`flex-shrink-0 h-5 w-5 rounded border text-white flex items-center justify-center ${
                                editMode ? 'cursor-pointer' : ''
                              } ${
                                hasPermission(editMode && editedRole ? editedRole : selectedRole, permission.id)
                                  ? 'bg-primary border-primary'
                                  : 'border-gray-300'
                              }`}>
                                {hasPermission(editMode && editedRole ? editedRole : selectedRole, permission.id) && <CheckCircle className="h-4 w-4" />}
                              </div>
                              <div className={`ml-3 ${editMode ? 'cursor-pointer' : ''}`}>
                                <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                                <div className="text-xs text-gray-500">{permission.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {!editMode && (
                  <CardFooter className="bg-gray-50 border-t">
                    <div className="w-full">
                      <p className="text-sm text-gray-500">
                        Este perfil possui <span className="font-medium">{selectedRole.permissions.length}</span> permissões ativas.
                        {!selectedRole.editable && (
                          <span className="ml-2 text-amber-600">Este é um perfil de sistema e não pode ser editado.</span>
                        )}
                      </p>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
