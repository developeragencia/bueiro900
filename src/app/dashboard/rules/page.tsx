"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings2,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Check,
  X,
  ChevronDown,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

interface Rule {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'automation' | 'notification' | 'integration';
  condition: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

const mockRules: Rule[] = [
  {
    id: '1',
    name: 'Bloqueio de Acesso Suspeito',
    description: 'Bloqueia automaticamente tentativas de acesso suspeitas',
    type: 'security',
    condition: 'login_attempts > 5 && time_window < 5_minutes',
    action: 'block_ip && notify_admin',
    priority: 'high',
    status: 'active',
    lastTriggered: '2024-03-18T14:30:00',
    createdAt: '2024-02-01T10:00:00',
    updatedAt: '2024-03-15T08:45:00'
  },
  {
    id: '2',
    name: 'Notificação de Novo Cliente',
    description: 'Envia notificação quando um novo cliente é registrado',
    type: 'notification',
    condition: 'new_customer_registered',
    action: 'send_welcome_email && create_onboarding_task',
    priority: 'medium',
    status: 'active',
    lastTriggered: '2024-03-17T09:15:00',
    createdAt: '2024-02-15T14:20:00',
    updatedAt: '2024-03-10T11:30:00'
  },
  {
    id: '3',
    name: 'Sincronização com CRM',
    description: 'Sincroniza dados de clientes com o sistema CRM',
    type: 'integration',
    condition: 'customer_data_updated || new_customer_registered',
    action: 'sync_with_crm',
    priority: 'low',
    status: 'error',
    lastTriggered: '2024-03-16T16:45:00',
    createdAt: '2024-01-20T09:00:00',
    updatedAt: '2024-03-16T16:45:00'
  }
];

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    name: '',
    description: '',
    type: 'automation',
    condition: '',
    action: '',
    priority: 'medium',
    status: 'inactive'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleToggleStatus = async (ruleId: string) => {
    try {
      const updatedRules = rules.map(rule => {
        if (rule.id === ruleId) {
          const newStatus: Rule['status'] = rule.status === 'active' ? 'inactive' : 'active';
          return {
            ...rule,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return rule;
      });
      setRules(updatedRules);
      toast.success('Status da regra atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar status da regra');
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      const updatedRules = rules.filter(rule => rule.id !== ruleId);
      setRules(updatedRules);
      toast.success('Regra excluída com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir regra');
    }
  };

  const handleRetryRule = async (ruleId: string) => {
    try {
      const updatedRules = rules.map(rule => {
        if (rule.id === ruleId && rule.status === 'error') {
          return {
            ...rule,
            status: 'active',
            updatedAt: new Date().toISOString()
          };
        }
        return rule;
      });
      setRules(updatedRules);
      toast.success('Regra reativada com sucesso');
    } catch (error) {
      toast.error('Erro ao reativar regra');
    }
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || rule.type === filterType;
    const matchesStatus = filterStatus === 'all' || rule.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
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
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newRule.name?.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }

    if (!newRule.description?.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    }

    if (!newRule.condition?.trim()) {
      newErrors.condition = 'A condição é obrigatória';
    }

    if (!newRule.action?.trim()) {
      newErrors.action = 'A ação é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRule = async () => {
    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const newRuleData: Rule = {
        id: (rules.length + 1).toString(),
        name: newRule.name!,
        description: newRule.description!,
        type: newRule.type as Rule['type'],
        condition: newRule.condition!,
        action: newRule.action!,
        priority: newRule.priority as Rule['priority'],
        status: newRule.status as 'active' | 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setRules(prevRules => [...prevRules, newRuleData]);
      setShowCreateModal(false);
      setNewRule({
        name: '',
        description: '',
        type: 'automation',
        condition: '',
        action: '',
        priority: 'medium',
        status: 'inactive'
      });
      toast.success('Regra criada com sucesso');
    } catch (error) {
      toast.error('Erro ao criar regra');
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Regras de Automação</h1>
            <p className="text-gray-500">Gerencie as regras e automações do sistema</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtre as regras por tipo, status ou pesquise pelo nome
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Buscar regras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-96"
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="security">Segurança</SelectItem>
                  <SelectItem value="automation">Automação</SelectItem>
                  <SelectItem value="notification">Notificação</SelectItem>
                  <SelectItem value="integration">Integração</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regras Configuradas</CardTitle>
            <CardDescription>
              Lista de todas as regras e automações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Execução</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-gray-500">{rule.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(rule.priority)}>
                          {rule.priority.charAt(0).toUpperCase() + rule.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(rule.status)}>
                          {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {rule.lastTriggered
                          ? new Date(rule.lastTriggered).toLocaleString('pt-BR')
                          : 'Nunca executada'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(rule.id)}
                          >
                            {rule.status === 'active' ? (
                              <PauseCircle className="h-4 w-4" />
                            ) : (
                              <PlayCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* Implementar edição */}}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {rule.status === 'error' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRetryRule(rule.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de criação */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Nova Regra</CardTitle>
                <CardDescription>
                  Configure uma nova regra de automação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <Input
                      placeholder="Nome da regra"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <Input
                      placeholder="Descrição da regra"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <Select
                      value={newRule.type}
                      onValueChange={(value) => setNewRule({ ...newRule, type: value as Rule['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="security">Segurança</SelectItem>
                        <SelectItem value="automation">Automação</SelectItem>
                        <SelectItem value="notification">Notificação</SelectItem>
                        <SelectItem value="integration">Integração</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condição</label>
                    <Input
                      placeholder="Ex: login_attempts > 5"
                      value={newRule.condition}
                      onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                      className={errors.condition ? 'border-red-500' : ''}
                    />
                    {errors.condition && (
                      <p className="text-sm text-red-500 mt-1">{errors.condition}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Use expressões lógicas para definir quando a regra será acionada
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
                    <Input
                      placeholder="Ex: block_ip && notify_admin"
                      value={newRule.action}
                      onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                      className={errors.action ? 'border-red-500' : ''}
                    />
                    {errors.action && (
                      <p className="text-sm text-red-500 mt-1">{errors.action}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Defina as ações que serão executadas quando a condição for atendida
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                    <Select
                      value={newRule.priority}
                      onValueChange={(value) => setNewRule({ ...newRule, priority: value as Rule['priority'] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Inicial</label>
                    <Select
                      value={newRule.status}
                      onValueChange={(value) => setNewRule({ ...newRule, status: value as Rule['status'] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setErrors({});
                    setNewRule({
                      name: '',
                      description: '',
                      type: 'automation',
                      condition: '',
                      action: '',
                      priority: 'medium',
                      status: 'inactive'
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateRule}>
                  Criar Regra
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 