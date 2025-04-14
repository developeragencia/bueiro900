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

// GET /api/facebook/business-managers/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Aqui você implementaria a lógica para buscar os dados reais da API do Facebook
    // Por enquanto, retornamos dados mockados
    return NextResponse.json({
      ...mockDetails,
      id: params.id,
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do Business Manager' },
      { status: 500 }
    );
  }
}

// DELETE /api/facebook/business-managers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Aqui você implementaria a lógica para remover o Business Manager
    // Por enquanto, apenas simulamos uma resposta de sucesso
    return NextResponse.json({
      success: true,
      message: 'Business Manager removido com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover:', error);
    return NextResponse.json(
      { error: 'Erro ao remover Business Manager' },
      { status: 500 }
    );
  }
} 