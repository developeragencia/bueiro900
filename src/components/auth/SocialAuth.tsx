'use client';

import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export default function SocialAuth() {
  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signIn('facebook', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Erro ao fazer login com Facebook:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
      >
        <FaGoogle className="w-5 h-5 text-red-500" />
        Continuar com Google
      </Button>

      <Button
        type="button"
        onClick={handleFacebookSignIn}
        className="w-full bg-[#1877F2] text-white hover:bg-[#1865F2] flex items-center justify-center gap-2"
      >
        <FaFacebook className="w-5 h-5" />
        Continuar com Facebook
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>
    </div>
  );
} 