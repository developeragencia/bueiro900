"use client";

import { useState, useEffect } from 'react';
import { Facebook, Plus, Trash2, RefreshCw, Settings } from 'lucide-react';

interface BusinessManager {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  accessToken?: string;
  adAccounts: number;
  pages: number;
  lastSync?: Date;
}

export default function FacebookBMPage() {
  const [businessManagers, setBusinessManagers] = useState<BusinessManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadBusinessManagers();
  }, []);

  const loadBusinessManagers = async () => {
    try {
      setLoading(true);
      // Aqui você implementaria a chamada real à API do Facebook
      const response = await fetch('/api/facebook/business-managers');
      const data = await response.json();
      setBusinessManagers(data);
    } catch (error) {
      setError('Falha ao carregar Business Managers');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    // Implementar lógica de conexão com Facebook
    window.location.href = '/api/auth/facebook';
  };

  const handleSync = async (bmId: string) => {
    try {
      await fetch(`/api/facebook/business-managers/${bmId}/sync`, {
        method: 'POST',
      });
      await loadBusinessManagers();
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
    }
  };

  const handleRemove = async (bmId: string) => {
    if (!confirm('Tem certeza que deseja remover este Business Manager?')) {
      return;
    }

    try {
      await fetch(`/api/facebook/business-managers/${bmId}`, {
        method: 'DELETE',
      });
      setBusinessManagers(prev => prev.filter(bm => bm.id !== bmId));
    } catch (error) {
      console.error('Erro ao remover:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Facebook Business Manager</h1>
        <button
          onClick={handleConnect}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Business Manager
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessManagers.map((bm) => (
          <div
            key={bm.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Facebook className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">{bm.name}</h3>
                  <span className={`text-sm ${
                    bm.status === 'active' ? 'text-green-600' :
                    bm.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {bm.status === 'active' ? 'Ativo' :
                     bm.status === 'pending' ? 'Pendente' :
                     'Inativo'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSync(bm.id)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Sincronizar"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRemove(bm.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Remover"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Contas de Anúncio</div>
                <div className="text-xl font-semibold text-gray-900">{bm.adAccounts}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Páginas</div>
                <div className="text-xl font-semibold text-gray-900">{bm.pages}</div>
              </div>
            </div>

            {bm.lastSync && (
              <div className="text-xs text-gray-500">
                Última sincronização: {new Date(bm.lastSync).toLocaleString('pt-BR')}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <a
                href={`/dashboard/facebook-bm/${bm.id}/settings`}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Settings className="w-4 h-4 mr-1" />
                Configurações
              </a>
            </div>
          </div>
        ))}
      </div>

      {businessManagers.length === 0 && !error && (
        <div className="text-center py-12">
          <Facebook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum Business Manager conectado
          </h3>
          <p className="text-gray-500 mb-4">
            Conecte seu primeiro Business Manager para começar a gerenciar suas campanhas.
          </p>
          <button
            onClick={handleConnect}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Business Manager
          </button>
        </div>
      )}
    </div>
  );
} 