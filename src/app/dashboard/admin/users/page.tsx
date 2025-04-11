"use client";

import { useState } from 'react';
import { PermissionGuard } from '@/components/permission-guard';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  PlusCircle,
  Filter,
  Trash2,
  Edit,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  CalendarClock,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AdminUsersPage() {
  const { users } = useAppStore(state => ({
    users: state.users
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer',
    status: 'active'
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
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

  // Handle add user form
  const handleAddUserChange = (field: string, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

  // Handle add user submit
  const handleAddUser = async () => {
    // Adicionar usuário à store
    await useAppStore.getState().addUser({
      ...newUser,
      dateCreated: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      status: newUser.status as any
    });

    // Fechar modal e limpar o formulário
    setIsAddUserOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      status: 'active'
    });
  };

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="gerenciar_usuarios">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="mr-2 h-6 w-6 text-primary" />
                Gerenciamento de Usuários
              </h1>
              <p className="text-gray-500 mt-1">
                Adicione, edite e gerencie usuários do sistema
              </p>
            </div>
            <div className="flex space-x-3">
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar um novo usuário no sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="user-name" className="text-sm font-medium text-gray-700">
                        Nome Completo
                      </label>
                      <Input
                        id="user-name"
                        placeholder="Nome do usuário"
                        value={newUser.name}
                        onChange={(e) => handleAddUserChange('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="user-email" className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={newUser.email}
                        onChange={(e) => handleAddUserChange('email', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="user-role" className="text-sm font-medium text-gray-700">
                          Perfil
                        </label>
                        <select
                          id="user-role"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newUser.role}
                          onChange={(e) => handleAddUserChange('role', e.target.value)}
                        >
                          <option value="admin">Administrador</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Visualizador</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="user-status" className="text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="user-status"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newUser.status}
                          onChange={(e) => handleAddUserChange('status', e.target.value)}
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                          <option value="pending">Pendente</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      disabled={!newUser.name || !newUser.email}
                    >
                      Criar Usuário
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros Avançados
              </Button>
            </div>
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
                    placeholder="Buscar usuários por nome ou email..."
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
              </div>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle>Lista de Usuários</CardTitle>
              <div className="text-sm text-gray-500">
                Mostrando {filteredUsers.length} de {users.length} usuários
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
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                              )}
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
                            {user.role === 'admin' && (
                              <>
                                <ShieldAlert className="h-3 w-3 mr-1" />
                                Administrador
                              </>
                            )}
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
                                <CalendarClock className="h-3 w-3 mr-1" />
                                Pendente
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastActive).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.dateCreated).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
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
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
