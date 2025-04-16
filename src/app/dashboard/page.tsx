"use client";

import React, { useState, useEffect } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { PaymentChart } from '@/components/dashboard/PaymentChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dataCadastro: '7dias',
    contaAnuncio: 'todas',
    plataforma: 'qualquer',
    produto: 'qualquer',
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/dashboard?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar dados');
      }

      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard - Principal</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">Atualizado há 1 minuto</p>
          <Button onClick={fetchDashboardData}>Atualizar</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Select
          value={filters.dataCadastro}
          onValueChange={(value) => setFilters(prev => ({ ...prev, dataCadastro: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Data de cadastro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7dias">Últimos 7 dias</SelectItem>
            <SelectItem value="30dias">Últimos 30 dias</SelectItem>
            <SelectItem value="90dias">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.contaAnuncio}
          onValueChange={(value) => setFilters(prev => ({ ...prev, contaAnuncio: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Conta de Anúncio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.plataforma}
          onValueChange={(value) => setFilters(prev => ({ ...prev, plataforma: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="qualquer">Qualquer</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.produto}
          onValueChange={(value) => setFilters(prev => ({ ...prev, produto: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="qualquer">Qualquer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <DashboardCard
          title="Faturamento Líquido"
          value={dashboardData.faturamentoLiquido}
          tooltip="Valor total das vendas após descontar taxas e impostos"
        />
        <DashboardCard
          title="Gastos com anúncios"
          value={dashboardData.gastosAnuncios}
          tooltip="Total gasto em campanhas publicitárias"
        />
        <DashboardCard
          title="ROAS"
          value={dashboardData.roas}
          tooltip="Retorno sobre o investimento em publicidade"
          valueClassName="text-green-600"
        />
        <DashboardCard
          title="Lucro"
          value={dashboardData.lucro}
          tooltip="Lucro líquido após todos os custos"
          valueClassName="text-green-600"
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <PaymentChart
            data={dashboardData.pagamentos}
            total={dashboardData.totalVendas}
          />
        </div>

        <div className="col-span-8 grid grid-cols-2 gap-4">
          <DashboardCard
            title="Vendas Pendentes"
            value={dashboardData.vendasPendentes}
            tooltip="Vendas aguardando confirmação de pagamento"
          />
          <DashboardCard
            title="ROI"
            value={dashboardData.roi}
            tooltip="Retorno sobre o investimento total"
            valueClassName="text-green-600"
          />
          <DashboardCard
            title="Vendas Reembolsadas"
            value={dashboardData.vendasReembolsadas}
            tooltip="Total de vendas que foram reembolsadas"
          />
          <DashboardCard
            title="Margem de Lucro"
            value={dashboardData.margemLucro}
            tooltip="Percentual de lucro sobre o faturamento"
            valueClassName="text-green-600"
          />
          <DashboardCard
            title="Imposto"
            value={dashboardData.imposto}
            tooltip="Total de impostos a serem pagos"
          />
          <DashboardCard
            title="Reembolso"
            value={dashboardData.reembolso}
            tooltip="Taxa de reembolso"
          />
          <DashboardCard
            title="Chargeback"
            value={dashboardData.chargeback}
            tooltip="Taxa de chargeback"
          />
          <DashboardCard
            title="ARPU"
            value={dashboardData.arpu}
            tooltip="Receita média por usuário"
          />
        </div>
      </div>
    </div>
  );
}
