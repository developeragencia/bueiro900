import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar dados do banco
    const totalRevenue = await prisma.sale.aggregate({
      _sum: {
        amount: true
      }
    });

    const activeCustomers = await prisma.customer.count({
      where: {
        active: true
      }
    });

    const totalSales = await prisma.sale.count();

    const totalIntegrations = await prisma.integration.count({
      where: {
        active: true
      }
    });

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      activeCustomers,
      totalSales,
      totalIntegrations
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas do dashboard' },
      { status: 500 }
    );
  }
} 