"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, RocketIcon, ArrowLeft, Facebook, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator';

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stars, setStars] = useState<{ id: string; top: string; left: string; width: string; height: string; opacity: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const login = useAppStore(state => state.login);
  const loginWithGoogle = useAppStore(state => state.loginWithGoogle);
  const loginWithFacebook = useAppStore(state => state.loginWithFacebook);

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
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com login com Google
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Login com Google realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao fazer login com Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Função para lidar com login com Facebook
  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);
    try {
      await loginWithFacebook();
      toast.success('Login com Facebook realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao fazer login com Facebook.');
    } finally {
      setIsFacebookLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-900 to-indigo-800 text-white relative overflow-hidden">
      {/* Back to home button */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Button>
        </Link>
      </div>

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
          <p className="text-blue-100 mt-3 mb-6 text-center lg:text-left">A plataforma para rastreamento de UTM's</p>
        </div>

        <div className="lg:w-3/5 w-full max-w-md">
          <div className="bg-white shadow-xl rounded-2xl p-8 text-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-center">Entrar na conta</h2>

            {/* Botões de login com redes sociais */}
            <div className="flex flex-col space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando com Google...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                      <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                      <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                      <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                    </svg>
                    Entrar com Google
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 flex items-center justify-center gap-2 bg-[#1877F2] text-white hover:bg-[#166fe5] border-[#1877F2]"
                onClick={handleFacebookLogin}
                disabled={isFacebookLoading}
              >
                {isFacebookLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando com Facebook...
                  </>
                ) : (
                  <>
                    <Facebook className="h-5 w-5" />
                    Entrar com Facebook
                  </>
                )}
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou continue com</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
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
                      {...register('password')}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id="rememberMe" {...register('rememberMe')} />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                      Lembrar-me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline">
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>Para fins de teste, use:</p>
                <p className="mt-1">Email: <span className="font-mono">joao@bueiro.digital</span></p>
                <p>Senha: <span className="font-mono">password123</span></p>
              </div>
            </div>
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
