import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar as últimas atividades
    const activities = await prisma.activity.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(activities);

  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar atividades do dashboard' },
      { status: 500 }
    );
  }
} 