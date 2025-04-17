import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { userCreateSchema } from '@/lib/validations/user'
import { handleError } from '@/lib/middleware/error-handler'

// GET /api/users - Listar todos os usuários
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        firebaseUid: true
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/users - Criar novo usuário
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar dados
    const validatedData = userCreateSchema.parse(body)
    
    // Verificar se usuário já existe
    const userExists = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (userExists) {
      return NextResponse.json(
        { error: 'Usuário já existe' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await hash(validatedData.password, 12)

    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    return handleError(error)
  }
} 