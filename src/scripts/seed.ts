import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpa os dados existentes
  await prisma.dashboardMetrics.deleteMany();

  // Cria dados de exemplo
  await prisma.dashboardMetrics.create({
    data: {
      faturamentoLiquido: 635789.23,
      gastosAnuncios: 456827.90,
      roas: 1.39,
      lucro: 159887.65,
      vendasPendentes: 89289.38,
      vendasReembolsadas: 18459.20,
      imposto: 19073.68,
      roi: 35.0,
      margemLucro: 25.1,
      reembolso: 2.4,
      arpu: 238.79,
      chargeback: 0.7,
      pixVendas: 48,
      cartaoVendas: 27,
      boletoVendas: 15,
      outrosVendas: 8,
      totalVendas: 2867,
      dataCadastro: new Date(),
      contaAnuncio: 'Principal',
      plataforma: 'Facebook',
      produto: 'Curso A',
    },
  });

  console.log('Dados de exemplo criados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 