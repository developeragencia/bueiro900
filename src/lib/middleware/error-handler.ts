import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    const errors = error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }))
    return NextResponse.json({ errors }, { status: 400 })
  }

  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  console.error('Erro não tratado:', error)
  return NextResponse.json(
    { error: 'Erro interno do servidor' },
    { status: 500 }
  )
} 