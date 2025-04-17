import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { metricUpdateSchema } from '@/lib/validations/metrics'
import { handleError } from '@/lib/middleware/error-handler'

// GET /api/dashboard/metrics/[id] - Buscar métrica específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const metric = await prisma.dashboardMetrics.findUnique({
      where: { id: params.id }
    })

    if (!metric) {
      return NextResponse.json(
        { error: 'Métrica não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(metric)
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/dashboard/metrics/[id] - Atualizar métrica
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validar dados
    const validatedData = metricUpdateSchema.parse(body)

    // Verificar se métrica existe
    const metricExists = await prisma.dashboardMetrics.findUnique({
      where: { id: params.id }
    })

    if (!metricExists) {
      return NextResponse.json(
        { error: 'Métrica não encontrada' },
        { status: 404 }
      )
    }

    const metric = await prisma.dashboardMetrics.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(metric)
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/dashboard/metrics/[id] - Deletar métrica
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se métrica existe
    const metricExists = await prisma.dashboardMetrics.findUnique({
      where: { id: params.id }
    })

    if (!metricExists) {
      return NextResponse.json(
        { error: 'Métrica não encontrada' },
        { status: 404 }
      )
    }

    await prisma.dashboardMetrics.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Métrica deletada com sucesso' })
  } catch (error) {
    return handleError(error)
  }
} 