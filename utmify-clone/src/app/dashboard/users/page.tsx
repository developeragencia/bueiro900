"use client";

import { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Download,
  UserPlus,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  dateCreated: string;
}

// Sample users data
const USERS: User[] = [
  {
    id: 'usr001',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    role: 'admin',
    status: 'active',
    lastActive: '2023-09-15 13:45:22',
    dateCreated: '2022-05-10 09:30:00'
  },
  {
    id: 'usr002',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    role: 'editor',
    status: 'active',
    lastActive: '2023-09-14 16:23:45',
    dateCreated: '2022-06-15 11:45:00'
  },
  {
    id: 'usr003',
    name: 'Carlos Santos',
    email: 'carlos.santos@email.com',
    role: 'viewer',
    status: 'active',
    lastActive: '2023-09-12 10:15:33',
    dateCreated: '2022-07-23 13:20:00'
  },
  {
    id: 'usr004',
    name: 'Ana Pereira',
    email: 'ana.pereira@email.com',
    role: 'editor',
    status: 'inactive',
    lastActive: '2023-08-30 14:05:12',
    dateCreated: '2022-08-05 15:10:00'
  },
  {
    id: 'usr005',
    name: 'Pedro Souza',
    email: 'pedro.souza@email.com',
    role: 'viewer',
    status: 'pending',
    lastActive: 'Nunca',
    dateCreated: '2023-09-10 08:30:00'
  },
  {
    id: 'usr006',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    role: 'editor',
    status: 'active',
    lastActive: '2023-09-15 09:34:56',
    dateCreated: '2022-10-18 14:25:00'
  },
  {
    id: 'usr007',
    name: 'Ricardo Gomes',
    email: 'ricardo.gomes@email.com',
    role: 'viewer',
    status: 'active',
    lastActive: '2023-09-14 15:42:11',
    dateCreated: '2023-02-07 10:40:00'
  },
];

// Role definitions with permissions
const ROLES = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso completo a todas as funcionalidades',
    permissions: [
      'gerenciar_usuarios',
      'gerenciar_campanhas',
      'gerenciar_integrações',
      'gerenciar_configuracoes',
      'ver_relatorios',
      'exportar_dados'
    ]
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Pode editar campanhas e visualizar relatórios',
    permissions: [
      'gerenciar_campanhas',
      'ver_relatorios',
      'exportar_dados'
    ]
  },
  {
    id: 'viewer',
    name: 'Visualizador',
    description: 'Acesso somente para visualização',
    permissions: [
      'ver_relatorios'
    ]
  },
];

// User stats
const USER_STATS = {
  total: 7,
  active: 5,
  inactive: 1,
  pending: 1,
  admins: 1,
  editors: 3,
  viewers: 3,
  newThisMonth: 2
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = USERS.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Select all visible users
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        {/* Header with action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-500 mt-1">Gerencie os usuários e suas permissões no sistema</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button className="bg-primary text-white flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                  <p className="text-2xl font-bold">{USER_STATS.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Usuários Ativos</p>
                  <p className="text-2xl font-bold">{USER_STATS.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <ShieldAlert className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Administradores</p>
                  <p className="text-2xl font-bold">{USER_STATS.admins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Novos este mês</p>
                  <p className="text-2xl font-bold">{USER_STATS.newThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar usuários..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-[150px]">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Todos Perfis</option>
                  <option value="admin">Administradores</option>
                  <option value="editor">Editores</option>
                  <option value="viewer">Visualizadores</option>
                </select>
              </div>

              <div className="w-full sm:w-[150px]">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos Status</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                  <option value="pending">Pendentes</option>
                </select>
              </div>

              <Button variant="outline" className="flex items-center whitespace-nowrap">
                <Filter className="mr-2 h-4 w-4" />
                Mais Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle>Lista de Usuários</CardTitle>
            <div className="text-sm text-gray-500">
              Mostrando {filteredUsers.length} de {USERS.length} usuários
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Acesso
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : user.role === 'editor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' && 'Administrador'}
                          {user.role === 'editor' && 'Editor'}
                          {user.role === 'viewer' && 'Visualizador'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.status === 'active' && (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativo
                            </>
                          )}
                          {user.status === 'inactive' && (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inativo
                            </>
                          )}
                          {user.status === 'pending' && (
                            <>
                              <Calendar className="h-3 w-3 mr-1" />
                              Pendente
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastActive === 'Nunca'
                          ? 'Nunca'
                          : new Date(user.lastActive).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                        }
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.dateCreated).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button className="text-blue-600 hover:text-blue-900" title="Editar">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="Enviar Email">
                            <Mail className="h-5 w-5" />
                          </button>
                          <button className="text-amber-600 hover:text-amber-900" title="Redefinir Senha">
                            <Lock className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Remover">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                        Nenhum usuário encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3">
            <div className="flex items-center">
              {selectedUsers.length > 0 && (
                <>
                  <span className="text-sm text-gray-700 mr-4">
                    {selectedUsers.length} usuário(s) selecionado(s)
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Enviar Email
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={filteredUsers.length === 0}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-700">
                Página 1 de 1
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={filteredUsers.length === 0}
              >
                Próxima
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Roles and Permissions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Perfis e Permissões</h2>
            <Button variant="outline" onClick={() => setShowRoleInfo(!showRoleInfo)}>
              {showRoleInfo ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
            </Button>
          </div>

          {showRoleInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ROLES.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <CardTitle className={`
                      ${role.id === 'admin' ? 'text-amber-700' : ''}
                      ${role.id === 'editor' ? 'text-blue-700' : ''}
                      ${role.id === 'viewer' ? 'text-gray-700' : ''}
                    `}>
                      {role.name}
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Permissões:</h4>
                    <ul className="space-y-1">
                      {role.permissions.map((permission) => (
                        <li key={permission} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="capitalize">
                            {permission.replace(/_/g, ' ')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <div className="text-sm text-gray-500">
                      Total: {USER_STATS[role.id === 'admin' ? 'admins' : role.id === 'editor' ? 'editors' : 'viewers']} usuário(s)
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
