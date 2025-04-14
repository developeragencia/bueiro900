"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Settings,
  RefreshCw,
  BarChart2,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

interface BusinessManagerDetails {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  metrics: {
    totalSpent: number;
    activeAds: number;
    reachLastMonth: number;
    clicksLastMonth: number;
  };
  adAccounts: {
    id: string;
    name: string;
    status: string;
    balance: number;
    currency: string;
  }[];
  pages: {
    id: string;
    name: string;
    category: string;
    followers: number;
    likes: number;
  }[];
  alerts: {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    date: Date;
  }[];
}

export default function BusinessManagerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [details, setDetails] = useState<BusinessManagerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/facebook/business-managers/${params.id}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          Erro ao carregar detalhes do Business Manager
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/facebook-bm"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{details.name}</h1>
            <span
              className={`text-sm ${
                details.status === 'active'
                  ? 'text-green-600'
                  : details.status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {details.status === 'active'
                ? 'Ativo'
                : details.status === 'pending'
                ? 'Pendente'
                : 'Inativo'}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadDetails}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Atualizar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href={`/dashboard/facebook-bm/${params.id}/settings`}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Gasto</h3>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            R$ {details.metrics.totalSpent.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Anúncios Ativos</h3>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {details.metrics.activeAds}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Alcance (Último Mês)
            </h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {details.metrics.reachLastMonth.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Cliques (Último Mês)
            </h3>
            <BarChart2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {details.metrics.clicksLastMonth.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('adAccounts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'adAccounts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contas de Anúncio
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Páginas
          </button>
        </nav>
      </div>

      {/* Conteúdo das tabs */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Alertas */}
            {details.alerts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Alertas
                </h2>
                <div className="space-y-4">
                  {details.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start space-x-3 p-4 rounded-lg ${
                        alert.type === 'error'
                          ? 'bg-red-50'
                          : alert.type === 'warning'
                          ? 'bg-yellow-50'
                          : 'bg-blue-50'
                      }`}
                    >
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          alert.type === 'error'
                            ? 'text-red-500'
                            : alert.type === 'warning'
                            ? 'text-yellow-500'
                            : 'text-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            alert.type === 'error'
                              ? 'text-red-800'
                              : alert.type === 'warning'
                              ? 'text-yellow-800'
                              : 'text-blue-800'
                          }`}
                        >
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.date).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'adAccounts' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Moeda
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {details.adAccounts.map((account) => (
                    <tr key={account.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {account.name}
                        </div>
                        <div className="text-sm text-gray-500">{account.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            account.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {account.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.balance.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: account.currency,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.pages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {page.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{page.category}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Seguidores</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {page.followers.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Curtidas</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {page.likes.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 