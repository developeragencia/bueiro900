"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, RocketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';

// Schema de validação
const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos e condições'
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stars, setStars] = useState<{ id: string; top: string; left: string; width: string; height: string; opacity: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const register = useAppStore(state => state.register);

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
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      await register(data.name, data.email, data.password);
      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-900 to-indigo-800 text-white relative overflow-hidden">
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
      <div className="absolute bottom-[10%] right-[15%] w-60 h-60 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 opacity-20 blur-md" />

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-8 relative z-10">
        <div className="lg:w-2/5 flex flex-col items-center lg:items-start">
          {/* Animated rocket logo */}
          <div className="relative h-48 w-48 mb-6">
            <div className="flex items-center justify-center h-full w-full relative">
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-blue-500/20 rounded-full ${mounted ? 'animate-pulse' : ''}`} />
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 rounded-full ${mounted ? 'animate-pulse' : ''}`} style={{ animationDelay: '1s' }} />

              <RocketIcon
                className={`text-white h-20 w-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${mounted ? 'animate-float' : ''}`}
              />

              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-14 bg-gradient-to-t from-orange-500 to-transparent rounded-full ${mounted ? 'animate-flame' : ''}`} />
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-center lg:text-left">Bueiro Digital</h1>
          <p className="text-blue-100 mt-3 mb-6 text-center lg:text-left">Crie sua conta e comece a rastrear seus links</p>
        </div>

        <div className="lg:w-3/5 w-full max-w-md">
          <div className="bg-white shadow-xl rounded-2xl p-8 text-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-center">Criar conta</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    {...registerField('name')}
                    className={errors.name ? 'border-red-500' : 'border-gray-300'}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...registerField('email')}
                    className={errors.email ? 'border-red-500' : 'border-gray-300'}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...registerField('password')}
                      className={errors.password ? 'border-red-500' : 'border-gray-300'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirme a senha
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...registerField('confirmPassword')}
                      className={errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Checkbox id="terms" {...registerField('terms')} />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      Aceito os{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        termos e condições
                      </Link>
                    </label>
                    {errors.terms && (
                      <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Faça login
                  </Link>
                </p>
              </div>
            </form>
          </div>
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

          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          @keyframes flame {
            0%, 100% { height: 14px; opacity: 0.8; }
            50% { height: 18px; opacity: 1; }
          }

          .animate-flame {
            animation: flame 0.5s ease-in-out infinite;
          }
        `}</style>
      )}
    </div>
  );
}
