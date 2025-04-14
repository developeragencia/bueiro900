"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Fee {
  id: string;
  name: string;
  description: string;
  type: 'fixed' | 'percentage';
  value: number;
  platform: string;
  paymentMethod: string;
  minValue?: number;
  maxValue?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const mockFees: Fee[] = [
  {
    id: '1',
    name: 'Taxa Padrão',
    description: 'Taxa padrão para todas as transações',
    type: 'percentage',
    value: 4.99,
    platform: 'Todas',
    paymentMethod: 'Cartão de Crédito',
    status: 'active',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15'
  },
  {
    id: '2',
    name: 'Taxa PIX',
    description: 'Taxa para pagamentos via PIX',
    type: 'percentage',
    value: 0.99,
    platform: 'Todas',
    paymentMethod: 'PIX',
    status: 'active',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-10'
  },
  {
    id: '3',
    name: 'Taxa Boleto',
    description: 'Taxa fixa para pagamentos via boleto',
    type: 'fixed',
    value: 3.50,
    platform: 'Todas',
    paymentMethod: 'Boleto',
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-05'
  }
];

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>(mockFees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPaymentMethod = filterPaymentMethod === 'all' || fee.paymentMethod === filterPaymentMethod;
    return matchesSearch && matchesPaymentMethod;
  });

  const formatValue = (fee: Fee) => {
    if (fee.type === 'percentage') {
      return `${fee.value}%`;
    } else {
      return `R$ ${fee.value.toFixed(2)}`;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Taxas</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar Nova Taxa
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar taxas..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg"
            value={filterPaymentMethod}
            onChange={(e) => setFilterPaymentMethod(e.target.value)}
          >
            <option value="all">Todos os métodos</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="PIX">PIX</option>
            <option value="Boleto">Boleto</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredFees.map((fee) => (
            <motion.div
              key={fee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{fee.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{fee.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    fee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {fee.status === 'active' ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Valor</h4>
                  <p className="text-lg font-semibold text-gray-900">{formatValue(fee)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Tipo</h4>
                  <p className="text-gray-900">{fee.type === 'percentage' ? 'Percentual' : 'Fixo'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Plataforma</h4>
                  <p className="text-gray-900">{fee.platform}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Método de Pagamento</h4>
                  <p className="text-gray-900">{fee.paymentMethod}</p>
                </div>
              </div>

              {(fee.minValue !== undefined || fee.maxValue !== undefined) && (
                <div className="mb-4 text-sm text-gray-600">
                  {fee.minValue !== undefined && (
                    <span>Valor mínimo: R$ {fee.minValue.toFixed(2)}</span>
                  )}
                  {fee.minValue !== undefined && fee.maxValue !== undefined && (
                    <span className="mx-2">•</span>
                  )}
                  {fee.maxValue !== undefined && (
                    <span>Valor máximo: R$ {fee.maxValue.toFixed(2)}</span>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Criada em: {new Date(fee.createdAt).toLocaleDateString()}</span>
                  <span>Atualizada em: {new Date(fee.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Excluir</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Criação será implementado posteriormente */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Criar Nova Taxa</h2>
            {/* Formulário de criação será implementado posteriormente */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Criar Taxa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 