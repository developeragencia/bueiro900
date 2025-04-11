"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efeitos de lado cliente
  useEffect(() => {
    // Detectar scroll para mudar o estilo do navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Montar apenas no lado do cliente
    setMounted(true);

    // Configurar o evento de scroll apenas quando componente estiver montado
    window.addEventListener("scroll", handleScroll);

    // Verificar o estado de scroll inicial
    handleScroll();

    // Limpar listener quando componente for desmontado
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-gradient-to-r from-blue-900 to-indigo-800"}`}>
      {/* Desktop Menu */}
      <div className="hidden md:flex h-20 px-6 justify-between items-center max-w-7xl mx-auto">
        <div className="h-full flex items-center">
          <Link className="h-full" href="/">
            <img
              className="h-full object-contain max-h-[50px]"
              src="/logo/rocket-logo.svg"
              alt="Bueiro Digital logo"
              crossOrigin="anonymous"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-1">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
          >
            Apresentação
          </Link>
          <Link
            href="/precos"
            className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
          >
            Preços
          </Link>
          <Link
            href="/integracoes"
            className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
          >
            Integrações
          </Link>
          <Link
            href="/admin-login"
            className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
          >
            Administrador
          </Link>
          <Link
            href="/login"
            className="ml-2 px-4 py-2 text-sm font-medium border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium bg-white text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
          >
            Testar grátis
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="flex md:hidden h-16 px-4 justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-800">
        <div className="h-full flex items-center">
          <Link className="h-full" href="/">
            <img
              className="h-full object-contain max-h-[45px]"
              src="/logo/rocket-logo.svg"
              alt="Bueiro Digital logo"
              crossOrigin="anonymous"
            />
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-white/10 text-white hover:bg-white/20"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay - renderizado no DOM mas escondido com CSS quando não é usado */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${mounted && mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-indigo-800 text-white shadow-xl transform transition-transform duration-300 ${mounted && mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center border-b border-white/20">
            <h2 className="font-semibold text-white">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-white/10"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="p-4 flex flex-col space-y-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Apresentação
            </Link>
            <Link
              href="/precos"
              className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preços
            </Link>
            <Link
              href="/integracoes"
              className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Integrações
            </Link>
            <Link
              href="/admin-login"
              className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Administrador
            </Link>
            <div className="border-t border-white/20 my-2" />
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium border border-white/30 rounded-full hover:bg-white/10 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-white text-blue-800 rounded-full hover:bg-blue-50 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testar grátis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
