"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Megaphone,
  Link2,
  Settings,
  FileText,
  DollarSign,
  PieChart,
  Users,
  Percent,
  Receipt,
  FileBarChart,
  Facebook,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    id: 'resumo',
    label: 'Resumo',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'campanhas',
    label: 'Campanhas',
    icon: Megaphone,
    href: '/dashboard/campaigns',
    badge: 3, // Número de campanhas ativas
  },
  {
    id: 'utms',
    label: 'UTMs',
    icon: Link2,
    href: '/dashboard/utms',
  },
  {
    id: 'integracoes',
    label: 'Integrações',
    icon: Settings,
    href: '/dashboard/integrations',
  },
  {
    id: 'regras',
    label: 'Regras',
    icon: FileText,
    href: '/dashboard/rules',
  },
  {
    id: 'taxas',
    label: 'Taxas',
    icon: Percent,
    href: '/dashboard/fees',
  },
  {
    id: 'despesas',
    label: 'Despesas',
    icon: DollarSign,
    href: '/dashboard/expenses',
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: FileBarChart,
    href: '/dashboard/reports',
  },
  {
    id: 'facebook',
    label: 'Business Manager',
    icon: Facebook,
    href: '/dashboard/facebook-bm',
    badge: 2, // Número de BMs conectadas
  },
];

export default function DashboardMenu() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className="bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
        >
          <span className="sr-only">
            {isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          </span>
          <svg
            className={`w-6 h-6 transition-transform ${
              isCollapsed ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-blue-700' : 'text-gray-400'
                }`}
              />
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 