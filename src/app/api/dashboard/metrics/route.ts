import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { metricCreateSchema, metricFilterSchema } from '@/lib/validations/metrics';
import { handleError } from '@/lib/middleware/error-handler';

// GET /api/dashboard/metrics - Listar todas as métricas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validar parâmetros de filtro
    const filters = metricFilterSchema.parse({
      userId: searchParams.get('userId'),
      plataforma: searchParams.get('plataforma'),
      produto: searchParams.get('produto'),
      contaAnuncio: searchParams.get('contaAnuncio')
    });

    // Remover campos undefined
    const where = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    const metrics = await prisma.dashboardMetrics.findMany({
      where,
      orderBy: {
        dataCadastro: 'desc'
      }
    });

    // Calcular totais e médias
    const totals = metrics.reduce((acc, curr) => ({
      faturamentoLiquido: acc.faturamentoLiquido + curr.faturamentoLiquido,
      gastosAnuncios: acc.gastosAnuncios + curr.gastosAnuncios,
      lucro: acc.lucro + curr.lucro,
      totalVendas: acc.totalVendas + curr.totalVendas
    }), {
      faturamentoLiquido: 0,
      gastosAnuncios: 0,
      lucro: 0,
      totalVendas: 0
    });

    const averages = {
      roas: totals.gastosAnuncios > 0 ? totals.faturamentoLiquido / totals.gastosAnuncios : 0,
      margemLucro: totals.faturamentoLiquido > 0 ? (totals.lucro / totals.faturamentoLiquido) * 100 : 0
    };

    return NextResponse.json({
      metrics,
      totals,
      averages
    });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/dashboard/metrics - Criar nova métrica
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validatedData = metricCreateSchema.parse(body);
    
    const metric = await prisma.dashboardMetrics.create({
      data: validatedData
    });
    
    return NextResponse.json(metric);
  } catch (error) {
    return handleError(error);
  }
} 