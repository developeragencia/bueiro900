import { NextResponse } from 'next/server';

export async function generateStaticParams() {
  // Retorna um array vazio já que não precisamos gerar páginas estáticas para esta rota
  return [];
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Implementação da rota
  return NextResponse.json({ message: 'Not implemented' });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  // Implementação da rota
  return NextResponse.json({ message: 'Not implemented' });
} 