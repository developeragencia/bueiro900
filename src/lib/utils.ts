import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função para combinar classes do Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para formatar valores de moeda
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Função para formatar data
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Função para formatar data e hora
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Função para formatar percentual
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

// Função para converter URL em objeto UTM
export function parseUtmUrl(url: string): Record<string, string> {
  try {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);

    const result: Record<string, string> = {
      url: `${parsedUrl.origin}${parsedUrl.pathname}`,
    };

    // Extrair parâmetros UTM
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = params.get(param);
      if (value) {
        result[param] = value;
      }
    });

    return result;
  } catch (error) {
    console.error('Erro ao analisar URL:', error);
    return { url: url };
  }
}

// Função para gerar URL com parâmetros UTM
export function generateUtmUrl(baseUrl: string, params: {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}): string {
  try {
    const url = new URL(baseUrl);
    const searchParams = new URLSearchParams(url.search);

    // Adicionar parâmetros UTM
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });

    // Construir URL final
    return `${url.origin}${url.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  } catch (error) {
    console.error('Erro ao gerar URL:', error);
    return baseUrl;
  }
}

// Função para truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

// Função para gerar cores aleatórias consistentes baseadas em uma string
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}
