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

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

// GET /api/facebook/business-managers/[id]/settings
export async function GET() {
  const settings = {
    notifications: true,
    autoSync: false,
    frequency: 'daily',
    webhooks: {
      enabled: true,
      endpoints: ['https://api.example.com/webhook'],
    },
    integrations: {
      crm: true,
      analytics: false,
    },
    permissions: {
      read: true,
      write: true,
      admin: false,
    },
  };

  return Response.json({ settings });
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