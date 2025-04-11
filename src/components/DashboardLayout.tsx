"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  LineChart,
  Users,
  Settings,
  HelpCircle,
  Bell,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Home,
  RefreshCw,
  DollarSign,
  TrendingUp,
  CreditCard,
  Share2,
  ActivitySquare,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { usePermissions } from './permission-guard';
import { useAppStore } from '@/lib/store';
import Image from 'next/image'; // Added import for Image

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { hasPermission } = usePermissions();
  const { user } = useAppStore(state => state.auth);

  // Handle notification button click
  const handleNotificationsClick = () => {
    router.push('/dashboard/notifications');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                className="mr-2 lg:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={toggleMobileSidebar}
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/dashboard" className="flex items-center">
                <Image src="/logo/rocket-logo.svg" alt="Bueiro Digital" width={32} height={32} />
                <span className="ml-2 text-xl font-bold text-gray-900">Bueiro Digital</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Global search button */}
              <Link href="/dashboard/search" className="p-2 rounded-md hover:bg-gray-100 transition-colors" title="Pesquisa Global">
                <Search className="h-5 w-5 text-gray-500" />
              </Link>

              {/* Notifications button */}
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={handleNotificationsClick}
              >
                <Bell className="h-5 w-5 text-gray-500" />
              </button>

              {/* User Menu Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="hidden md:flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-1">{user?.name || 'Usuário'}</span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  {hasPermission('acessar_admin') && (
                    <DropdownMenuItem onClick={() => router.push('/dashboard/admin')}>
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      <span>Administração</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile */}
        <div className={`lg:hidden fixed inset-0 z-50 ${mobileSidebarOpen ? 'block' : 'hidden'}`}>
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleMobileSidebar}
          />
          <nav className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg">
            <div className="h-full flex flex-col py-4">
              <div className="px-4 mb-6 flex items-center">
                <img
                  src="/logo/rocket-logo.svg"
                  alt="Bueiro Digital logo"
                  className="h-8 w-8"
                />
                <h2 className="text-lg font-semibold text-gray-900 ml-2">Bueiro Digital</h2>
              </div>
              <ul className="space-y-2 px-2 flex-1">
                <SidebarItem icon={<Home />} label="Dashboard" href="/dashboard" />
                <SidebarItem icon={<BarChart3 />} label="Campanhas" href="/dashboard/campaigns" />
                <SidebarItem icon={<LineChart />} label="Relatórios" href="/dashboard/reports" />
                <SidebarItem icon={<TrendingUp />} label="Performance" href="/dashboard/performance" />
                <SidebarItem icon={<DollarSign />} label="Vendas" href="/dashboard/sales" />
                <SidebarItem icon={<RefreshCw />} label="Integrações" href="/dashboard/integrations" />
                <SidebarItem icon={<Bell />} label="Notificações" href="/dashboard/notifications" />
                <SidebarItem icon={<CreditCard />} label="Assinaturas" href="/dashboard/subscriptions" />
                <SidebarItem icon={<Share2 />} label="Indique e Ganhe" href="/dashboard/referrals" />
                <SidebarItem icon={<HelpCircle />} label="Suporte" href="/dashboard/support" />
                <SidebarItem icon={<ActivitySquare />} label="Status" href="/dashboard/status" />
                <SidebarItem icon={<Users />} label="Usuários" href="/dashboard/users" />
                <SidebarItem icon={<Settings />} label="Configurações" href="/dashboard/settings" />

                {/* Link de Administração (apenas para admins) */}
                {hasPermission('acessar_admin') && (
                  <SidebarItem
                    icon={<ShieldAlert />}
                    label="Administração"
                    href="/dashboard/admin"
                    active={typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard/admin')}
                  />
                )}
              </ul>
              <div className="px-4 mt-6">
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar - Desktop */}
        <div className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-gray-200 bg-white`}>
          <div className="h-full flex flex-col py-4">
            <div className={`px-4 mb-6 ${!sidebarOpen ? 'flex justify-center' : 'flex items-center'}`}>
              <img
                src="/logo/rocket-logo.svg"
                alt="Bueiro Digital logo"
                className="h-8 w-8"
              />
              {sidebarOpen && (
                <h2 className="text-lg font-semibold text-gray-900 ml-2">Bueiro Digital</h2>
              )}
            </div>
            <ul className="space-y-2 px-2 flex-1">
              <SidebarItem icon={<Home />} label="Dashboard" href="/dashboard" collapsed={!sidebarOpen} />
              <SidebarItem icon={<BarChart3 />} label="Campanhas" href="/dashboard/campaigns" collapsed={!sidebarOpen} />
              <SidebarItem icon={<LineChart />} label="Relatórios" href="/dashboard/reports" collapsed={!sidebarOpen} />
              <SidebarItem icon={<TrendingUp />} label="Performance" href="/dashboard/performance" collapsed={!sidebarOpen} />
              <SidebarItem icon={<DollarSign />} label="Vendas" href="/dashboard/sales" collapsed={!sidebarOpen} />
              <SidebarItem icon={<RefreshCw />} label="Integrações" href="/dashboard/integrations" collapsed={!sidebarOpen} />
              <SidebarItem icon={<Bell />} label="Notificações" href="/dashboard/notifications" collapsed={!sidebarOpen} />
              <SidebarItem icon={<CreditCard />} label="Assinaturas" href="/dashboard/subscriptions" collapsed={!sidebarOpen} />
              <SidebarItem icon={<Share2 />} label="Indique e Ganhe" href="/dashboard/referrals" collapsed={!sidebarOpen} />
              <SidebarItem icon={<HelpCircle />} label="Suporte" href="/dashboard/support" collapsed={!sidebarOpen} />
              <SidebarItem icon={<ActivitySquare />} label="Status" href="/dashboard/status" collapsed={!sidebarOpen} />
              <SidebarItem icon={<Users />} label="Usuários" href="/dashboard/users" collapsed={!sidebarOpen} />
              <SidebarItem icon={<Settings />} label="Configurações" href="/dashboard/settings" collapsed={!sidebarOpen} />

              {/* Link de Administração (apenas para admins) */}
              {hasPermission('acessar_admin') && (
                <SidebarItem
                  icon={<ShieldAlert />}
                  label="Administração"
                  href="/dashboard/admin"
                  active={typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard/admin')}
                  collapsed={!sidebarOpen}
                />
              )}
            </ul>
            <div className="px-4 mt-6">
              {sidebarOpen ? (
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              ) : (
                <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, href, active = false, collapsed = false }: {
  icon: React.ReactNode,
  label: string,
  href: string,
  active?: boolean,
  collapsed?: boolean
}) {
  // Determine if this is the active route based on the href
  const isActive = typeof window !== 'undefined' ? window.location.pathname === href ||
    (href !== '/dashboard' && window.location.pathname.startsWith(href)) : false;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center p-2 rounded-lg ${
          isActive || active
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        } ${collapsed ? 'justify-center' : 'justify-start'}`}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && <span className="ml-3">{label}</span>}
      </Link>
    </li>
  );
}
