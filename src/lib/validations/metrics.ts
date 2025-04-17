import { z } from 'zod'

export const metricCreateSchema = z.object({
  faturamentoLiquido: z.number().min(0, 'Faturamento não pode ser negativo'),
  gastosAnuncios: z.number().min(0, 'Gastos não podem ser negativos'),
  roas: z.number().min(0, 'ROAS não pode ser negativo'),
  lucro: z.number(),
  vendasPendentes: z.number().min(0, 'Vendas pendentes não podem ser negativas'),
  vendasReembolsadas: z.number().min(0, 'Vendas reembolsadas não podem ser negativas'),
  imposto: z.number().min(0, 'Imposto não pode ser negativo'),
  roi: z.number(),
  margemLucro: z.number(),
  reembolso: z.number().min(0, 'Reembolso não pode ser negativo'),
  arpu: z.number().min(0, 'ARPU não pode ser negativo'),
  chargeback: z.number().min(0, 'Chargeback não pode ser negativo'),
  pixVendas: z.number().int().min(0, 'Número de vendas PIX não pode ser negativo'),
  cartaoVendas: z.number().int().min(0, 'Número de vendas cartão não pode ser negativo'),
  boletoVendas: z.number().int().min(0, 'Número de vendas boleto não pode ser negativo'),
  outrosVendas: z.number().int().min(0, 'Número de outras vendas não pode ser negativo'),
  totalVendas: z.number().int().min(0, 'Total de vendas não pode ser negativo'),
  contaAnuncio: z.string().optional(),
  plataforma: z.string().optional(),
  produto: z.string().optional(),
  userId: z.string().optional()
})

export const metricUpdateSchema = metricCreateSchema.partial()

export type MetricCreate = z.infer<typeof metricCreateSchema>
export type MetricUpdate = z.infer<typeof metricUpdateSchema>

export const metricFilterSchema = z.object({
  userId: z.string().optional(),
  plataforma: z.string().optional(),
  produto: z.string().optional(),
  contaAnuncio: z.string().optional()
}) 