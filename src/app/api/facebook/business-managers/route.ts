import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

// Tipos
interface FacebookBusinessManager {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  accessToken?: string;
  adAccounts: number;
  pages: number;
  lastSync?: Date;
}

// Configuração do Facebook
const FACEBOOK_API_VERSION = 'v18.0';
const FACEBOOK_API_BASE_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

// Função para obter token de acesso do Facebook
async function getFacebookAccessToken(code: string): Promise<string> {
  try {
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`,
        code,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token de acesso:', error);
    throw new Error('Falha ao obter token de acesso do Facebook');
  }
}

// Função para obter Business Managers do usuário
async function getBusinessManagers(accessToken: string): Promise<FacebookBusinessManager[]> {
  try {
    const response = await axios.get(`${FACEBOOK_API_BASE_URL}/me/businesses`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,verification_status,owned_ad_accounts{id},owned_pages{id}',
      },
    });

    return response.data.data.map((bm: any) => ({
      id: bm.id,
      name: bm.name,
      status: bm.verification_status === 'verified' ? 'active' : 'pending',
      adAccounts: bm.owned_ad_accounts?.data?.length || 0,
      pages: bm.owned_pages?.data?.length || 0,
      lastSync: new Date(),
    }));
  } catch (error) {
    console.error('Erro ao obter Business Managers:', error);
    throw new Error('Falha ao obter Business Managers do Facebook');
  }
}

// GET /api/facebook/business-managers
export async function GET(request: NextRequest) {
  try {
    // Aqui você implementaria a lógica para recuperar o token de acesso do usuário
    const accessToken = process.env.FACEBOOK_TEST_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acesso não encontrado' },
        { status: 401 }
      );
    }

    const businessManagers = await getBusinessManagers(accessToken);
    return NextResponse.json(businessManagers);
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/facebook/business-managers
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Código de autorização não fornecido' },
        { status: 400 }
      );
    }

    const accessToken = await getFacebookAccessToken(code);
    const businessManagers = await getBusinessManagers(accessToken);

    // Aqui você implementaria a lógica para salvar os Business Managers no banco de dados
    
    return NextResponse.json({
      success: true,
      businessManagers,
    });
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 