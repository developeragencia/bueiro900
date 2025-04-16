import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dataCadastro = url.searchParams.get('dataCadastro') || '7dias';
    const contaAnuncio = url.searchParams.get('contaAnuncio');
    const plataforma = url.searchParams.get('plataforma');
    const produto = url.searchParams.get('produto');

    // Calcula a data inicial baseada no filtro
    const dataInicial = new Date();
    switch (dataCadastro) {
      case '30dias':
        dataInicial.setDate(dataInicial.getDate() - 30);
        break;
      case '90dias':
        dataInicial.setDate(dataInicial.getDate() - 90);
        break;
      default: // 7dias
        dataInicial.setDate(dataInicial.getDate() - 7);
    }

    // Busca as métricas mais recentes com os filtros aplicados
    const metricas = await prisma.dashboardMetrics.findFirst({
      where: {
        dataCadastro: {
          gte: dataInicial
        },
        ...(contaAnuncio && contaAnuncio !== 'todas' ? { contaAnuncio } : {}),
        ...(plataforma && plataforma !== 'qualquer' ? { plataforma } : {}),
        ...(produto && produto !== 'qualquer' ? { produto } : {}),
      },
      orderBy: {
        dataCadastro: 'desc'
      }
    });

    if (!metricas) {
      return NextResponse.json({
        error: 'Nenhuma métrica encontrada para os filtros selecionados'
      }, { status: 404 });
    }

    return NextResponse.json({
      faturamentoLiquido: metricas.faturamentoLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      gastosAnuncios: metricas.gastosAnuncios.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      roas: metricas.roas.toFixed(2),
      lucro: metricas.lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      vendasPendentes: metricas.vendasPendentes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      vendasReembolsadas: metricas.vendasReembolsadas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      imposto: metricas.imposto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      roi: `${metricas.roi.toFixed(1)}%`,
      margemLucro: `${metricas.margemLucro.toFixed(1)}%`,
      reembolso: `${metricas.reembolso.toFixed(1)}%`,
      arpu: metricas.arpu.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      chargeback: `${metricas.chargeback.toFixed(1)}%`,
      pagamentos: {
        pix: metricas.pixVendas,
        cartao: metricas.cartaoVendas,
        boleto: metricas.boletoVendas,
        outros: metricas.outrosVendas,
      },
      totalVendas: metricas.totalVendas,
    });
  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 