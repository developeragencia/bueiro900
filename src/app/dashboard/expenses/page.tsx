"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  recurrent: boolean;
  frequency?: 'monthly' | 'yearly' | 'weekly';
  attachments?: string[];
  notes?: string;
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Assinatura Software CRM',
    amount: 299.90,
    category: 'Software',
    date: '2024-03-15',
    status: 'paid',
    paymentMethod: 'Cartão de Crédito',
    recurrent: true,
    frequency: 'monthly'
  },
  {
    id: '2',
    description: 'Serviço de Email Marketing',
    amount: 150.00,
    category: 'Marketing',
    date: '2024-03-20',
    status: 'pending',
    paymentMethod: 'Boleto',
    recurrent: true,
    frequency: 'monthly'
  },
  {
    id: '3',
    description: 'Manutenção Servidor',
    amount: 500.00,
    category: 'Infraestrutura',
    date: '2024-02-28',
    status: 'overdue',
    paymentMethod: 'PIX',
    recurrent: false
  }
];

const categories = [
  'Software',
  'Marketing',
  'Infraestrutura',
  'Recursos Humanos',
  'Financeiro',
  'Outros'
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Atrasado';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Despesas</h1>
            <p className="text-gray-600 mt-1">
              Total: R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nova Despesa
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar despesas..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="paid">Pagas</option>
            <option value="pending">Pendentes</option>
            <option value="overdue">Atrasadas</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{expense.category}</span>
                    {expense.recurrent && (
                      <span className="text-sm text-blue-600">
                        Recorrente ({expense.frequency})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                    {getStatusText(expense.status)}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Vencimento: {new Date(expense.date).toLocaleDateString()}</span>
                  {expense.paymentMethod && (
                    <>
                      <span>•</span>
                      <span>Método: {expense.paymentMethod}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Excluir</button>
                  {expense.status === 'pending' && (
                    <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                      Marcar como Pago
                    </button>
                  )}
                </div>
              </div>

              {expense.notes && (
                <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p>{expense.notes}</p>
                </div>
              )}

              {expense.attachments && expense.attachments.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {expense.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      className="text-sm text-blue-600 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Anexo {index + 1}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Criação será implementado posteriormente */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Nova Despesa</h2>
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
                Criar Despesa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 