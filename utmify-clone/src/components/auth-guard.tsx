"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { usePermissions } from './permission-guard';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppStore(state => state.auth);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/', '/login', '/register', '/precos', '/integracoes', '/admin-login'];
    const isPublicRoute = publicRoutes.includes(pathname) || publicRoutes.some(route => pathname.startsWith(`${route}/`));

    // Verificar se está tentando acessar área de administração
    const isAdminRoute = pathname.startsWith('/dashboard/admin');

    if (!isAuthenticated && !isPublicRoute) {
      // Redireciona para o login se não estiver autenticado
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (isAuthenticated && isAdminRoute && user?.role !== 'admin') {
      // Redireciona para o login de admin se não for um administrador
      router.push('/admin-login');
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, pathname, router, user]);

  if (isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-gray-500">Verificando autenticação...</p>
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
