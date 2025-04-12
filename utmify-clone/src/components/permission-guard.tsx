"use client";

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Permission =
  | 'gerenciar_usuarios'
  | 'gerenciar_campanhas'
  | 'gerenciar_integrações'
  | 'gerenciar_configuracoes'
  | 'ver_relatorios'
  | 'exportar_dados'
  | 'gerenciar_permissoes'
  | 'acessar_admin';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: Permission | Permission[];
  fallback?: ReactNode;
}

const rolePermissionsMap = {
  'admin': [
    'gerenciar_usuarios',
    'gerenciar_campanhas',
    'gerenciar_integrações',
    'gerenciar_configuracoes',
    'ver_relatorios',
    'exportar_dados',
    'gerenciar_permissoes',
    'acessar_admin'
  ],
  'editor': [
    'gerenciar_campanhas',
    'ver_relatorios',
    'exportar_dados'
  ],
  'viewer': [
    'ver_relatorios'
  ]
};

export function PermissionGuard({
  children,
  requiredPermissions,
  fallback
}: PermissionGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const router = useRouter();

  const { user, isAuthenticated } = useAppStore(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsChecking(false);
      setHasPermission(false);
      return;
    }

    // Convertemos para array para facilitar a verificação
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // Obtém as permissões baseadas no perfil do usuário
    const userPermissions = rolePermissionsMap[user.role] || [];

    // Verifica se o usuário tem todas as permissões requeridas
    const userHasAllPermissions = permissions.every(
      permission => userPermissions.includes(permission)
    );

    setHasPermission(userHasAllPermissions);
    setIsChecking(false);
  }, [isAuthenticated, user, requiredPermissions]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-500">Verificando permissões...</span>
      </div>
    );
  }

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <ShieldAlert className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Você não tem permissão para acessar esta funcionalidade.
          Entre em contato com um administrador para solicitar acesso.
        </p>
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-primary text-white"
        >
          Voltar para o Dashboard
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook personalizado para verificação de permissões
export function usePermissions() {
  const { user } = useAppStore(state => state.auth);

  const hasPermission = (requiredPermissions: Permission | Permission[]) => {
    if (!user) return false;

    // Convertemos para array para facilitar a verificação
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // Obtém as permissões baseadas no perfil do usuário
    const userPermissions = rolePermissionsMap[user.role] || [];

    // Verifica se o usuário tem todas as permissões requeridas
    return permissions.every(
      permission => userPermissions.includes(permission)
    );
  };

  return { hasPermission };
}
