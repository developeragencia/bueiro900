import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const FACEBOOK_API_VERSION = 'v18.0';
const FACEBOOK_API_BASE_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

interface SyncResponse {
  success: boolean;
  adAccounts: {
    id: string;
    name: string;
    status: string;
    currency: string;
    timezone: string;
  }[];
  pages: {
    id: string;
    name: string;
    category: string;
    followers: number;
    likes: number;
  }[];
  lastSync: Date;
}

// POST /api/facebook/business-managers/[id]/sync
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Aqui você implementaria a lógica para recuperar o token de acesso do usuário
    const accessToken = process.env.FACEBOOK_TEST_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acesso não encontrado' },
        { status: 401 }
      );
    }

    // Buscar contas de anúncio
    const adAccountsResponse = await axios.get(
      `${FACEBOOK_API_BASE_URL}/${params.id}/owned_ad_accounts`,
      {
        params: {
          access_token: accessToken,
          fields: 'id,name,account_status,currency,timezone_name',
        },
      }
    );

    // Buscar páginas
    const pagesResponse = await axios.get(
      `${FACEBOOK_API_BASE_URL}/${params.id}/owned_pages`,
      {
        params: {
          access_token: accessToken,
          fields: 'id,name,category,followers_count,fan_count',
        },
      }
    );

    const syncResponse: SyncResponse = {
      success: true,
      adAccounts: adAccountsResponse.data.data.map((account: any) => ({
        id: account.id,
        name: account.name,
        status: account.account_status === 1 ? 'active' : 'inactive',
        currency: account.currency,
        timezone: account.timezone_name,
      })),
      pages: pagesResponse.data.data.map((page: any) => ({
        id: page.id,
        name: page.name,
        category: page.category,
        followers: page.followers_count || 0,
        likes: page.fan_count || 0,
      })),
      lastSync: new Date(),
    };

    // Aqui você implementaria a lógica para salvar os dados sincronizados no banco de dados

    return NextResponse.json(syncResponse);
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return NextResponse.json(
      { error: 'Erro ao sincronizar Business Manager' },
      { status: 500 }
    );
  }
} 