"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Settings,
  FileText,
  Bell,
  Shield,
  Layout,
  RefreshCw,
  HelpCircle,
  ArrowUpRight,
  UserPlus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface AdminMetrics {
  users: {
    total: number;
    active: number;
    new: number;
  };
  permissions: {
    roles: number;
    pendingRequests: number;
  };
  system: {
    uptime: string;
    lastBackup: string;
    storageUsed: string;
  };
  activity: {
    total: number;
    today: number;
  };
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  message: string;
  timestamp: string;
  resolved?: boolean;
}

const mockMetrics: AdminMetrics = {
  users: {
    total: 1234,
    active: 892,
    new: 45
  },
  permissions: {
    roles: 8,
    pendingRequests: 12
  },
  system: {
    uptime: '99.9%',
    lastBackup: '2024-03-18T14:30:00',
    storageUsed: '45%'
  },
  activity: {
    total: 15678,
    today: 234
  }
};

const mockAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Alto uso de armazenamento detectado',
    timestamp: '2024-03-18T15:30:00'
  },
  {
    id: '2',
    type: 'success',
    message: 'Backup do sistema concluído com sucesso',
    timestamp: '2024-03-18T14:30:00',
    resolved: true
  },
  {
    id: '3',
    type: 'error',
    message: 'Falha na sincronização com serviço externo',
    timestamp: '2024-03-18T13:45:00'
  }
];

const adminMenuItems = [
  {
    title: 'Usuários',
    description: 'Gerenciar usuários e permissões',
    icon: Users,
    href: '/dashboard/admin/users',
    color: 'bg-blue-500'
  },
  {
    title: 'Configurações',
    description: 'Configurações do sistema',
    icon: Settings,
    href: '/dashboard/admin/settings',
    color: 'bg-gray-500'
  },
  {
    title: 'Relatórios',
    description: 'Relatórios administrativos',
    icon: FileText,
    href: '/dashboard/admin/reports',
    color: 'bg-green-500'
  },
  {
    title: 'Notificações',
    description: 'Gerenciar notificações do sistema',
    icon: Bell,
    href: '/dashboard/admin/notifications',
    color: 'bg-yellow-500'
  },
  {
    title: 'Permissões',
    description: 'Controle de acesso e funções',
    icon: Shield,
    href: '/dashboard/admin/permissions',
    color: 'bg-purple-500'
  },
  {
    title: 'Editor do Site',
    description: 'Personalizar interface e conteúdo',
    icon: Layout,
    href: '/dashboard/admin/site-editor',
    color: 'bg-pink-500'
  },
  {
    title: 'Integrações',
    description: 'Gerenciar integrações do sistema',
    icon: RefreshCw,
    href: '/dashboard/admin/integrations',
    color: 'bg-indigo-500'
  },
  {
    title: 'Suporte',
    description: 'Central de ajuda e suporte',
    icon: HelpCircle,
    href: '/dashboard/admin/support',
    color: 'bg-red-500'
  }
];

export default function AdminPage() {
  const [metrics] = useState<AdminMetrics>(mockMetrics);
  const [alerts] = useState<SystemAlert[]>(mockAlerts);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-600 mt-1">Gerencie todos os aspectos do sistema</p>
            </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Usuários</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900">{metrics.users.active}</p>
            <p className="text-sm text-gray-500">
              de {metrics.users.total} registrados
              <span className="text-green-600 ml-2">+{metrics.users.new} novos</span>
            </p>
                    </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Permissões</h3>
            <Shield className="h-5 w-5 text-purple-500" />
                    </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900">{metrics.permissions.roles}</p>
            <p className="text-sm text-gray-500">
              funções ativas
              <span className="text-yellow-600 ml-2">
                {metrics.permissions.pendingRequests} pendentes
              </span>
            </p>
                    </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Sistema</h3>
            <Settings className="h-5 w-5 text-gray-500" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900">{metrics.system.uptime}</p>
            <p className="text-sm text-gray-500">
              uptime
              <span className="text-blue-600 ml-2">{metrics.system.storageUsed} storage</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Atividade</h3>
            <ArrowUpRight className="h-5 w-5 text-green-500" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900">{metrics.activity.today}</p>
            <p className="text-sm text-gray-500">
              ações hoje
              <span className="text-gray-600 ml-2">
                {metrics.activity.total} total
                        </span>
            </p>
                      </div>
        </motion.div>
                </div>

      {/* Menu de Administração */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminMenuItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.href}
              className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg ${item.color} bg-opacity-10`}>
                  <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Alertas do Sistema */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertas do Sistema</h2>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start space-x-4 p-4 rounded-lg ${
                alert.resolved ? 'bg-gray-50' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex-shrink-0">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${alert.resolved ? 'text-gray-500' : 'text-gray-900'}`}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              {!alert.resolved && (
                <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                  Resolver
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
