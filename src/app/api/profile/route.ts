import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROFILES_FILE = path.join(process.cwd(), 'data', 'profiles.json');

interface ProfileData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  empresa: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  fotoPerfil?: string;
  updatedAt?: string;
}

// Função de validação
function validateProfileData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.nomeCompleto || !/^[A-Za-zÀ-ÿ\s]{3,}$/.test(data.nomeCompleto)) {
    errors.push('Nome completo inválido');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email inválido');
  }
  
  if (!data.telefone || !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.telefone)) {
    errors.push('Telefone inválido');
  }
  
  if (!data.cep || !/^\d{5}-\d{3}$/.test(data.cep)) {
    errors.push('CEP inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Função auxiliar para garantir que o diretório data existe
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Função auxiliar para ler os perfis
async function readProfiles() {
  try {
    await ensureDataDirectory();
    const content = await fs.readFile(PROFILES_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

// Função auxiliar para salvar os perfis
async function saveProfiles(profiles: any) {
  await ensureDataDirectory();
  await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

export async function GET(request: Request) {
  try {
    const profiles = await readProfiles();
    const userId = 'admin'; // Em um ambiente real, isso viria da autenticação

    return NextResponse.json({
      success: true,
      data: profiles[userId] || null
    });
  } catch (error) {
    console.error('Erro ao ler perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao ler perfil' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = 'admin'; // Em um ambiente real, isso viria da autenticação
    const profileData = await request.json();

    // Validar dados
    const validation = validateProfileData(profileData);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const profiles = await readProfiles();
    
    // Verificar se o email já está em uso por outro usuário
    const emailExists = Object.entries(profiles).some(([id, profile]) => {
      return id !== userId && (profile as ProfileData).email === profileData.email;
    });

    if (emailExists) {
      return NextResponse.json(
        { success: false, error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    profiles[userId] = {
      ...profiles[userId],
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    await saveProfiles(profiles);

    return NextResponse.json({
      success: true,
      data: profiles[userId]
    });
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao salvar perfil' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = 'admin'; // Em um ambiente real, isso viria da autenticação
    const profiles = await readProfiles();

    delete profiles[userId];
    await saveProfiles(profiles);

    return NextResponse.json({
      success: true,
      message: 'Perfil excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir perfil' },
      { status: 500 }
    );
  }
} 