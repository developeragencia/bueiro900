"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stars, setStars] = useState<{ id: string; top: string; left: string; width: string; height: string; opacity: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const login = useAppStore(state => state.login);
  const { isAuthenticated, user } = useAppStore(state => state.auth);

  // Redirecionar se já estiver autenticado como admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/dashboard/admin');
    }
  }, [isAuthenticated, user, router]);

  // Gerar estrelas para o fundo
  useEffect(() => {
    // Apenas gerar estrelas e ativar animações após a montagem completa no cliente
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: `star-${i}-${Math.random()}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.7 + 0.3
    }));

    setStars(generatedStars);
    setMounted(true);
  }, []);

  // Configurar react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const loggedInUser = await login(data.email, data.password);

      if (loggedInUser.role !== 'admin') {
        toast.error('Acesso negado. Apenas administradores podem acessar esta área.');
        useAppStore.getState().logout();
        setIsLoading(false);
        return;
      }

      toast.success('Login realizado com sucesso!');
      router.push('/dashboard/admin');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated stars in background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star absolute bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.width,
              height: star.height,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Decorative planet shapes */}
      <div className="absolute top-[15%] left-[10%] w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 opacity-20 blur-md" />
      <div className="absolute bottom-[10%] right-[15%] w-60 h-60 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-700 opacity-20 blur-md" />

      <div className="max-w-md w-full relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm shadow-lg p-4 mb-4">
            <ShieldAlert className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Acesso Administrativo</h1>
          <p className="text-lg text-indigo-200 mt-2">Bueiro Digital</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-xl font-semibold mb-6 text-center">Área Restrita</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                Email de Administrador
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bueiro.digital"
                  {...register('email')}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/50 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/50 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Acessar Painel Administrativo'
              )}
            </Button>

            <div className="pt-4 text-center">
              <Link href="/" className="text-sm text-indigo-300 hover:text-white">
                Voltar para página inicial
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-sm text-center text-indigo-300">
          <p>Para acessar como administrador, utilize:</p>
          <p className="font-mono mt-1">Email: admin@bueiro.digital</p>
          <p className="font-mono mt-1">Senha: admin123</p>
        </div>
      </div>

      {/* Custom CSS para animações que só serão aplicadas quando o componente estiver montado */}
      {mounted && (
        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }

          .star {
            animation: twinkle linear infinite;
            animation-duration: calc(5s + (var(--i, 0) * 0.5s));
          }
        `}</style>
      )}
    </div>
  );
}
