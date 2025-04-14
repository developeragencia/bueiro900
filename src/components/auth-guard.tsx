"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Loader2, ShieldAlert } from 'lucide-react';
import { usePermissions } from './permission-guard';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAppStore(state => state.auth);
  const { hasPermission } = usePermissions();

  // Tempo limite de inatividade (30 minutos)
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

  // Atualiza o último momento de atividade
  const updateLastActivity = () => {
    setLastActivity(Date.now());
  };

  // Verifica se o token está expirado
  const checkTokenExpiration = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (tokenData.exp * 1000 < Date.now()) {
          handleSessionExpired();
        }
      } catch (error) {
        handleSessionExpired();
      }
    }
  };

  // Lida com a expiração da sessão
  const handleSessionExpired = () => {
    logout();
    toast.error('Sua sessão expirou. Por favor, faça login novamente.');
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

  useEffect(() => {
    // Monitora atividade do usuário
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Verifica inatividade a cada minuto
    const inactivityInterval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        handleSessionExpired();
      }
    }, 60000);

    // Verifica expiração do token a cada 5 minutos
    const tokenCheckInterval = setInterval(checkTokenExpiration, 300000);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(inactivityInterval);
      clearInterval(tokenCheckInterval);
    };
  }, [lastActivity]);

  useEffect(() => {
    const publicRoutes = ['/', '/login', '/register', '/precos', '/integracoes', '/admin-login'];
    const isPublicRoute = publicRoutes.includes(pathname) || publicRoutes.some(route => pathname.startsWith(`${route}/`));
    const isAdminRoute = pathname.startsWith('/dashboard/admin');
    const isRestrictedRoute = pathname.startsWith('/dashboard/settings') || pathname.startsWith('/dashboard/users');

    const checkAccess = async () => {
      try {
        if (!isAuthenticated && !isPublicRoute) {
          toast.error('Faça login para acessar esta página');
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else if (isAuthenticated) {
          if (isAdminRoute && user?.role !== 'admin') {
            toast.error('Acesso restrito a administradores');
            router.push('/dashboard');
          } else if (isRestrictedRoute && !hasPermission('acessar_configuracoes')) {
            toast.error('Você não tem permissão para acessar esta página');
            router.push('/dashboard');
          } else {
            setIsChecking(false);
          }
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        toast.error('Erro ao verificar permissões de acesso');
        router.push('/dashboard');
      }
    };

    checkAccess();
  }, [isAuthenticated, pathname, router, user, hasPermission]);

  if (isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-gray-600 font-medium">Verificando autenticação...</p>
          <p className="mt-2 text-sm text-gray-500">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center text-center max-w-md p-8">
          <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">
            Esta página requer autenticação. Por favor, faça login para continuar.
          </p>
          <button
            onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

interface WithAuthGuardProps {
  children: React.ReactNode;
}

export function withAuthGuard<T>(Component: React.ComponentType<T>) {
  return function WithAuthGuard(props: T & WithAuthGuardProps) {
    return (
      <AuthGuard>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
