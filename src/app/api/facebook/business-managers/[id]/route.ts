import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

interface BusinessManagerDetails {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  metrics: {
    totalSpent: number;
    activeAds: number;
    reachLastMonth: number;
    clicksLastMonth: number;
  };
  adAccounts: {
    id: string;
    name: string;
    status: string;
    balance: number;
    currency: string;
  }[];
  pages: {
    id: string;
    name: string;
    category: string;
    followers: number;
    likes: number;
  }[];
  alerts: {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    date: Date;
  }[];
}

// Dados mockados para exemplo
const mockDetails: BusinessManagerDetails = {
  id: '123456789',
  name: 'Meu Business Manager',
  status: 'active',
  metrics: {
    totalSpent: 15000.50,
    activeAds: 25,
    reachLastMonth: 150000,
    clicksLastMonth: 7500,
  },
  adAccounts: [
    {
      id: 'act_123',
      name: 'Conta Principal',
      status: 'active',
      balance: 1500.75,
      currency: 'BRL',
    },
    {
      id: 'act_456',
      name: 'Conta Secundária',
      status: 'inactive',
      balance: 0,
      currency: 'BRL',
    },
  ],
  pages: [
    {
      id: 'page_123',
      name: 'Minha Página',
      category: 'E-commerce',
      followers: 25000,
      likes: 23500,
    },
    {
      id: 'page_456',
      name: 'Página Secundária',
      category: 'Serviços',
      followers: 15000,
      likes: 14200,
    },
  ],
  alerts: [
    {
      id: 'alert_1',
      type: 'warning',
      message: 'Saldo baixo em uma conta de anúncio',
      date: new Date('2024-03-15T10:30:00'),
    },
    {
      id: 'alert_2',
      type: 'error',
      message: 'Campanha pausada por violação de política',
      date: new Date('2024-03-14T15:45:00'),
    },
  ],
};

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

// GET /api/facebook/business-managers/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Simulação de dados do Business Manager
    const businessManager = {
      id,
      name: `Business Manager ${id}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(businessManager);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar Business Manager' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Simulação de atualização do Business Manager
    const updatedBusinessManager = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(updatedBusinessManager);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar Business Manager' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Simulação de exclusão do Business Manager
    return NextResponse.json({ message: `Business Manager ${id} excluído com sucesso` });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir Business Manager' },
      { status: 500 }
    );
  }
} 