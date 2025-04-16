import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { InfoIcon } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentChartProps {
  data: {
    pix: number;
    cartao: number;
    boleto: number;
    outros: number;
  };
  total: number;
}

export function PaymentChart({ data, total }: PaymentChartProps) {
  const chartData = {
    labels: ['Pix', 'Cartão', 'Boleto', 'Outros'],
    datasets: [
      {
        data: [data.pix, data.cartao, data.boleto, data.outros],
        backgroundColor: [
          'rgb(66, 99, 235)',  // Azul para Pix
          'rgb(99, 182, 237)', // Azul claro para Cartão
          'rgb(250, 204, 21)', // Amarelo para Boleto
          'rgb(239, 68, 68)',  // Vermelho para Outros
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '60%',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Vendas por Pagamento
          <UITooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 ml-2 inline-block cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-64">Distribuição das vendas por método de pagamento</p>
            </TooltipContent>
          </UITooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="relative h-[200px] flex items-center justify-center">
          <Pie data={chartData} options={options} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-xl font-bold">{total}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 