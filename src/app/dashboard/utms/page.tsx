"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface UTM {
  id: string;
  name: string;
  url: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string;
  utmContent?: string;
  createdAt: string;
  lastUsed?: string;
  clicks: number;
}

const mockUTMs: UTM[] = [
  {
    id: '1',
    name: 'Campanha Facebook',
    url: 'https://exemplo.com/produto',
    utmSource: 'facebook',
    utmMedium: 'social',
    utmCampaign: 'blackfriday2024',
    utmContent: 'banner01',
    createdAt: '2024-03-01',
    lastUsed: '2024-03-15',
    clicks: 1500
  },
  {
    id: '2',
    name: 'Email Marketing',
    url: 'https://exemplo.com/oferta',
    utmSource: 'email',
    utmMedium: 'email',
    utmCampaign: 'newsletter',
    createdAt: '2024-02-15',
    lastUsed: '2024-03-14',
    clicks: 800
  }
];

export default function UTMsPage() {
  const [utms, setUTMs] = useState<UTM[]>(mockUTMs);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUTM, setNewUTM] = useState<Partial<UTM>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredUTMs = utms.filter(utm => 
    utm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    utm.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    utm.utmCampaign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUTM = () => {
    if (!newUTM.name || !newUTM.url || !newUTM.utmSource || !newUTM.utmMedium || !newUTM.utmCampaign) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const utm: UTM = {
      id: Date.now().toString(),
      ...newUTM as UTM,
      createdAt: new Date().toISOString(),
      clicks: 0
    };

    setUTMs([...utms, utm]);
    setShowCreateModal(false);
    setNewUTM({});
  };

  const copyToClipboard = (utm: UTM) => {
    const url = new URL(utm.url);
    url.searchParams.append('utm_source', utm.utmSource);
    url.searchParams.append('utm_medium', utm.utmMedium);
    url.searchParams.append('utm_campaign', utm.utmCampaign);
    if (utm.utmTerm) url.searchParams.append('utm_term', utm.utmTerm);
    if (utm.utmContent) url.searchParams.append('utm_content', utm.utmContent);

    navigator.clipboard.writeText(url.toString());
    setCopiedId(utm.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">UTMs</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar Nova UTM
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar UTMs..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredUTMs.map((utm) => (
            <motion.div
              key={utm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{utm.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{utm.url}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      source: {utm.utmSource}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      medium: {utm.utmMedium}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      campaign: {utm.utmCampaign}
                    </span>
                    {utm.utmTerm && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        term: {utm.utmTerm}
                      </span>
                    )}
                    {utm.utmContent && (
                      <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs">
                        content: {utm.utmContent}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(utm)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    {copiedId === utm.id ? 'Copiado!' : 'Copiar URL'}
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                <span>Cliques: {utm.clicks.toLocaleString()}</span>
                <span>Criado em: {new Date(utm.createdAt).toLocaleDateString()}</span>
                {utm.lastUsed && (
                  <span>Último uso: {new Date(utm.lastUsed).toLocaleDateString()}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Criar Nova UTM</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da UTM
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newUTM.name || ''}
                  onChange={(e) => setNewUTM({ ...newUTM, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newUTM.url || ''}
                  onChange={(e) => setNewUTM({ ...newUTM, url: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fonte (utm_source)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newUTM.utmSource || ''}
                  onChange={(e) => setNewUTM({ ...newUTM, utmSource: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meio (utm_medium)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newUTM.utmMedium || ''}
                  onChange={(e) => setNewUTM({ ...newUTM, utmMedium: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campanha (utm_campaign)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newUTM.utmCampaign || ''}
                  onChange={(e) => setNewUTM({ ...newUTM, utmCampaign: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termo (utm_term) - Opcional
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newUTM.utmTerm || ''}
                  onChange={(e) => setNewUTM({ ...newUTM, utmTerm: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo (utm_content) - Opcional
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newUTM.utmContent || ''}
                  onChange={(e) => setNewUTM({ ...newUTM, utmContent: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUTM}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Criar UTM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 