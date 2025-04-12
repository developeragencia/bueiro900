import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('fotoPerfil') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhuma imagem enviada' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Arquivo deve ser uma imagem' },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Imagem deve ter no máximo 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar nome único para o arquivo
    const fileName = `${uuidv4()}${path.extname(file.name)}`;
    
    // Criar diretório de uploads se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Salvar arquivo
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Retornar URL da imagem
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar upload da imagem' },
      { status: 500 }
    );
  }
} 