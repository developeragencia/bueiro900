"use client";

import { useState, useEffect } from 'react';
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
  ChevronDown,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { usePermissions } from './permission-guard';
import { useAppStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { hasPermission } = usePermissions();
  const { user, logout } = useAppStore(state => state.auth);
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<number>(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    // Simula busca de notificações não lidas
    const fetchNotifications = async () => {
      try {
        // Simulando chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications(Math.floor(Math.random() * 5));
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 300000); // A cada 5 minutos

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      // Simulando chamada de logout na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      logout();
      toast.success('Logout realizado com sucesso');
      router.push('/');
    } catch (error) {
      toast.error('Erro ao fazer logout. Tente novamente.');
    }
  };

  const handleSync = async () => {
    try {
      toast.loading('Sincronizando dados...');
      // Simulando sincronização
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastSyncTime(new Date());
      toast.success('Dados sincronizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao sincronizar dados');
    }
  };

  const handleSearch = (query: string) => {
    if (query.length >= 3) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                className="mr-2 lg:hidden p-2 rounded-md hover:bg-accent"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                {mobileSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                <Menu className="h-5 w-5" />
                )}
              </button>
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/logo/rocket-logo.svg"
                  alt="Bueiro Digital"
                  width={32}
                  height={32}
                  className="dark:invert"
                />
                <span className="ml-2 text-xl font-bold">Bueiro Digital</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Botão de Sincronização */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSync}
                className="relative"
                title={lastSyncTime ? `Última sincronização: ${lastSyncTime.toLocaleString()}` : 'Sincronizar dados'}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>

              {/* Pesquisa Global */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="relative"
                >
                  <Search className="h-5 w-5" />
                </Button>
                {searchOpen && (
                  <div className="absolute right-0 mt-2 w-96 p-4 bg-popover rounded-lg shadow-lg border">
                    <Input
                      placeholder="Pesquisar..."
                      className="w-full"
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Notificações */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard/notifications')}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Menu do Usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Tema</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Claro</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Escuro</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Monitor className="mr-2 h-4 w-4" />
                            <span>Sistema</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {hasPermission('acessar_admin') && (
                    <DropdownMenuItem onClick={() => router.push('/dashboard/admin')}>
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      <span>Administração</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
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
            onClick={() => setMobileSidebarOpen(false)}
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
