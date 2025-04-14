import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RecentActivity {
  id: string;
  type: 'sale' | 'integration' | 'customer' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'pending' | 'error';
  amount?: number;
}

// Dados mockados para exemplo
const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Nova venda realizada',
    description: 'Venda #12345 concluída com sucesso',
    timestamp: new Date(),
    status: 'success',
    amount: 299.99
  },
  {
    id: '2',
    type: 'integration',
    title: 'Integração Facebook',
    description: 'Business Manager sincronizado com sucesso',
    timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
    status: 'success'
  },
  {
    id: '3',
    type: 'customer',
    title: 'Novo cliente cadastrado',
    description: 'Cliente João Silva criou uma conta',
    timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
    status: 'pending'
  },
  {
    id: '4',
    type: 'alert',
    title: 'Alerta de sistema',
    description: 'Atualização de segurança disponível',
    timestamp: new Date(Date.now() - 86400000), // 24 horas atrás
    status: 'error'
  }
];

// GET /api/dashboard/activities
export async function GET(request: NextRequest) {
  try {
    // Aqui você implementaria a lógica para buscar as atividades do banco de dados
    // Por enquanto, retornamos dados mockados
    return NextResponse.json(mockActivities);
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar atividades recentes' },
      { status: 500 }
    );
  }
} 