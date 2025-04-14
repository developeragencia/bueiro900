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

export const dynamic = 'force-static';

// GET /api/dashboard/metrics
export async function GET() {
  const metrics = {
    totalSales: 15000,
    totalCustomers: 250,
    averageOrderValue: 60,
    conversionRate: 2.5,
    revenueByMonth: [
      { month: 'Jan', revenue: 12000 },
      { month: 'Fev', revenue: 15000 },
      { month: 'Mar', revenue: 18000 },
      { month: 'Abr', revenue: 16000 },
      { month: 'Mai', revenue: 21000 },
      { month: 'Jun', revenue: 19000 },
    ],
    topProducts: [
      { name: 'Produto A', sales: 150 },
      { name: 'Produto B', sales: 120 },
      { name: 'Produto C', sales: 100 },
    ],
  };

  return Response.json({ metrics });
} 