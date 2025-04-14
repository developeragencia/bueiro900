"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Mail,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-18T15:30:00',
    createdAt: '2024-01-01',
    permissions: ['all'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    role: 'editor',
    status: 'active',
    lastLogin: '2024-03-17T10:15:00',
    createdAt: '2024-02-01',
    permissions: ['edit_content', 'view_analytics'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro.santos@exemplo.com',
    role: 'user',
    status: 'pending',
    createdAt: '2024-03-15',
    permissions: ['view_content'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro'
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'blocked':
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-500 mt-1">Gerencie os usuários do sistema</p>
            </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
                    Novo Usuário
          </button>
                    </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                        <select
            className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Todas as funções</option>
                          <option value="admin">Administrador</option>
                          <option value="editor">Editor</option>
            <option value="user">Usuário</option>
                        </select>
                        <select
            className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os status</option>
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                          <option value="pending">Pendente</option>
            <option value="blocked">Bloqueado</option>
                  </select>
                </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                      </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último Acesso
                      </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                      </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                                  src={user.avatar}
                                  alt={user.name}
                                />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' && 'Administrador'}
                            {user.role === 'editor' && 'Editor'}
                        {user.role === 'user' && 'Usuário'}
                          </span>
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        <span className="mr-1">{getStatusIcon(user.status)}</span>
                        {user.status === 'active' && 'Ativo'}
                        {user.status === 'inactive' && 'Inativo'}
                        {user.status === 'pending' && 'Pendente'}
                        {user.status === 'blocked' && 'Bloqueado'}
                          </span>
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : 'Nunca acessou'}
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full"
                          title="Permissões"
                        >
                          <Shield className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full"
                          title="Enviar email"
                        >
                          <Mail className="h-4 w-4 text-gray-500" />
                            </button>
                        <button
                          className="p-1 hover:bg-red-100 rounded-full"
                          title="Excluir"
                          onClick={() => setShowDeleteConfirm(user.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                            </button>

                        {showDeleteConfirm === user.id && (
                          <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                            <p className="text-sm text-gray-600 mb-4">
                              Tem certeza que deseja excluir este usuário?
                            </p>
                            <div className="flex justify-end space-x-2">
                              <button
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                onClick={() => setShowDeleteConfirm(null)}
                              >
                                Cancelar
                            </button>
                              <button
                                className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Excluir
                            </button>
                            </div>
                          </div>
                        )}
                          </div>
                        </td>
                  </motion.tr>
                ))}
                  </tbody>
                </table>
          </div>
        </div>
      </div>

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Novo Usuário</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Função
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="user">Usuário</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Criar Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
