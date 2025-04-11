import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { planId, paymentMethod } = await request.json();

    // Simulação de processamento de pagamento
    const plans = {
      basic: { credit: 299.90, pix: 279.90 },
      pro: { credit: 599.90, pix: 569.90 },
      enterprise: { credit: 999.90, pix: 949.90 }
    };

    const amount = plans[planId][paymentMethod];
    const transactionId = `TX-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Simulando um delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: {
        transactionId,
        planId,
        paymentMethod,
        amount,
        approved: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
} 