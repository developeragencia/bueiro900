"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div>
            <Link href="/" className="flex items-center mb-6">
              <img
                src="/logo/rocket-logo.svg"
                alt="Bueiro Digital logo"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-semibold">Bueiro Digital</span>
            </Link>
            <p className="text-sm text-gray-300">
              A plataforma mais completa para rastreamento e monitoramento de bueiros inteligentes.
            </p>
          </div>

          {/* Links Principais */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Menu Principal</h4>
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-300 hover:text-white transition">Apresentação</Link>
              <Link href="/precos" className="text-gray-300 hover:text-white transition">Preços</Link>
              <Link href="/integracoes" className="text-gray-300 hover:text-white transition">Integrações</Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Entrar na conta</Link>
            </div>
          </div>

          {/* Links Legais */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
            <div className="flex flex-col space-y-3">
              <Link href="/termos-e-condicoes" className="text-gray-300 hover:text-white transition">Termos e Condições</Link>
              <Link href="/politica-de-privacidade" className="text-gray-300 hover:text-white transition">Política de Privacidade</Link>
              <Link href="/politica-de-cookies" className="text-gray-300 hover:text-white transition">Política de Cookies</Link>
            </div>
          </div>

          {/* Contato e Redes Sociais */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Fale Conosco</h4>
            <p className="text-gray-300 mb-6">
              Estamos prontos para te ajudar! Entre em contato pelos canais abaixo.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/5524992281288"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.3547 4.5618C17.3404 2.5475 14.6098 1.44092 11.7149 1.44092C5.7169 1.44092 0.857314 6.30051 0.857314 12.2985C0.857314 14.2374 1.34666 16.1278 2.28281 17.8147L0.776611 23.2842L6.34965 21.8032C7.97519 22.6656 9.82763 23.1165 11.7149 23.1165C17.713 23.1165 22.5726 18.2569 22.5726 12.2589C22.5726 9.36392 21.3689 6.5761 19.3547 4.5618ZM11.7149 21.2629C10.0237 21.2629 8.33256 20.812 6.8384 19.9892L6.48675 19.7857L3.25234 20.6927L4.15944 17.5354L3.91697 17.1441C3.01434 15.6104 2.51056 13.9715 2.51056 12.2985C2.51056 7.22696 6.6434 3.09411 11.7149 3.09411C14.1352 3.09411 16.355 4.036 18.0859 5.80507C19.8168 7.57414 20.9234 9.83567 20.9234 12.2589C20.9234 17.3304 16.7865 21.2629 11.7149 21.2629ZM16.7067 14.6287C16.4563 14.4981 15.0963 13.8302 14.885 13.7372C14.6696 13.6441 14.5133 13.5985 14.3544 13.8488C14.1954 14.0992 13.6628 14.7202 13.5039 14.8792C13.345 15.0381 13.186 15.0611 12.9357 14.9305C12.6853 14.7999 11.7983 14.4981 10.7504 13.5649C9.92324 12.8373 9.37333 11.9578 9.21438 11.7074C9.05543 11.4571 9.19576 11.3157 9.33034 11.1844C9.45062 11.0682 9.59527 10.8834 9.72413 10.7244C9.853 10.5655 9.89862 10.4507 9.9918 10.2918C10.0849 10.1329 10.0393 9.97392 9.97475 9.8413C9.91022 9.70868 9.36324 8.34867 9.15971 7.84795C8.96044 7.3611 8.75403 7.42563 8.58643 7.41777C8.42748 7.40991 8.27139 7.40991 8.1125 7.40991C7.95356 7.40991 7.69676 7.47444 7.48146 7.7248C7.26616 7.97516 6.55255 8.64307 6.55255 10.0031C6.55255 11.3631 7.51094 12.6745 7.6398 12.8334C7.76866 12.9924 9.35944 15.3834 11.7332 16.5908C12.3859 16.8756 12.8957 17.05 13.2935 17.1787C13.9437 17.3855 14.5367 17.3592 15.0042 17.2921C15.5298 17.2183 16.6434 16.6255 16.8469 16.0298C17.0504 15.4341 17.0504 14.9334 16.9859 14.8325C16.9214 14.7316 16.759 14.6671 16.5087 14.5365L16.7067 14.6287Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/bueirodigital"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@bueirodigital"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Linha divisória e copyright */}
        <div className="mt-12 pt-8 border-t border-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Bueiro Digital | Todos os direitos reservados
            </div>
            <div className="text-gray-400 text-sm text-center">
              Desenvolvido por <a href="https://alexdesenvolvedor.com.br" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition">Alex Developer</a>
            </div>
            <div className="flex justify-center md:justify-end">
              <Link href="/register" className="px-6 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-all">
                Testar gratuitamente
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
