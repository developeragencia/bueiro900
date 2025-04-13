import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('fotoPerfil') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Por favor, envie apenas imagens' },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'O arquivo deve ter no máximo 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar nome único para o arquivo
    const fileName = `${Date.now()}-${file.name}`;
    
    // Criar diretório de uploads se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Salvar arquivo
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    // Retornar URL da imagem
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o upload' },
      { status: 500 }
    );
  }
} 