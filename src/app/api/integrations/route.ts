import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const integrations = await prisma.integration.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        status: true,
        category: true,
        features: true
      }
    });

    return NextResponse.json(integrations);

  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar integrações' },
      { status: 500 }
    );
  }
} 