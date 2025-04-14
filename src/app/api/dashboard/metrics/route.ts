import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface DashboardMetrics {
  revenue: {
    total: number;
    growth: number;
    lastUpdate: Date;
  };
  customers: {
    total: number;
    active: number;
    new: number;
  };
  sales: {
    total: number;
    average: number;
    conversion: number;
  };
  integrations: {
    total: number;
    active: number;
    pending: number;
  };
}

// Dados mockados para exemplo
const mockMetrics: DashboardMetrics = {
  revenue: {
    total: 157890.45,
    growth: 12.5,
    lastUpdate: new Date(),
  },
  customers: {
    total: 1250,
    active: 980,
    new: 25,
  },
  sales: {
    total: 3456,
    average: 45.67,
    conversion: 3.2,
  },
  integrations: {
    total: 15,
    active: 12,
    pending: 3,
  },
};

// GET /api/dashboard/metrics
export async function GET(request: NextRequest) {
  try {
    // Aqui você implementaria a lógica para buscar as métricas do banco de dados
    // Por enquanto, retornamos dados mockados
    return NextResponse.json(mockMetrics);
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas do dashboard' },
      { status: 500 }
    );
  }
} 