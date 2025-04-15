"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  Loader2,
  Mail,
  Phone,
  UserPlus,
  Shield,
  User
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: User['role'];
  status: User['status'];
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    role: 'admin',
    status: 'active',
    avatar: 'https://github.com/shadcn.png',
    lastLogin: new Date('2024-03-20T10:00:00'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 98888-8888',
    role: 'manager',
    status: 'active',
    lastLogin: new Date('2024-03-19T15:30:00'),
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    phone: '(11) 97777-7777',
    role: 'user',
    status: 'inactive',
    avatar: 'https://github.com/shadcn.png',
    lastLogin: new Date('2024-03-15T08:45:00'),
    createdAt: new Date('2024-02-01')
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<User['status'] | 'all'>('all');
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active'
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newUserData: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...newUser,
        createdAt: new Date(),
      };

      setUsers(prev => [...prev, newUserData]);
      setShowNewUserDialog(false);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active'
      });
      toast.success('Usuário criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar usuário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      setIsLoading(true);
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          const newStatus: User['status'] = user.status === 'active' ? 'inactive' : 'active';
          return { ...user, status: newStatus };
        }
        return user;
      }));
      toast.success('Status do usuário atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar status do usuário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'manager':
        return <UserPlus className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
                <div>
                <Input
                  placeholder="Nome completo"
                  value={newUser.name}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                />
                </div>
                <div>
                <Input
                  placeholder="E-mail"
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                />
                </div>
                <div>
                <Input
                  placeholder="Telefone"
                  value={newUser.phone}
                  onChange={e => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Select
                  value={newUser.role}
                  onValueChange={value => setNewUser(prev => ({ ...prev, role: value as User['role'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={newUser.status}
                  onValueChange={value => setNewUser(prev => ({ ...prev, status: value as User['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewUserDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser} disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Criar Usuário
              </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={value => setRoleFilter(value as User['role'] | 'all')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filtrar por papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os papéis</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={value => setStatusFilter(value as User['status'] | 'all')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y">
          <div className="bg-gray-50 p-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-2">Usuário</div>
              <div className="hidden md:block">Papel</div>
              <div className="hidden md:block">Status</div>
              <div className="hidden md:block">Último Acesso</div>
              <div className="text-right">Ações</div>
            </div>
                      </div>
          <div className="divide-y">
            {filteredUsers.map(user => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center">
                    <Badge variant="secondary" className={getRoleColor(user.role)}>
                      <span className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {user.role === 'admin' ? 'Administrador' :
                         user.role === 'manager' ? 'Gerente' : 'Usuário'}
                        </span>
                    </Badge>
                  </div>
                  <div className="hidden md:flex items-center">
                    <Badge variant="secondary" className={getStatusColor(user.status)}>
                      {user.status === 'active' ? 'Ativo' :
                       user.status === 'inactive' ? 'Inativo' : 'Pendente'}
                    </Badge>
                  </div>
                  <div className="hidden md:block text-sm text-gray-500">
                    {user.lastLogin
                      ? format(user.lastLogin, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                      : 'Nunca acessou'}
                  </div>
                  <div className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user.id)}
                          className="flex items-center gap-2"
                        >
                          {user.status === 'active' ? (
                            <>
                              <XCircle className="h-4 w-4" />
                              <span>Desativar</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Ativar</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
            </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
