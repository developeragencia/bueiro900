"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Sale {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  createdAt: string;
  updatedAt: string;
}

interface SalesMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  totalOrders: number;
  ordersGrowth: number;
  conversionRate: number;
}

const mockSales: Sale[] = [
  {
    id: '1',
    customer: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
    },
    products: [
      {
        id: 'prod1',
        name: 'Produto Premium',
        quantity: 2,
        price: 299.99
      }
    ],
    total: 599.98,
    status: 'completed',
    paymentMethod: 'credit_card',
    createdAt: '2024-03-18T10:30:00',
    updatedAt: '2024-03-18T10:30:00'
  },
  {
    id: '2',
    customer: {
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
    },
    products: [
      {
        id: 'prod2',
        name: 'Serviço Básico',
        quantity: 1,
        price: 149.99
      }
    ],
    total: 149.99,
    status: 'pending',
    paymentMethod: 'pix',
    createdAt: '2024-03-18T11:15:00',
    updatedAt: '2024-03-18T11:15:00'
  }
];

const mockMetrics: SalesMetrics = {
  totalRevenue: 25789.45,
  revenueGrowth: 12.5,
  averageOrderValue: 299.99,
  totalOrders: 86,
  ordersGrowth: 8.3,
  conversionRate: 3.2
};

const mockChartData = [
  { date: '01/03', revenue: 1200 },
  { date: '02/03', revenue: 1800 },
  { date: '03/03', revenue: 1600 },
  { date: '04/03', revenue: 2100 },
  { date: '05/03', revenue: 1900 },
  { date: '06/03', revenue: 2400 },
  { date: '07/03', revenue: 2200 }
];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [metrics, setMetrics] = useState<SalesMetrics>(mockMetrics);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [chartData, setChartData] = useState(mockChartData);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'debit_card':
        return 'Cartão de Débito';
      case 'pix':
        return 'PIX';
      case 'bank_transfer':
        return 'Transferência';
      default:
        return method;
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportData = () => {
    try {
      const csvContent = [
        ['ID', 'Cliente', 'Email', 'Total', 'Status', 'Método de Pagamento', 'Data'],
        ...sales.map(sale => [
          sale.id,
          sale.customer.name,
          sale.customer.email,
          sale.total,
          sale.status,
          sale.paymentMethod,
          new Date(sale.createdAt).toLocaleString('pt-BR')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success('Dados exportados com sucesso');
    } catch (error) {
      toast.error('Erro ao exportar dados');
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
            <p className="text-gray-500">Gerencie e analise suas vendas</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="12m">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <div className="flex items-center pt-1 text-sm">
                <span className={metrics.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {metrics.revenueGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {Math.abs(metrics.revenueGrowth)}%
                </span>
                <span className="text-gray-500 ml-2">vs. período anterior</span>
        </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalOrders}</div>
              <div className="flex items-center pt-1 text-sm">
                <span className={metrics.ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {metrics.ordersGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {Math.abs(metrics.ordersGrowth)}%
                </span>
                <span className="text-gray-500 ml-2">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue)}</div>
              <div className="flex items-center pt-1 text-sm">
                <span className="text-gray-500">Taxa de conversão: {metrics.conversionRate}%</span>
            </div>
          </CardContent>
          </Card>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Receita ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendas por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { status: 'Concluído', value: 65 },
                    { status: 'Pendente', value: 20 },
                    { status: 'Cancelado', value: 10 },
                    { status: 'Reembolsado', value: 5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>
              Lista completa de todas as vendas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Buscar por cliente, email ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-96"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Método de Pagamento</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {sale.customer.avatar && (
                            <img
                              src={sale.customer.avatar}
                              alt={sale.customer.name}
                              className="h-8 w-8 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium">{sale.customer.name}</p>
                            <p className="text-sm text-gray-500">{sale.customer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(sale.total)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sale.status)}>
                          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPaymentMethodText(sale.paymentMethod)}</TableCell>
                      <TableCell>
                        {new Date(sale.createdAt).toLocaleString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
