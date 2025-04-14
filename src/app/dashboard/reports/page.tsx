"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  Printer
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

interface ReportMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  orderCount: number;
  conversionRate: number;
  customerRetention: number;
}

interface ReportData {
  id: string;
  date: string;
  type: 'financial' | 'sales' | 'customer' | 'inventory';
  status: 'completed' | 'processing' | 'failed';
  downloadUrl?: string;
  metrics: {
    value: number;
    change: number;
    label: string;
  }[];
}

const mockMetrics: ReportMetrics = {
  totalRevenue: 158750.00,
  revenueGrowth: 12.5,
  averageOrderValue: 450.00,
  orderCount: 352,
  conversionRate: 3.8,
  customerRetention: 78.5
};

const mockReports: ReportData[] = [
  {
    id: '1',
    date: '2024-03-18',
    type: 'financial',
    status: 'completed',
    downloadUrl: '/reports/financial-march-2024.pdf',
    metrics: [
      { value: 45000, change: 8.5, label: 'Receita' },
      { value: 120, change: -2.3, label: 'Pedidos' },
      { value: 375, change: 11.2, label: 'Ticket Médio' }
    ]
  },
  {
    id: '2',
    date: '2024-03-17',
    type: 'sales',
    status: 'completed',
    downloadUrl: '/reports/sales-march-2024.pdf',
    metrics: [
      { value: 89, change: 15.7, label: 'Vendas' },
      { value: 4.2, change: 0.5, label: 'Conversão (%)' },
      { value: 245, change: -5.1, label: 'Leads' }
    ]
  }
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [reportType, setReportType] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [metrics] = useState<ReportMetrics>(mockMetrics);
  const [reports, setReports] = useState<ReportData[]>(mockReports);

  const handleGenerateReport = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error('Por favor, selecione um período para o relatório');
      return;
    }

    setIsGenerating(true);
    try {
      // Aqui você implementaria a chamada à API para gerar o relatório
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação de chamada à API
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (reportId: string, downloadUrl: string) => {
    try {
      // Aqui você implementaria a lógica para download do relatório
      toast.success('Download iniciado');
    } catch (error) {
      toast.error('Erro ao baixar relatório. Tente novamente.');
    }
  };

  const handlePrint = async (reportId: string) => {
    try {
      // Aqui você implementaria a lógica para impressão do relatório
      window.print();
      toast.success('Relatório enviado para impressão');
    } catch (error) {
      toast.error('Erro ao imprimir relatório. Tente novamente.');
    }
  };

  const filteredReports = reports.filter(report => {
    if (reportType === 'all') return true;
    return report.type === reportType;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-500">Gere e analise relatórios detalhados</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              <FileText className="h-4 w-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Receita Total</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    R$ {metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{metrics.revenueGrowth}% este mês
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ticket Médio</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    R$ {metrics.averageOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <LineChart className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                {metrics.orderCount} pedidos no total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
                  <h3 className="text-2xl font-bold text-gray-900">{metrics.conversionRate}%</h3>
                </div>
                <PieChart className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                {metrics.customerRetention}% retenção de clientes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Selecione o período e tipo de relatório
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="w-72">
                <DatePickerWithRange
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="customer">Clientes</SelectItem>
                  <SelectItem value="inventory">Estoque</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Gerados</CardTitle>
            <CardDescription>
              Lista de relatórios disponíveis para download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Métricas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        {new Date(report.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {report.metrics.map((metric, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <span className="font-medium">{metric.label}:</span>
                              <span className="ml-2">
                                {typeof metric.value === 'number' && !metric.label.includes('%')
                                  ? metric.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                                  : metric.value}
                              </span>
                              <span className={`ml-2 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {metric.change >= 0 ? <TrendingUp className="h-4 w-4 inline" /> : <TrendingDown className="h-4 w-4 inline" />}
                                {Math.abs(metric.change)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            report.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : report.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {report.downloadUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(report.id, report.downloadUrl!)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrint(report.id)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
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
