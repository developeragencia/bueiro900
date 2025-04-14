import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface BusinessManagerSettings {
  id: string;
  name: string;
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    ipWhitelist: string[];
    lastPasswordChange?: Date;
  };
  permissions: {
    users: {
      id: string;
      name: string;
      email: string;
      role: string;
      lastAccess?: Date;
    }[];
  };
  billing: {
    paymentMethod?: string;
    billingEmail?: string;
    taxId?: string;
  };
}

// Dados mockados para exemplo
const mockSettings: BusinessManagerSettings = {
  id: '123456789',
  name: 'Meu Business Manager',
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
  },
  security: {
    twoFactorAuth: true,
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
    lastPasswordChange: new Date('2024-01-01'),
  },
  permissions: {
    users: [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@exemplo.com',
        role: 'admin',
        lastAccess: new Date('2024-03-15'),
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        role: 'editor',
        lastAccess: new Date('2024-03-14'),
      },
    ],
  },
  billing: {
    paymentMethod: 'credit_card',
    billingEmail: 'financeiro@exemplo.com',
    taxId: '12345678901',
  },
};

// GET /api/facebook/business-managers/[id]/settings
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Aqui você implementaria a lógica para buscar as configurações do banco de dados
    // Por enquanto, retornamos dados mockados
    return NextResponse.json({
      ...mockSettings,
      id: params.id,
    });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

// PUT /api/facebook/business-managers/[id]/settings
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const settings = await request.json();

    // Aqui você implementaria a lógica para salvar as configurações no banco de dados
    // Por enquanto, apenas logamos as alterações
    console.log('Configurações atualizadas:', settings);

    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    );
  }
} 